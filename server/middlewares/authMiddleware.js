import catchAsyncErrors from "./catchAsyncErrors.js"; 
import jwt from "jsonwebtoken";
import ErrorHandler from "./errorMiddleware.js";
import User from "../models/userModel.js"; 

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {

  const token = req.cookies.token;

  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired token", 401));
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  req.user = user;

  next();
});


export const isAuthorized = (...roles) => {
  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`Role (${req.user.role}) is not allowed`, 403)
      );
    }

    next();
  };
};