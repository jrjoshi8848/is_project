import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const BasicDetails = sequelize.define('BasicDetails', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.BIGINT, allowNull: false },
  first_name: { type: DataTypes.STRING, allowNull: false },
  middle_name: { type: DataTypes.STRING, allowNull: true },  // Middle name is optional
  last_name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.BIGINT, allowNull: false },
  DOB: { type: DataTypes.DATE, allowNull: false },
  temporary_address: { type: DataTypes.STRING, allowNull: true },  // Optional address
  permanent_address: { type: DataTypes.STRING, allowNull: true },  // Optional address
  sex: { type: DataTypes.STRING, allowNull: false },
  fathers_name: { type: DataTypes.STRING, allowNull: true },  // Optional, could be null
  grandfathers_name: { type: DataTypes.STRING, allowNull: true },  // Optional, could be null
  mothers_name: { type: DataTypes.STRING, allowNull: true },  // Optional, could be null
  fathers_profession: { type: DataTypes.STRING, allowNull: true },  // Optional, could be null
}, { tableName: 'BasicDetails', timestamps: false });

export default BasicDetails;