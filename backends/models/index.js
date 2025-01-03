import Admin from './admin.js';
import BasicDetails from './basicDetails.js';
import Citizenship from './citizenship.js';
import Form from './form.js';
import Images from './images.js';
import OTP from './otp.js';
import PreviousEducation from './prevEdu.js';
import Student from './student.js';

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
Citizenship.hasOne(Images, {
  foreignKey: 'imageable_id',
  constraints: false,
  scope: { imageable_type: 'Citizenship' },
});

Images.belongsTo(Form, {
  foreignKey: 'imageable_id',
  constraints: false,
  scope: { imageable_type: 'Form' },
});
Form.hasOne(Images, {
  foreignKey: 'imageable_id',
  constraints: false,
  scope: { imageable_type: 'Form' },
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

// Previous Education and Student
Student.hasMany(PreviousEducation, { foreignKey: 'student_id' });
PreviousEducation.belongsTo(Student, { foreignKey: 'student_id' });

// Citizenship and Student
Student.hasOne(Citizenship, { foreignKey: 'student_id' });
Citizenship.belongsTo(Student, { foreignKey: 'student_id' });

// OTP and Student
Student.hasOne(OTP, { foreignKey: 'user_id' });
OTP.belongsTo(Student, { foreignKey: 'user_id' });

Admin.hasOne(OTP, { foreignKey: 'user_id' });
OTP.belongsTo(Admin, { foreignKey: 'user_id' });

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

