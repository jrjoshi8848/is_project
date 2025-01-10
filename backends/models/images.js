// models/image.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Image = sequelize.define('Image', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  url: { type: DataTypes.STRING, allowNull: false },
  imageable_id: { type: DataTypes.BIGINT },
  imageable_type: { type: DataTypes.STRING },
}, { tableName: 'Images', timestamps: false });


export default Image;
