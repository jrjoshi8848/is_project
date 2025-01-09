import { Student, BasicDetails, Citizenship, PreviousEducation, Form, Images } from '../models/index.js';

// Controller to get Basic Details
export const getBasicDetails = async (req, res, next) => {
    try {
      const studentId = req.user.id;
  
      const basicDetails = await BasicDetails.findOne({
        where: { user_id: studentId },
        include: [
          {
            model: Images,
            where: { imageable_type: 'BasicDetails' },
            required: false, // No error if no images
          }
        ],
      });
  
      if (!basicDetails) {
        return res.status(404).json({ message: 'Basic details not found for this student.' });
      }
  
      // Extract image URLs from associated images
      const imageUrls = basicDetails.Images.map(image => image.url);
  
      return res.status(200).json({
        message: 'Basic details fetched successfully.',
        data: {
          basicDetails: basicDetails,
          images: imageUrls,
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
      where: { student_id: studentId },
      include: [Student], // Optionally include related student data
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
