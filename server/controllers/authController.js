// Custom error class for handling errors
import ErrorHandler from "../middlewares/errorMiddleware.js";

// User model (MongoDB schema)
import User from "../models/userModel.js";

// Library used to hash passwords
import bcrypt from "bcryptjs";

// Function to send OTP verification email
import { sendVerificationCode } from "../utils/sendVerificationCode.js";

// Middleware to catch async errors automatically
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";


// Register Controller
export const register = catchAsyncErrors(async (req, res, next) => {

  // Step 1: Extract user data from request body
  const { name, email, password } = req.body;

  // Step 2: Check if any field is missing
  if (!name || !email || !password) {
    return next(new ErrorHandler("Please fill all fields", 400));
  }

  // Step 3: Check if a verified user with this email already exists
  const isRegistered = await User.findOne({
    email,
    accountVerified: true,
  });

  // If verified user exists → stop registration
  if (isRegistered) {
    return next(new ErrorHandler("User already exists", 400));
  }

  // Step 4: Count unverified accounts with same email
  const registerationAttemptsByUser = await User.find({
    email,
    accountVerified: false,
  });

  // Step 5: Limit registration attempts (max 5)
  if (registerationAttemptsByUser.length >= 5) {
    return next(
      new ErrorHandler(
        "Too many registration attempts. Please try again later.",
        429
      )
    );
  }

  // Step 6: Validate password length
  if (password.length < 6) {
    return next(
      new ErrorHandler("Password must be at least 6 characters long", 400)
    );
  }

  // Step 7: Hash password before saving to database
  const hashedPassword = await bcrypt.hash(password, 10);

  // Step 8: Create new user in database
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // Step 9: Generate OTP verification code (method in user model)
  const verificationCode = await user.generateVerificationCode();

  // Step 10: Save OTP in database
  await user.save();

  // Step 11: Send OTP email to user
  await sendVerificationCode(verificationCode, email, res);
});