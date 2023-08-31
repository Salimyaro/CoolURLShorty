import { Request, Response } from 'express';
import { Url } from '../db/url';
import { randomString } from '../utils/randomString';
import Redis from 'ioredis';
import logger from '../utils/winstonLogger';

const redis = new Redis();

export const shortenUrl = async (req: Request, res: Response) => {
  try {
    const { longUrl } = req.body;

    let urlObject;
    try {
      urlObject = new URL(longUrl);
    } catch (e) {
      logger.error(`Invalid URL: ${longUrl}`);
      return res.status(400).json({ error: 'Invalid URL' });
    }

    const modifiedBase = `${urlObject.protocol}//${urlObject.hostname.substring(0, 7)}_`;

    const shortUrlCode = randomString(6);

    const completeShortUrl = `${modifiedBase}/${shortUrlCode}`;

    await Url.create({ longUrl, shortUrl: completeShortUrl });
    await redis.set(shortUrlCode, longUrl);

    logger.info(`Shortened URL: ${completeShortUrl} for Long URL: ${longUrl}`);

    res.json({ shortUrl: completeShortUrl });
  } catch (error) {
    logger.error(`Error in shortenUrl: ${error}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const resolveUrl = async (req: Request, res: Response) => {
  try {
    const shortUrl = req.query.short_url as string;
    let longUrl = await redis.get(shortUrl);

    if (!longUrl) {
      const urlRecord = await Url.findOne({ where: { shortUrl } });
      if (urlRecord) {
        longUrl = urlRecord.longUrl;
        await redis.set(shortUrl, longUrl);
      } else {
        logger.warn(`Long URL not found for short URL: ${shortUrl}`);
        return res.status(404).json({ error: 'URL not found' });
      }
    }

    logger.info(`Resolved Short URL: ${shortUrl} to Long URL: ${longUrl}`);
    
    res.json({ longUrl });
  } catch (error) {
    logger.error(`Error in resolveUrl: ${error}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const closeRedisConnection = async () => {
  await redis.quit();
};