import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import cloudinary from "cloudinary";
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

  // ✅ 1. Check image
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Profile picture is required", 400));
  }

  const { avatar } = req.files;
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (!allowedTypes.includes(avatar.mimetype)) {
    return next(new ErrorHandler("Only JPEG, PNG and JPG images are allowed", 400));
  }
  

  // ✅ 2. Validate fields
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Name, email and password are required", 400));
  }

  // ✅ 3. Check existing user
  const existingUser = await User.findOne({ email, accountVerified: true });

  if (existingUser) {
    return next(new ErrorHandler("Email already in use", 400));
  }

  // ✅ 4. Password validation
  if (password.length < 6 || password.length > 20) {
    return next(
      new ErrorHandler("Password must be between 6 and 20 characters", 400)
    );
  }

  // ✅ 5. Upload image to Cloudinary
  const cloudinaryResponse = await cloudinary.v2.uploader.upload(
    avatar.tempFilePath,
    {
      folder: "SHELF_SYNC_ADMINS",
    }
  );

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    return next(new ErrorHandler("Image upload failed", 500));
  }

  // ✅ 6. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // ✅ 7. Create admin user
  const admin = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "admin", // 🔥 important
    accountVerified: true,
    avatar: {
      url: cloudinaryResponse.secure_url,
      public_id: cloudinaryResponse.public_id,
    },
  });

  // ✅ 8. Send token
  sendToken(admin, 201, "Admin registered successfully", res);
});