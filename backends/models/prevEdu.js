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

PreviousEducation.beforeCreate(async (prevEdu, options) => {
  const count = await PreviousEducation.count({
    where: { student_id: prevEdu.student_id },
  });

  if (count >= 2) {
    console.log("More than 2 prev educations are not allowed");
    throw new Error('A student can only have up to 2 previous education records.');
  }
});


export default PreviousEducation;
