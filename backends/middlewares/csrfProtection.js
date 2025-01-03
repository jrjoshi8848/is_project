import csurf from 'csurf';

// CSRF Protection Middleware
export const csrfProtection = csurf({
  cookie: {     // Prevent client-side access (mitigates XSS)
    secure: process.env.NODE_ENV === 'production', // Ensure cookies are only sent over HTTPS in production
    sameSite: 'Lax',   // Restrict cross-site requests (mitigates CSRF)
  }
});