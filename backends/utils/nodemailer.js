import nodemailer from 'nodemailer';
import { randomInt } from 'crypto';  // Use the built-in crypto module to generate random OTP
import dotenv from 'dotenv';

dotenv.config()
// Create a transporter object
const transporter = nodemailer.createTransport({
  service: 'Zoho',
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_PASSWORD,   // Replace with your Zoho password (or app password)
  },
  secure: true,
});

// Function to send OTP email
export const sendOtpEmail = async (email) => {
  const otp = randomInt(100000, 999999);  // Generate a 6-digit OTP

  // Email options
  const mailOptions = {
    from: 'fwu-soe@zohomail.com',   // Your Zoho email address
    to: email,                   // The recipient's email address
    subject: 'Your OTP Code',    // Subject of the email
    text: `Your OTP code is: ${otp}`,  // Body of the email
  };

  try {
    // Send email with OTP
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
    return otp;  // You can store this OTP in a database or session for later validation
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Unable to send OTP email');
  }
};