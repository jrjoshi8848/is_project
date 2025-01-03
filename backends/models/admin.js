// models/admin.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import bcrypt from 'bcryptjs';

const Admin = sequelize.define('Admin', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true, 
    validate: { isEmail: true }
  },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'admin' },
}, { tableName: 'Admins', timestamps: false });

// Password hashing hook before creating or updating
Admin.beforeCreate(async (admin) => {
  if (admin.password) {
    admin.password = await bcrypt.hash(admin.password, 10);
  }
});

Admin.beforeUpdate(async (admin) => {
  if (admin.password) {
    admin.password = await bcrypt.hash(admin.password, 10);
  }
});

// Method to validate password
Admin.prototype.isValidPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export default Admin;
