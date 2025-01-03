// models/basicDetails.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const BasicDetails = sequelize.define('BasicDetails', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.BIGINT, allowNull: false },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  dateOfBirth: { type: DataTypes.DATE, allowNull: false },
  gender: { type: DataTypes.STRING, allowNull: false },
  phoneNumber: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: true },
}, { tableName: 'BasicDetails', timestamps: false });



export default BasicDetails;