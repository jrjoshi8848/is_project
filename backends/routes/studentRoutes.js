import express from 'express';
import { upload } from '../config/multer.js'; // Multer config for image uploads
import { registerStudent,checkUsername,verifyOtp,fillBasicDetails } from '../controllers/studentController.js'; // Registration controller
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';

const router = express.Router();

// POST route for registering the student with image upload
// No need to explicitly add csrfProtection if it's globally applied
router.post('/register', upload('profile',1), registerStudent);
router.get('/checkusername',upload() , checkUsername);
router.post('/verifyAccount',upload() , verifyOtp);

router.post('/basicdetails',authenticate,authorize('student'),upload('pp',1) , fillBasicDetails);

export default router;