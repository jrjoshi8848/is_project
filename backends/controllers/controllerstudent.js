import { Student, BasicDetails, Citizenship, PreviousEducation, Form, Images } from '../models/index.js';

// Controller to get Basic Details
export const getBasicDetails = async (req, res, next) => {
    try {
      const studentId = req.user.id;
  
      const basicDetails = await BasicDetails.findOne({
        where: { user_id: studentId }
      });
  
      if (!basicDetails) {
        return res.status(404).json({ message: 'Basic details not found for this student.' });
      }
      const existingImages = await Images.findOne({
        where: { imageable_type: 'BasicDetails', imageable_id: studentId },
      });

      // Extract image URLs from associated images
      const imageUrl = existingImages.url;
  
      return res.status(200).json({
        message: 'Basic details fetched successfully.',
        data: {
          id: basicDetails.id,
          student_id: basicDetails.user_id,
          role: basicDetails.role,
          first_name: basicDetails.first_name,
          middle_name: basicDetails.middle_name,
          last: basicDetails.last_name,
          phone: basicDetails.phone,
          DOB: basicDetails.DOB,
          temporary_address: basicDetails.temporary_address,
          permanent_address: basicDetails.permanent_address,
          sex:basicDetails.sex,
          grandfathers_name: basicDetails.grandfathers_name,
          mothers_name:basicDetails.mothers_name,
          fathers_profession:basicDetails.fathers_profession,
          image: imageUrl,
        },
      });
    } catch (error) {
      console.error('Error fetching basic details:', error);
      next(error);
    }
  };

// Controller to get Citizenship Details
export const getCitizenshipDetails = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    const citizenshipDetails = await Citizenship.findOne({
      where: { student_id: studentId }
    });

    if (!citizenshipDetails) {
      return res.status(404).json({ message: 'Citizenship details not found for this student.' });
    }

    return res.status(200).json({
      message: 'Citizenship details fetched successfully.',
      data: citizenshipDetails,
    });
  } catch (error) {
    console.error('Error fetching citizenship details:', error);
    next(error);
  }
};

// Controller to get Previous Education Details
export const getPreviousEducationDetails = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    const previousEducation = await PreviousEducation.findAll({
      where: { student_id: studentId },
      include: [Student], // Optionally include related student data
    });

    if (!previousEducation || previousEducation.length === 0) {
      return res.status(404).json({ message: 'Previous education details not found for this student.' });
    }

    return res.status(200).json({
      message: 'Previous education details fetched successfully.',
      data: previousEducation,
    });
  } catch (error) {
    console.error('Error fetching previous education details:', error);
    next(error);
  }
};

// Controller to get Full Form Details (Including Basic, Citizenship, Education)
export const getFullFormDetails = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    const form = await Form.findOne({
      where: { student_id: studentId },
      include: [
        {
          model: BasicDetails,
          where: { user_id: studentId },
        },
        {
          model: Citizenship,
          where: { student_id: studentId },
        },
        {
          model: PreviousEducation,
          where: { student_id: studentId },
        },
        {
          model: Images, // Optionally include images related to the form, e.g., proof images
          where: { imageable_type: 'Form' },
        }
      ],
    });

    if (!form) {
      return res.status(404).json({ message: 'Form details not found for this student.' });
    }

    return res.status(200).json({
      message: 'Full form details fetched successfully.',
      data: form,
    });
  } catch (error) {
    console.error('Error fetching full form details:', error);
    next(error);
  }
};
