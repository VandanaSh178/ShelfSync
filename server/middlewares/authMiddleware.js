import catchAsyncErrors from "./catchAsyncErrors.js"; 
import jwt from "jsonwebtoken";
import ErrorHandler from "./errorMiddleware.js";
import User from "../models/userModel.js"; 

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // console.log("Decoded JWT:", decoded);
  req.user = await User.findById(decoded.id);
  next();
});


