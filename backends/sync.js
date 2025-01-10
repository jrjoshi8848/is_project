
import sequelize from './config/db.js'; // Sequelize instance
import Admin from './models/admin.js';
import BasicDetails from './models/basicDetails.js';
import Citizenship from './models/citizenship.js';
import Images from './models/images.js';
import OTP from './models/otp.js';
import PreviousEducation from './models/prevedu.js';
import Student from './models/student.js';
import Form from './models/form.js';

const syncDb = async () => {
  try {
    await sequelize.sync({ alter: true,logging: console.log }); // Automatically syncs the models to the database
    console.log('Database synced successfully.');

  } catch (error) {
    console.error('Error syncing the database:', error);
  }
};

syncDb();