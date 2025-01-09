import jwt from 'jsonwebtoken';

export const generateTokens = (user,r) => {
  // Payload includes user ID and role
  const payload = { id: user.id, email:user.email, role: r};

  // Generate Access Token (short-lived)
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '23h' });

  // Generate Refresh Token (long-lived)
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
};
