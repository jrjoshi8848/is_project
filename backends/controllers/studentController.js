import bcrypt from 'bcrypt';
import Student from '../models/student.js';
import Images from '../models/images.js';
import { uploadToCloudinary } from '../config/multer.js';
import { sendOtpReg } from '../utils/sendOtp.js';
import OTP from '../models/otp.js';
import { ExpressValidator } from 'express-validator';
import BasicDetails from '../models/basicDetails.js';

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

    const user = await Student.findOne({ where: { email } });
    if (user) {
      return res.status(500).json({ message: 'User already exists' });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one digit, and one special character' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    //if()

    // Create student record
    console.log(password)
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

    if (storedOTP.isValid(otp)){
      student.is_verified = true;
      await student.save();
      storedOTP.setUsed();
      //await storedOTP.save()
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


// Create or Update Basic Details
export const fillBasicDetails = async (req, res,next) => {
  console.log(3)
  const {
    first_name,
    middle_name,
    last_name,
    phone,
    DOB,
    temporary_address,
    permanent_address,
    sex,
    fathers_name,
    grandfathers_name,
    mothers_name,
    fathers_profession,
  } = req.body;
  const profileImage = req.files ? req.files[0] : null;
  const studentId = req.user.id; // Assuming the student ID is stored in the JWT or session
  console.log(req.user)
  // Validate input
  /*const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }*/

  try {
    // Check if basic details already exist for the student
    let basicDetails = await BasicDetails.findOne({ where: { user_id: studentId } });

    if (basicDetails) {
      // Update existing basic details
      basicDetails.first_name = first_name;
      basicDetails.middle_name = middle_name;
      basicDetails.last_name = last_name;
      basicDetails.phone = phone;
      basicDetails.DOB = DOB;
      basicDetails.temporary_address = temporary_address;
      basicDetails.permanent_address = permanent_address;
      basicDetails.sex = sex;
      basicDetails.fathers_name = fathers_name;
      basicDetails.grandfathers_name = grandfathers_name;
      basicDetails.mothers_name = mothers_name;
      basicDetails.fathers_profession = fathers_profession;
      await basicDetails.save();
    } else {
      // Create new basic details
      basicDetails = await BasicDetails.create({
        user_id: studentId,
        first_name,
        middle_name,
        last_name,
        phone,
        DOB,
        temporary_address,
        permanent_address,
        sex,
        fathers_name,
        grandfathers_name,
        mothers_name,
        fathers_profession,
      });
    }

    // If a profile picture is provided, associate it
    if (profileImage) {
      const cloudinaryResult = await uploadToCloudinary(profileImage.buffer, Date.now().toString());
      const newImage = await Images.create({  
        imageable_type: 'BasicDetails',
        imageable_id: basicDetails.id,
        url:cloudinaryResult.secure_url, // Assuming you're storing the image file path
      });

      // Associate the image with BasicDetails
      basicDetails.imageId = newImage.id;
      await basicDetails.save();
    }

    return res.status(200).json({
      message: 'Basic details saved successfully',
      data: basicDetails,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default fillBasicDetails;