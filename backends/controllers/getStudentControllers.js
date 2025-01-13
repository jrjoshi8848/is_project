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

    const citizenship = await Citizenship.findOne({
      where: { student_id: studentId }
    });

    if (!citizenship) {
      return res.status(404).json({ message: 'Citizenship details not found for this student.' });
    }
    var images = await Images.findAll({
      where: { imageable_type: 'Citizenship', imageable_id: citizenship.id },
    });
    const front = images.find(image => image.url.includes('citizenship_front'));
    const back = images.find(image => image.url.includes('citizenship_back'));
    //console.log(citizenship)
    return res.status(200).json({
      message: 'Citizenship details fetched successfully.',
      data: {
        id:citizenship.id,
        citizenship_number:citizenship.citizenship_number,
        type:citizenship.type,
        issued_date:citizenship.issued_date,
        issued_district:citizenship.issued_district,
        student_id:citizenship.student_id,
      front:front.url,
      back:back.url
    }
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
    

    return res.status(200).json({
      message: 'Previous education details fetched successfully.',
      data: prevEducation,
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

    let form = await Form.findOne({where: { student_id: studentId }});

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

