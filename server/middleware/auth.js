const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  } 
  // Set token from cookie
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    // If the user referenced by the token no longer exists, deny access
    if (!req.user) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

// Grant access to all authenticated users (all users have admin privileges)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // All authenticated users now have full privileges
    if (!req.user) {
      return next(
        new ErrorResponse(
          `User not authenticated`,
          403
        )
      );
    }
    next();
  };
};
