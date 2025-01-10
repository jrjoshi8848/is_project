import express from 'express';
import { upload } from '../config/multer.js'; // Multer config for image uploads
import { registerStudent,checkUsername,verifyOtp,fillBasicDetails,createOrUpdateCitizenshipDetails,createOrUpdatePreviousEducation,createOrUpdateForm } from '../controllers/studentController.js'; // Registration controller
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';

const router = express.Router();

// POST route for registering the student with image upload
// No need to explicitly add csrfProtection if it's globally applied
router.post('/register', upload('profile',1), registerStudent);
router.get('/checkusername',upload() , checkUsername);
router.post('/verifyAccount',upload() , verifyOtp);

router.post('/basicdetails',authenticate,authorize('student'),
    upload([
      { name: 'pp', maxCount: 1 } // Handle single file upload for 'pp'
    ]),fillBasicDetails);
router.post('/citizenship',authenticate,authorize('student'),
    upload([
      { name: 'front', maxCount: 1 },
      { name: 'back', maxCount: 1 }
    ]),createOrUpdateCitizenshipDetails);
router.post('/prev-edu',authenticate,authorize('student'),
        upload([
          { name: 'transcript', maxCount: 1 },
          { name: 'cc', maxCount: 1 }
        ]), createOrUpdatePreviousEducation
      );  
router.post('/form',authenticate,authorize('student'),
      upload([
        { name: 'voucher', maxCount: 1 },
        { name: 'disabled_image', maxCount: 1 },
        { name: 'staffImage', maxCount: 1 }
      ]), createOrUpdateForm
    );  
  

export default router;