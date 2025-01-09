// models/previousEducation.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const PreviousEducation = sequelize.define('PreviousEducation', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  student_id: {
    type: DataTypes.BIGINT,
    references: {model: 'Students',  key: 'id',},allowNull: false, 
  },
  boardName: { type: DataTypes.STRING, allowNull: false },
  institutionName: { type: DataTypes.STRING, allowNull: false },
  degree: { type: DataTypes.STRING, allowNull: false },
  graduationYear: { type: DataTypes.INTEGER, allowNull: false },
  cgpa: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'PreviousEducation', timestamps: false });


export default PreviousEducation;
