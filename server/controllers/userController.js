import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import { sendToken } from "../utils/sendToken.js";
import { Borrow } from "../models/borrowModel.js"; // ✅ only once

export const getUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({ accountVerified: true });

  const usersWithBorrowCount = await Promise.all(
    users.map(async (user) => {
      const borrowCount = await Borrow.countDocuments({
        user: user._id,
        returned: false,
      });
      return {
        ...user.toObject(),
        activeBorrows: borrowCount,
      };
    })
  );

  res.status(200).json({
    success: true,
    users: usersWithBorrowCount,
  });
});

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({ accountVerified: true }).select("-password");
  res.status(200).json({ success: true, count: users.length, users });
});

export const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Profile picture is required", 400));
  }

  const { avatar } = req.files;
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (!allowedTypes.includes(avatar.mimetype)) {
    return next(new ErrorHandler("Only JPEG, PNG and JPG images are allowed", 400));
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please fill all fields", 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("User with this email already exists", 400));
  }

  if (password.length < 6) {
    return next(new ErrorHandler("Password must be at least 6 characters", 400));
  }

  let cloudinaryResponse;
  try {
    cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath, {
      folder: "SHELF_SYNC_ADMINS",
      resource_type: "auto",
    });
  } catch (error) {
    return next(new ErrorHandler(`Cloudinary Error: ${error.message}`, 500));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

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

  sendToken(admin, 201, "Admin registered successfully", res);
});