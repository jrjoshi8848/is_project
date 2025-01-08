import { sendOtpEmail } from '../utils/nodemailer.js';
import Student from '../models/student.js';
import Admin from '../models/admin.js';
import OTP from '../models/otp.js';


const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
};

export const sendOtpReg = async (email) => {
  try {

    // Validate email
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if user exists with the given email
    const user = await Student.findOne({ where: { email } }) || await Admin.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send OTP email
    const otp = await sendOtpEmail(email);


    // Store OTP in the database associated with the student
    let otpInstance = await OTP.findOne({ where: { user_id: user.id } });

    if (otpInstance) {
      // If OTP exists, update it
      otpInstance.otp = otp;
      otpInstance.created_at = new Date();
      otpInstance.isUsed=false;
      await otpInstance.save();
    } else {
      // If OTP does not exist, create a new one
      await OTP.create({
        user_id: user.id, // Associate OTP with the user
        otp: otp,
        created_at: new Date(),
      });
    }
    console.log(otp)
    return otp;

  } catch (error) {
    console.error('Error sending OTP:', error);
    next(error); // Pass error to error handler
  }
};