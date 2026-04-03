import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import { sendToken } from "../utils/sendToken.js";

/*
================================
GET ALL USERS (ADMIN)
================================
*/
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({ accountVerified: true }).select("-password");

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

/*
================================
REGISTER NEW ADMIN
================================
*/
export const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {
  // 1. Check if files exist
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Profile picture is required", 400));
  }

  const { avatar } = req.files;
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (!allowedTypes.includes(avatar.mimetype)) {
    return next(new ErrorHandler("Only JPEG, PNG and JPG images are allowed", 400));
  }

  // 2. Validate Text Fields
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please fill all fields (Name, Email, Password)", 400));
  }

  // 3. Check existing user (Check ALL users to prevent Duplicate Key 500 Error)
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new ErrorHandler("User with this email already exists", 400));
  }

  // 4. Password length validation
  if (password.length < 6) {
    return next(new ErrorHandler("Password must be at least 6 characters", 400));
  }

  // 5. Upload image to Cloudinary with Manual Error Logging
  console.log("--- Starting Cloudinary Upload ---");
  let cloudinaryResponse;
  
  try {
    cloudinaryResponse = await cloudinary.uploader.upload(
      avatar.tempFilePath,
      {
        folder: "SHELF_SYNC_ADMINS",
        resource_type: "auto",
      }
    );
    console.log("--- Cloudinary Upload Success ---");
  } catch (error) {
    console.error("🔥 CLOUDINARY CRASH:", error.message);
    return next(new ErrorHandler(`Cloudinary Error: ${error.message}`, 500));
  }

  // 6. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 7. Create admin user in Database
  try {
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      accountVerified: true,
      avatar: {
        url: cloudinaryResponse.secure_url,
        public_id: cloudinaryResponse.public_id,
      },
    });

    console.log("--- Admin Created Successfully ---");

    // 8. Send JWT Token and Response
    sendToken(admin, 201, "Admin registered successfully", res);
    
  } catch (dbError) {
    console.error("🔥 DATABASE CRASH:", dbError.message);
    return next(new ErrorHandler("Database Error: " + dbError.message, 500));
  }
});