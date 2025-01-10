// models/otp.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const OTP = sequelize.define('OTP', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  otp: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.BIGINT },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  isUsed: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'OTP', timestamps: false });

// Method to check if OTP is valid (not used or expired)
OTP.prototype.isValid = function (otp) {
  const now = new Date();
  const expirationTime = new Date(this.created_at);
  expirationTime.setMinutes(expirationTime.getMinutes() + 5);  // OTP expires 5 minutes after creation

  if ((!this.isUsed && now < expirationTime)&& otp==this.otp) {
    return true;
  }
  return false;
};
OTP.prototype.setUsed=async function(){
  try{
    this.isUsed=true;
    await this.save()
    return true;
  }catch(error){
    console.log(error);
    return false;
  }
}

export default OTP;
