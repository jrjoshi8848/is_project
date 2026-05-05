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
    // 1. Validate email
    if (!validateEmail(email)) {
      throw new Error('Invalid email format'); 
    }

    // 2. Find the user (Student or Admin)
    const user = await Student.findOne({ where: { email } }) || await Admin.findOne({ where: { email } });

    if (!user) {
      throw new Error('User not found'); 
    }

    // 3. Generate OTP (replace with your actual OTP generation logic)
    const otp = await sendOtpEmail(email);

    // 4. Send OTP email (replace with your actual email sending logic)
     

    // 5. Store or update OTP in the database
    let otpInstance = await OTP.findOne({ where: { user_id: user.id } });

    if (otpInstance) {
      otpInstance.otp = otp;
      otpInstance.created_at = new Date();
      otpInstance.isUsed = false;
      await otpInstance.save();
    } else {
      await OTP.create({
        user_id: user.id,
        otp: otp,
        created_at: new Date(),
      });
    }

    return { success: true, otp: otp }; 

  } catch (error) {
    console.error('Error sending OTP:', error);
    return { success: false, error: error.message }; 
  }
};