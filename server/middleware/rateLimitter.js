import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // 15 min me 100 request
  message: {
    message: "Too many requests, Please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10, // 15 min me 10 requests
  message: {
    message: "Too many login attempts, please",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: {
    message: "AI generation limit reached, please try again after 1 hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
