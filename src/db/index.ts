import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  username: 'root',
  password: 'root',
  database: 'url_shortener'
});
