import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendOtpEmail } from '../utils/nodemailer.js';  // OTP sending function
import Student from '../models/student.js';
import { generateTokens } from '../utils/jwtUtils.js';
import RefreshToken from '../models/refreshToken.js';
import Admin from '../models/admin.js';
import { validationResult } from 'express-validator';
import { sendOtpReg } from '../utils/sendOtp.js';
import OTP from '../models/otp.js';


export const loginStudent = async (req, res, next) => {
  try {
     const { email, password } = req.body;

  const errors = validationResult(req);
  if (!email || !password) {
    return res.status(400).json({message:"Missing Fields"});
  }

  
    // Find student by email
    const student = await Student.findOne({
      where: { email },
      attributes: ['id', 'email', 'password', 'is_verified'],  // Exclude student_id
    });
    console.log(student);
    if (!student) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    // Compare the entered password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, student.password);
    console.log(isPasswordValid)
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if student is verified (optional)
    //if (!student.is_verified) {
     // return res.status(403).json({ message: 'Account is not verified yet' });
   // }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(student,'student');

    // Store refresh token in the database
    await RefreshToken.create({
      token: refreshToken,
      user_id: student.id,
      expires_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),  // 7 days
    });

    // Send tokens to the client
    res.cookie('refreshToken', refreshToken, {
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
      maxAge: 10 * 24 * 60 * 60 * 1000,  // 7 days
    });

    return res.status(200).json({ accessToken });

  } catch (error) {
    next(error);
  }
};



export const reqOtp=async (req,res,next)=>{
try{
  const {email}=req.body;
 if(!email){
  return res.status(400).json({message:"Email required"})
 }
 const otp=sendOtpReg(email);
 console.log(otp)
 return res.status(200).json({message:"OTP sent successfully"})

}catch(error){
  next(error);
}
};

export const reqOtpWithId=async (req,res,next)=>{
  try{
   const email = req.user.email;

   const user = await Student.findOne({ where: {email } }) || await Admin.findOne({ where: { email } });

   const otp=sendOtpReg(user.email);
   console.log(otp)
   return res.status(200).json({message:"OTP sent successfully"})
  
  }catch(error){
    next(error);
  }
  };


export const resetPass=async (req,res,next)=>{
  try{

    const {email,otp,newPass}=req.body;

    if(!email||!otp||!newPass){
      return res.status(400).json({message:"Missing fields"});
    }

    const user=await Student.findOne({where:{email}}) || await Admin.findOne({where :{email}});
    if(!user){
      console.log("user not found")
      return res.status(400).json({message:"User not found"});
    }

    const storedOTP=await OTP.findOne({where:{user_id:user.id}})
    if(!storedOTP){
      return res.status(400).json({message:"Invalid otp"})
    }
    console.log(storedOTP.isValid(otp))

    if(storedOTP.isValid(otp)){
      const pass=await bcrypt.hash(newPass,10)
      user.password=pass;
      await user.save();
      await storedOTP.setUsed();
      return res.status(200).json({message:"Password reset successfully"});
    }
    return res.status(500).json({message:"Internal server error"})

  }catch(error){
    next(error)
  }
};


export const resetPassWithId=async (req,res,next)=>{
  try{

    const email = req.user.email;

    const {otp,newPass}=req.body;

    if(!otp||!newPass){
      return res.status(400).json({message:"Missing fields"});
    }

    const user=await Student.findOne({where:{email}}) || await Admin.findOne({where :{email}});
    if(!user){
      console.log("user not found")
      return res.status(400).json({message:"User not found"});
    }

    const storedOTP=await OTP.findOne({where:{user_id:user.id}})
    if(!storedOTP){
      return res.status(400).json({message:"Invalid otp"})
    }
    console.log(storedOTP.isValid(otp))

    if(storedOTP.isValid(otp)){
      const pass=await bcrypt.hash(newPass,10)
      user.password=pass;
      await user.save();
      await storedOTP.setUsed();
      return res.status(200).json({message:"Password reset successfully"});
    }
    return res.status(500).json({message:"Internal server error"})

  }catch(error){
    next(error)
  }
};




export const refreshAccessToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' });
    }

    // Check if the refresh token exists in the database
    const tokenEntry = await RefreshToken.findOne({ where: { token: refreshToken } });
    if (!tokenEntry) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Verify the refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired refresh token' });
      }

      // Generate a new access token
      const newAccessToken = jwt.sign(
        { id: decoded.id, role: decoded.role },
        process.env.JWT_SECRET,
        { expiresIn: '10h' }
      );

      return res.status(200).json({ accessToken: newAccessToken });
    });

  } catch (error) {
    next(error);
  }
};





// Controller for admin login (with OTP logic)
export const adminLogin = async (req, res, next) => {
  const { email, password, otpCode } = req.body;

  try {
    const user = await User.findOne({ where: { email, role: 'admin' } });
    if (!user) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    if (!otpCode) {
      await sendOtpEmail(user.email);  // OTP sent to admin email
      return res.status(200).json({ message: 'OTP sent to admin email' });
    }

    const isValidOtp = await validateOtp(user.id, otpCode);  // Assume validateOtp checks OTP
    if (!isValidOtp) {
      return res.status(403).json({ message: 'Invalid OTP code' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
    res.status(200).json({ message: 'Admin logged in successfully', token });
  } catch (error) {
    next(error);
  }
};
