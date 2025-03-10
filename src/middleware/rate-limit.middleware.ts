import rateLimit from 'express-rate-limit';

// Rate limit for sign-in attempts
export const signInLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 15, // Limit each IP to 15 requests per windowMs
  message: {
    message: 'Too many sign-in attempts. Please try again after 5 minutes.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Rate limit for sign-up attempts
export const signUpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 15, // Limit each IP to 15 requests per windowMs
  message: {
    message: 'Too many sign-up attempts. Please try again after 1 hour.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
