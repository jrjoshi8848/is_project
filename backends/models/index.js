// Import all models first
import Admin from './admin.js';
import BasicDetails from './basicDetails.js';
import Citizenship from './citizenship.js';
import Images from './images.js';
import OTP from './otp.js';
import PreviousEducation from './prevedu.js';
import Student from './student.js';
import Form from './form.js'; // Ensure Form is imported after Student and before associations

// Associations

// Basic Details and Student
Student.hasOne(BasicDetails, { foreignKey: 'user_id' });
BasicDetails.belongsTo(Student, { foreignKey: 'user_id' });

// Form and Student
Student.hasOne(Form, { foreignKey: 'student_id' });
Form.belongsTo(Student, { foreignKey: 'student_id' });

// Polymorphic Association for Images
Images.belongsTo(Citizenship, {
  foreignKey: 'imageable_id',
  constraints: false,
  scope: { imageable_type: 'Citizenship' },
});
Citizenship.hasMany(Images, {
  foreignKey: 'imageable_id',
  constraints: false,
  scope: { imageable_type: 'Citizenship' },
});

Images.belongsTo(BasicDetails, {
  foreignKey: 'imageable_id',
  constraints: false,
  scope: { imageable_type: 'BasicDetails' },
});
BasicDetails.hasOne(Images, {
  foreignKey: 'imageable_id',
  constraints: false,
  scope: { imageable_type: 'BasicDetails' },
});

Images.belongsTo(Student, {
  foreignKey: 'imageable_id',
  constraints: false,
  scope: { imageable_type: 'Student' },
});
Student.hasOne(Images, {
  foreignKey: 'imageable_id',
  constraints: false,
  scope: { imageable_type: 'Student' },
});

Images.belongsTo(Admin, {
  foreignKey: 'imageable_id',
  constraints: false,
  scope: { imageable_type: 'Admin' },
});
Admin.hasOne(Images, {
  foreignKey: 'imageable_id',
  constraints: false,
  scope: { imageable_type: 'Admin' },
});

Images.belongsTo(Form, {
  foreignKey: 'imageable_id',
  constraints: false,
  scope: { imageable_type: 'Form' },
});
Form.hasMany(Images, {
  foreignKey: 'imageable_id',
  constraints: false,
  scope: { imageable_type: 'Form' },
});

// Previous Education and Student
PreviousEducation.hasMany(Student, { foreignKey: 'student_id' });
Student.belongsTo(PreviousEducation, { foreignKey: 'student_id' });

// Citizenship and Student
Citizenship.hasOne(Student, { foreignKey: 'student_id' });
Student.belongsTo(Citizenship, { foreignKey: 'student_id' });

// OTP and Student
Student.hasOne(OTP, { foreignKey: 'user_id' });
OTP.belongsTo(Student, { foreignKey: 'user_id' });

Admin.hasOne(OTP, { foreignKey: 'user_id' });
OTP.belongsTo(Admin, { foreignKey: 'user_id' });

// Form belongs to Citizenship, BasicDetails, and PreviousEducation
Form.belongsTo(Citizenship, { foreignKey: 'student_id' });
Form.belongsTo(BasicDetails, { foreignKey: 'student_id' });
Form.belongsTo(PreviousEducation, { foreignKey: 'student_id' });

export {
  Admin,
  BasicDetails,
  Citizenship,
  Form,
  Images,
  OTP,
  PreviousEducation,
  Student,
};
