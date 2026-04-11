import jwt from "jsonwebtoken";
import ErrorHandler from "./errorMiddleware.js";
import User from "../models/userModel.js"; 

// ❌ Removed catchAsyncErrors wrapper here
export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return next(new ErrorHandler("Please login to access this resource", 401));
    }

    // jwt.verify throws an error if invalid, which our catch block will handle
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorHandler("User not found", 401));
    }

    req.user = user;
    next(); // Pass the baton to the next function (borrowBook)
  } catch (error) {
    // This ensures any JWT or DB error is passed to our errorMiddleware properly
    return next(new ErrorHandler("Invalid or expired token", 401));
  }
};

export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler(`Role (${req.user.role}) is not allowed`, 403));
    }
    next();
  };
};