// models/previousEducation.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const PreviousEducation = sequelize.define('PreviousEducation', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.BIGINT, allowNull: false },
  institutionName: { type: DataTypes.STRING, allowNull: false },
  degree: { type: DataTypes.STRING, allowNull: false },
  graduationYear: { type: DataTypes.INTEGER, allowNull: false },
  grade: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'PreviousEducation', timestamps: false });


export default PreviousEducation;
