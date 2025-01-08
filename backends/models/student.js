// models/student.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import bcrypt from 'bcrypt'; // Add bcrypt for password hashing

const Student = sequelize.define('Student', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true, 
    validate: { isEmail: true }
  },
  password: { type: DataTypes.STRING, allowNull: false },
  is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'Students', timestamps: false });


export default Student;