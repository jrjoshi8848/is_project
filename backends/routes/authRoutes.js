import express from 'express';
import { csrfProtection } from '../middlewares/csrfProtection.js';  // CSRF middleware
import { loginStudent,  refreshAccessToken,reqOtp,resetPass,reqOtpWithId,resetPassWithId,fetchProfile,logout } from '../controllers/authController.js';  // Import controller methods
import { authenticate } from '../middlewares/authenticate.js';  // JWT authentication
import { checkUsername } from '../controllers/studentController.js';
import { upload } from '../config/multer.js';
import { loginAdmin,verifyAdminOTP } from '../controllers/adminController.js';
//import { authorize } from '../middlewares/authorize.js';  // Role-based authorization

const router = express.Router();

router.post('/refresh', refreshAccessToken);
router.post('/reqotp', reqOtp);
router.post('/reqotpwithid',authenticate, reqOtpWithId);
router.post('/resetpass', resetPass);
router.post('/resetpasswithid',authenticate, resetPassWithId);
router.post('/logout', logout);


router.get('/checkusername',upload() , checkUsername);

// Route for student login
router.post('/students/login', loginStudent);



// Route for admin login (includes OTP verification)
router.post('/admin/login', loginAdmin);
router.post('/admin/otp', verifyAdminOTP);

router.get('/get-profile',authenticate, fetchProfile);

// Route for CSRF token setup (to set up CSRF cookie)
router.get('/csrf-token', csrfProtection, (req, res) => {
  res.status(200).json({ message: 'CSRF token set successfully' });
});

// Example protected route for admin - requires JWT authentication and admin authorization
/*router.get('/admin/dashboard', authenticate, authorize('admin'), (req, res) => {
  res.status(200).json({ message: 'Welcome to the admin dashboard!' });
});*/

// Global error handling middleware (should be used at the end of the route declarations)
//router.use(errorHandler);

export default router;

