// models/refreshToken.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const RefreshToken = sequelize.define('RefreshToken', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  token: { type: DataTypes.STRING, allowNull: false },
  user_id: { type: DataTypes.BIGINT },
  expires_at: { type: DataTypes.DATE },
}, { tableName: 'RefreshTokens', timestamps: false });

export default RefreshToken;
