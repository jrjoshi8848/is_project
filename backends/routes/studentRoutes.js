import express from 'express';
import { upload } from '../config/multer.js'; // Multer config for image uploads
import { registerStudent,checkUsername,verifyOtp } from '../controllers/studentController.js'; // Registration controller

const router = express.Router();

// POST route for registering the student with image upload
// No need to explicitly add csrfProtection if it's globally applied
router.post('/register', upload('profile',1), registerStudent);
router.get('/checkusername',upload() , checkUsername);
router.post('/verifyAccount',upload() , verifyOtp);

export default router;
