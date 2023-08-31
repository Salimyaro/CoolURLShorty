import { Model, DataTypes } from 'sequelize';
import { sequelize } from './index';

export class Url extends Model {
  public id!: number;
  public longUrl!: string;
  public shortUrl!: string;
}

Url.init(
  {
    longUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shortUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'urls',
  }
);
