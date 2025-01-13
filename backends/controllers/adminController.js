import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendOtpReg } from '../utils/sendOtp.js';
import { generateTokens } from '../utils/jwtUtils.js';
import Form from '../models/form.js';
import RefreshToken from '../models/refreshToken.js';
import { OTP,Admin,Student,Images,Citizenship,BasicDetails,PreviousEducation } from '../models/index.js';

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find admin by email
    const user = await Admin.findOne({ where: { email } });

    // Check if admin exists and password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Step 1: Generate and send OTP to the admin
    const otp = await sendOtpReg(email);
    if (otp) {
      return res.status(200).json({ message: 'OTP sent successfully. Please enter the OTP to proceed.' });
    }

    res.status(500).json({ message: 'Error sending OTP' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in admin', error });
  }
};

// Function to verify the OTP and generate the JWT token if OTP is valid
export const verifyAdminOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find admin by email
    const user = await Admin.findOne({ where: { email} });
    if (!user) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if(!user){
      console.log('User not found');
      res.status(400).json({
        message: 'User Not Found'
      });
    }
    // Step 2: Verify the OTP entered by the admin
    const storedOTP =await OTP.findOne({where: {user_id : user.id}});
    if(!storedOTP){
      console.log('Otp not found');
      res.status(400).json({
        message: 'Invalid OTP.'
      });
    }
    if (storedOTP.isValid(otp)){
      storedOTP.setUsed();
      const { accessToken, refreshToken } = generateTokens(user,'Admin');

    // Store refresh token in the database
    await RefreshToken.create({
      token: refreshToken,
      user_id: user.id,
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
    }

   
    res.status(200).json({ message: 'Admin login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying OTP for admin', error });
  }
};


export const getFullFormDetailswithId = async (req, res, next) => {
  try {
    const {formId} = req.body;

    let form = await Form.findOne({where: { id: formId }});
    const studentId=form.student_id;

    if (!form) {
      return res.status(404).json({ message: 'Form details not found for this student.' });
    }
    form=form.toJSON();
    const existingImages = await Images.findAll({
      where: { imageable_type: 'Form', imageable_id: form.id },
    });
    const voucher = existingImages.find(image => image.url.includes('voucher'));
    form.voucher=voucher.url;
    const disabledImage = existingImages.find(image => image.url.includes('disabled'));
    if(disabledImage)
      form.disabledImage=disabledImage.url;
    const staffImage = existingImages.find(image => image.url.includes('staff'));
    if(staffImage)
      form.staffImage=staffImage.url;
    console.log(form)



    let basicDetails = await BasicDetails.findOne({where: { user_id: studentId }});
    if (!basicDetails) {
      return res.status(404).json({ message: 'Basic details not found for this student.' });
    }
    const ppImage = await Images.findOne({
      where: { imageable_type: 'BasicDetails', imageable_id: studentId },
    });
    basicDetails=basicDetails.toJSON();
    basicDetails.pp=ppImage.url;
    console.log("basicDetails :",basicDetails)


    let citizenship = await Citizenship.findOne({
      where: { student_id: studentId }
    });

    if (!citizenship) {
      return res.status(404).json({ message: 'Citizenship details not found for this student.' });
    }
    var citiimages = await Images.findAll({
      where: { imageable_type: 'Citizenship', imageable_id: citizenship.id },
    });
    const front = citiimages.find(image => image.url.includes('citizenship_front'));
    const back = citiimages.find(image => image.url.includes('citizenship_back'));
    citizenship=citizenship.toJSON();
    citizenship.front=front.url;
    citizenship.back=back.url;
    console.log(citizenship)


    let prevEducation = await PreviousEducation.findAll({
      where: { student_id: studentId },
    });

    if (!prevEducation || prevEducation.length === 0) {
      return res.status(404).json({ message: 'Previous education details not found for this student.' });
    }
    if (prevEducation) {
      prevEducation = prevEducation.map((item) => item.toJSON());
      console.log(prevEducation); // Logs an array of plain JSON objects
    }
    //console.log(prevEducation)
    for(var prev of prevEducation){
      //console.log(prev)
    var images = await Images.findAll({
      where: { imageable_type: 'PreviousEducation',
        imageable_id: prev.id, },
    });
    const transcript = images.find(image => image.url.includes('transcript'));
    prev.transcript=transcript.url;
    const cc = images.find(image => image.url.includes('cc'));
    prev.cc=cc.url;
  }
  console.log(prevEducation)


    return res.status(200).json({
      message: 'Full form details fetched successfully.',
      form: form,
      basicDetails:basicDetails,
      citizenship:citizenship,
      prevEducation:prevEducation,
    });
  } catch (error) {
    console.error('Error fetching full form details:', error);
    next(error);
  }
};


export const getFilteredForms = async (req, res, next) => {
  try {
    const filters = req.body;

    // Build form filters dynamically
    const formFilters = {};
    const filterFields = [
      'women',
      'madheshi',
      'dalit',
      'adibashi_janjati',
      'backward_region',
      'disabled',
      'district_quota',
      'district',
      'staff_quota',
      'voucher_no'
    ];
    filterFields.forEach(field => {
      if (filters[field] !== undefined) {
        formFilters[field] = filters[field];
      }
    });

    // Query the Form model with filters and include BasicDetails
    const forms = await Form.findAll({
      where: formFilters,
      include: {
        model: BasicDetails,
        attributes: ['first_name', 'middle_name', 'last_name', 'phone'],
      },
    });

    if (forms.length === 0) {
      return res.status(404).json({ message: 'No forms found matching the criteria.' });
    }

    // Transform the response to the desired format
    const responseData = forms.map(form => {
      const basicDetails = form.BasicDetail;

      // Construct the full name
      const fullName = [
        basicDetails.first_name,
        basicDetails.middle_name || '',
        basicDetails.last_name
      ].filter(Boolean).join(' ');

      return {
        id: form.id,
        name: fullName,
        phone: basicDetails.phone,
        status: form.status,
        updated_at: form.updated_at,
      };
    });

    return res.status(200).json({
      message: 'Form details fetched successfully.',
      data: responseData,
    });
  } catch (error) {
    console.error('Error fetching forms:', error);
    next(error);
  }
};
