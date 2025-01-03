// models/student.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import bcrypt from 'bcryptjs'; // Add bcrypt for password hashing

const Student = sequelize.define('Student', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true, 
    validate: { isEmail: true }
  },
  password: { type: DataTypes.STRING, allowNull: false },
  is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'Students', timestamps: false });

// Password hashing hook before creating or updating
Student.beforeCreate(async (student) => {
  if (student.password) {
    student.password = await bcrypt.hash(student.password, 10);
  }
});

Student.beforeUpdate(async (student) => {
  if (student.password) {
    student.password = await bcrypt.hash(student.password, 10);
  }
});

// Method to validate password
Student.prototype.isValidPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export default Student;
