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
  disabled: { type: DataTypes.BOOLEAN, defaultValue: false },
  district_quota: { type: DataTypes.BOOLEAN, defaultValue: false },
  district: { type: DataTypes.STRING, allowNull: true },
  staff_quota: { type: DataTypes.BOOLEAN, defaultValue: false },
  voucher_no: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: "Under Review" },
  suggestion: { type: DataTypes.STRING, allowNull: true },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'Form',
  timestamps: false,
});

// ✅ Adding a hook to update `updated_at` automatically
Form.beforeUpdate((form) => {
  form.updated_at = new Date();  // Update the `updated_at` field to the current timestamp
});

export default Form;
