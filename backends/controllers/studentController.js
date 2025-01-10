import bcrypt from 'bcrypt';
import Student from '../models/student.js';
import Images from '../models/images.js';
import { uploadToCloudinary,destroyFromCloudinary } from '../config/multer.js';
import { sendOtpReg } from '../utils/sendOtp.js';
import OTP from '../models/otp.js';
import { ExpressValidator } from 'express-validator';
import BasicDetails from '../models/basicDetails.js';
import Citizenship from '../models/citizenship.js';
import PreviousEducation from '../models/prevedu.js';
import Form from '../models/form.js';

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
  const {
    first_name,middle_name,last_name,phone,DOB,temporary_address,permanent_address,sex,fathers_name,grandfathers_name,mothers_name,fathers_profession,
  } = req.body;
  const profileImage = req.files.pp ? req.files.pp[0] : null;
  const studentId = req.user.id; // Assuming the student ID is stored in the JWT or session
  // Validate input
  /*const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }*/

  try {
    // Check if basic details already exist for the student
    let basicDetails = await BasicDetails.findOne({ where: { user_id: studentId } });

    if (basicDetails) {
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

      const existingImages = await Images.findOne({
        where: { imageable_type: 'BasicDetails', imageable_id: studentId },
      });
      if(existingImages){
        await destroyFromCloudinary(existingImages.url); // Delete from Cloudinary
          await existingImages.destroy();
      }
      const cloudinaryResult = await uploadToCloudinary(profileImage.buffer, `pp_${studentId}`);
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


export const createOrUpdateCitizenshipDetails = async (req, res, next) => {
  try {
    // Get student ID from the authenticated user
    const studentId = req.user.id;
    
    // Get details from the request body
    const { cz_no, type, issued_date, issued_district } = req.body;

    // Find existing citizenship record for the student
    let citizenship = await Citizenship.findOne({ where: { student_id: studentId } });

    const frontImage = req.files?.front ? req.files.front[0] : null;
    const backImage = req.files?.back ? req.files.back[0] : null;

    if(!frontImage || !backImage){
      console.log("missing images")
      return res.status(400).json({message:"Missing images."})
    }


    if (citizenship) {
      // Update existing details
      citizenship.citizenship_number = cz_no;
      citizenship.type = type;
      citizenship.issued_date = issued_date;
      citizenship.issued_district = issued_district;
      await citizenship.save();

      var existingImages = await Images.findAll({
        where: { imageable_type: 'Citizenship', imageable_id: citizenship.id },
      });

      
    } else {
      // ✅ If citizenship does not exist, create a new one
      citizenship = await Citizenship.create({
        student_id: studentId,
        citizenship_number:cz_no,
        type,
        issued_date,
        issued_district,
      });
    }

    if (frontImage) {
      const existingfront = existingImages.find(image => image.url.includes('citizenship_front'));
      if (existingfront) {
        await destroyFromCloudinary(existingfront.url); 
        await existingfront.destroy(); 
      const frontImageResult = await uploadToCloudinary(frontImage.buffer, `citizenship_front_${studentId}`);
      await Images.create({
        imageable_type: 'Citizenship',
        imageable_id: citizenship.id,
        url: frontImageResult.secure_url,
      });
    }};


    if (backImage) {
      const existingback = existingImages.find(image => image.url.includes('citizenship_back'));
      if (existingback) {
        await destroyFromCloudinary(existingback.url); 
        await existingback.destroy();
      const backImageResult = await uploadToCloudinary(backImage.buffer, `citizenship_back_${studentId}`);
      await Images.create({
        imageable_type: 'Citizenship',
        imageable_id: citizenship.id,
        url: backImageResult.secure_url,
      });
    }
  };

    // ✅ Return response
    return res.status(200).json({
      message: 'Citizenship details saved successfully',
      data: citizenship,
    });
  } catch (error) {
    console.error('Error in createOrUpdateCitizenshipDetails:', error);
    next(error);
  }
};




export const createOrUpdatePreviousEducation = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const { institutionName,boardName, degree, graduationYear, cgpa } = req.body;

    let prevEducation = await PreviousEducation.findOne({
      where: { student_id: studentId, degree: degree }
    });

    const transcript = req.files?.transcript ? req.files.transcript[0]:null;
    const cc = req.files?.cc ? req.files.cc[0] :null;

    if(!prevEducation && (!cc || ! transcript)){
      console.log("missing docs")
      return res.status(400).json({message:"Missing docs."})
    }

    if (prevEducation) {
      prevEducation.institutionName = institutionName;
      prevEducation.boardName=boardName;
      prevEducation.graduationYear = graduationYear;
      prevEducation.cgpa = cgpa;
      await prevEducation.save();

      
      const existingImages = await Images.findAll({
        where: { imageable_type: 'PreviousEducation', imageable_id: prevEducation.id },
      });

      if (transcript) {
        const existingTranscript = existingImages.find(image => image.url.includes('transcript'));
        if (existingTranscript) {
          await destroyFromCloudinary(existingTranscript.url); 
          await existingTranscript.destroy(); 
        }
      }

      if (cc) {
        const existingCC = existingImages.find(image => image.url.includes('cc'));
        if (existingCC) {
          await destroyFromCloudinary(existingCC.url); 
          await existingCC.destroy(); 
        }
      }
    } else {
      prevEducation = await PreviousEducation.create({
        student_id: studentId,
        institutionName,
        boardName,
        degree,
        graduationYear,
        cgpa
      });
    }

    if (transcript) {
      const transcriptResult = await uploadToCloudinary(transcript.buffer, `transcript_${studentId}`);
      await Images.create({
        imageable_type: 'PreviousEducation',
        imageable_id: prevEducation.id,
        url: transcriptResult.secure_url,
      });
    }

    if (cc) {
      const ccResult = await uploadToCloudinary(cc.buffer, `cc_${studentId}`);
      await Images.create({
        imageable_type: 'PreviousEducation',
        imageable_id: prevEducation.id,
        url: ccResult.secure_url,
      });
    }

    return res.status(200).json({
      message: 'Previous education details saved successfully',
      data: prevEducation,
    });
  } catch (error) {
    console.error('Error in createOrUpdatePreviousEducation:', error);
    next(error);
  }
};



