import express from 'express';
import { csrfProtection } from '../middlewares/csrfProtection.js';  // CSRF middleware
import { loginStudent, adminLogin, refreshAccessToken } from '../controllers/authController.js';  // Import controller methods
import { authenticate } from '../middlewares/authenticate.js';  // JWT authentication
import { authorize } from '../middlewares/authorize.js';  // Role-based authorization

const router = express.Router();

router.post('/refresh', refreshAccessToken);

// Route for student login
router.post('/students/login', loginStudent);

// Route for admin login (includes OTP verification)
router.post('/login/admin', adminLogin);

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

