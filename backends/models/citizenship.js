import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Citizenship = sequelize.define('Citizenship', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  citizenship_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  issued_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  issued_district: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  student_id: {
    type: DataTypes.BIGINT,
    references: {
      model: 'Students',  // Ensure it references the 'Students' table
      key: 'id',
    },
    allowNull: false,  // You can adjust whether it is nullable based on your requirements
  }
}, {
  tableName: 'Citizenship',
  timestamps: false,
});

export default Citizenship;
