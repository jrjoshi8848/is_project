import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Form = sequelize.define('Form', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  student_id: {
    type: DataTypes.BIGINT,
    references: { model: 'Students', key: 'id' },
    allowNull: false,
  },
  women: { type: DataTypes.BOOLEAN, defaultValue: false },
  madheshi: { type: DataTypes.BOOLEAN, defaultValue: false },
  dalit: { type: DataTypes.BOOLEAN, defaultValue: false },
  adibashi_janjati: { type: DataTypes.BOOLEAN, defaultValue: false },
  backward_region: { type: DataTypes.BOOLEAN, defaultValue: false },
  disabled: { type: DataTypes.BOOLEAN, defaultValue: false },  // Category if selected
  district_quota: { type: DataTypes.BOOLEAN, defaultValue: false },  
  district: { type: DataTypes.STRING, allowNull: true },  // Selected District for quota
  staff_quota: { type: DataTypes.BOOLEAN, defaultValue: false },
  voucher_no: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue:"Under Review" }, 
  suggestion: { type: DataTypes.STRING, allowNull: true }, // Proof document URL for staff quota
}, {
  tableName: 'Form',
  timestamps: false,
});

export default Form;