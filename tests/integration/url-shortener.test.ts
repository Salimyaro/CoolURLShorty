import request from 'supertest';
import { app } from '../../src/index';
import { sequelize } from "../../src/db/index";
import { closeRedisConnection } from '../../src/controllers/urlController';

describe('URL Shortener API', () => {
  it('should shorten a URL', async () => {
    const response = await request(app).post('/shorten').send({ longUrl: 'http://example.com' });
    expect(response.status).toBe(200);
    expect(response.body.shortUrl).toBeDefined();
  });

  it('should create a short URL with specific structure', async () => {
    const longUrl = 'https://www.e2xample.com/jhafgahdfjasda?data=qwesad2';
    const shortResponse = await request(app).post('/shorten').send({ longUrl });
    const shortUrl = shortResponse.body.shortUrl;

    expect(shortUrl).toMatch(/^https:\/\/www\.e2x_/);
    expect(shortUrl.split('/').pop()).toHaveLength(6);
  });

  it('should not shorten an invalid URL', async () => {
    const response = await request(app).post('/shorten').send({ longUrl: 'invalid_url' });
    expect(response.status).toBe(400);
  });

  it('should retrieve the original URL', async () => {
    const shortResponse = await request(app).post('/shorten').send({ longUrl: 'https://www.example.com/jhafgahdfjasda?data=qwesad' });
    const shortUrl = shortResponse.body.shortUrl;
  
    const response = await request(app).get(`/resolve?short_url=${shortUrl}`);
    expect(response.status).toBe(200);
    expect(response.body.longUrl).toBe('https://www.example.com/jhafgahdfjasda?data=qwesad');
  });
  
});

afterAll(async () => {
  await closeRedisConnection();
  await sequelize.close();
  console.log("Closed all connections.");
});