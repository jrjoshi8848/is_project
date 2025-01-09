import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  // Get token from cookies or Authorization header
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied, No Token Provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user information to the request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,  // Pass role for access control
    };

    next();  // Pass control to the next middleware
  } catch (error) {
    return res.status(401).json({ message: 'Invalid Token' });
  }
};