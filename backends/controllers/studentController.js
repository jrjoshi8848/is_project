import bcrypt from 'bcrypt';
import Student from '../models/student.js';
import Images from '../models/images.js';
import { uploadToCloudinary } from '../config/multer.js';
import { sendOtpReg } from '../utils/sendOtp.js';
import OTP from '../models/otp.js';

// Password validation (backend)
const validatePassword = (password) => {
  // Regex for validating password: 
  // - Minimum 8 characters
  // - At least one lowercase letter
  // - At least one uppercase letter
  // - At least one number
  // - At least one special character
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
  return regex.test(password);
};

// Register student

export const checkUsername = async (req, res, next) => {
  try {
    const { username } = req.body;

    if (!username || username.trim() === '') {
      return res.status(400).json({ message: 'Username is required.' });
    }

    const existingUser = await Student.findOne({ where: { username } });

    if (existingUser) {
      return res.status(409).json({ message: 'Username is already taken.' });
    }

    res.status(200).json({ message: 'Username is available.' });
  } catch (error) {
    next(error); // Pass errors to the error handler middleware
  }
};



export const registerStudent = async (req, res, next) => {
  const { username, email, password } = req.body;
  const profileImage = req.files ? req.files[0] : null;

  try {
    // Validate password strength
    if (!validatePassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one digit, and one special character' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    //if()

    // Create student record
    const newStudent = await Student.create({
      username,
      email,
      password: hashedPassword,
    });

    // Handle profile image if uploaded
    if (profileImage) {
      const cloudinaryResult = await uploadToCloudinary(profileImage.buffer, Date.now().toString());

      // Save image to the database
      const newImage = await Images.create({
        url: cloudinaryResult.secure_url,
        imageable_id: newStudent.id,
        imageable_type: 'Student',
      });

      newStudent.profile_image_id = newImage.id;
      await newStudent.save();
    }

    sendOtpReg(email);

    res.status(201).json({
      message: 'Student registered successfully & otp sent',
      student: newStudent,
    });
  } catch (error) {
    next(error);  // Pass error to the global error handler
  }
};

export const verifyOtp=async(req,res,next)=>{
  try{
    const {email,otp}=req.body;

    const student=await Student.findOne({where:{email:email}});

    if(!student){
      console.log('Student not found');
      res.status(400).json({
        message: 'Student Not Found'
      });
    }

    const storedOTP =await OTP.findOne({where: {user_id : student.id}});
    if(!storedOTP){
      console.log('Otp not found');
      res.status(400).json({
        message: 'Invalid OTP.'
      });
    }

    if (storedOTP.otp == otp && storedOTP.isValid()){
      student.is_verified = true;
      await student.save();
      storedOTP.isUsed=true;
      await storedOTP.save()
      res.status(200).json({
        message:'Student verified successfully'
      });
    }
    else{
      res.status(400).json({
        message:'Invalid otp'
      });
    }

  } catch (error) {
    next(error);  // Pass error to the global error handler
  }

};