export const createOrUpdateForm = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const { women, madheshi, dalit, adibashi_janjati, backward_region, disabled, district_quota,
       district, staff_quota, voucher_no } = req.body;
    console.log({ women, madheshi, dalit, adibashi_janjati, backward_region, disabled, district_quota,
      district, staff_quota, voucher_no })

    let form = await Form.findOne({
      where: { student_id: studentId },
    });

    // Required fields
    const voucherImage = req.files?.voucher ? req.files.voucher[0] : null;

    if (!form && !voucherImage) {
      return res.status(400).json({ message: 'Voucher image is required.' });
    }

    const basicDetails = await BasicDetails.findOne({ where: { user_id: studentId } });
    const citizenship = await Citizenship.findOne({ where: { student_id: studentId } });
    const previousEducation = await PreviousEducation.findOne({ where: { student_id: studentId } });

    // Return error if any associated instance is missing
    if (!basicDetails) {
      return res.status(400).json({ message: 'Please complete your Basic Details before submitting the form.' });
    }
    if (!citizenship) {
      return res.status(400).json({ message: 'Please complete your Citizenship details before submitting the form.' });
    }
    if (!previousEducation) {
      return res.status(400).json({ message: 'Please complete your Previous Education details before submitting the form.' });
    }

    
     if(((disabled=='true'|| disabled =='1' )&& !req.files.disabled_image)||((staff_quota ==true || staff_quota=='1') && !req.files.staff_image)){
       return res.status(400).json({ message: 'Please add all the proofs.' });
     }

    if (form) {
      form.women = women;
      form.madheshi = madheshi;
      form.dalit = dalit;
      form.adibashi_janjati = adibashi_janjati;
      form.backward_region = backward_region;
      form.disabled = disabled;
      form.district_quota = district_quota;
      form.district=district;
      form.staff_quota = staff_quota;
      form.voucher_no = voucher_no;
      await form.save();

      // Handling existing images for voucher
      const existingImages = await Images.findAll({
        where: { imageable_type: 'Form', imageable_id: form.id },
      });

      // Remove old voucher image if updated
      if (voucherImage) {
        const existingVoucher = existingImages.find(image => image.url.includes('voucher'));
        if (existingVoucher) {
          await destroyFromCloudinary(existingVoucher.url);
          await existingVoucher.destroy();
        }
      }
    } else {
      form = await Form.create({
        student_id: studentId,
        women,
        madheshi,
        dalit,
        adibashi_janjati,
        backward_region,
        disabled,
        district_quota,
        district,
        staff_quota,
        voucher_no,
      });
    }

    // Upload and associate the voucher image
    if (voucherImage) {
      const voucherResult = await uploadToCloudinary(voucherImage.buffer, `voucher_${studentId}`);
      await Images.create({
        imageable_type: 'Form',
        imageable_id: form.id,
        url: voucherResult.secure_url,
      });
    }

    // Handle and delete previous disabled image if any
    if (disabled && req.files?.disabled_image) {
      const disabledImage = req.files.disabled_image[0];
      const existingDisabledImage = existingImages.find(image => image.url.includes('disabled'));

      // If an existing disabled image is found, delete it before uploading the new one
      if (existingDisabledImage) {
        await destroyFromCloudinary(existingDisabledImage.url);
        await existingDisabledImage.destroy();
      }

      // Upload the new disabled image
      const disabledResult = await uploadToCloudinary(disabledImage.buffer, `disabled_${studentId}`);
      await Images.create({
        imageable_type: 'Form',
        imageable_id: form.id,
        url: disabledResult.secure_url,
      });
    }

    // Handle and delete previous staff image if any
    if (staff_quota && req.files?.staff_image) {
      const staffImage = req.files.staff_image[0];
      const existingStaffImage = existingImages.find(image => image.url.includes('staff'));

      // If an existing staff image is found, delete it before uploading the new one
      if (existingStaffImage) {
        await destroyFromCloudinary(existingStaffImage.url);
        await existingStaffImage.destroy();
      }

      // Upload the new staff image
      const staffResult = await uploadToCloudinary(staffImage.buffer, `staff_${studentId}`);
      await Images.create({
        imageable_type: 'Form',
        imageable_id: form.id,
        url: staffResult.secure_url,
      });
    }

    return res.status(200).json({
      message: 'Form details saved successfully',
      data: form,
    });
  } catch (error) {
    console.error('Error in createOrUpdateForm:', error);
    next(error);
  }
};