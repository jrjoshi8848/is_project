// models/citizenshipDetails.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const CitizenshipDetails = sequelize.define('CitizenshipDetails', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.BIGINT, allowNull: false },
  citizenshipNumber: { type: DataTypes.STRING, allowNull: false },
  country: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'CitizenshipDetails', timestamps: false });



export default CitizenshipDetails;
