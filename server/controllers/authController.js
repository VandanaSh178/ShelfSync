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
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateForgotPasswordEmailTemplate } from "../utils/emailTemplates.js";
import crypto from "crypto";

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

export const verifyOTP = catchAsyncErrors(async (req, res, next) => {

  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new ErrorHandler("Please provide email and OTP", 400));
  }

  // Find all unverified entries
  const userAllEntries = await User.find({
    email,
    accountVerified: false,
  }).sort({ createdAt: -1 });

  if (userAllEntries.length === 0) {
    return next(
      new ErrorHandler("No registration attempts found for this email", 404)
    );
  }

  let user = userAllEntries[0];

  // Delete older unverified entries
  if (userAllEntries.length > 1) {
    await User.deleteMany({
      email,
      accountVerified: false,
      _id: { $ne: user._id }
    });
  }

  // Check OTP and expiry
  if (
    user.verificationCode !== Number(otp) ||
    user.verificationCodeExpire < Date.now()
  ) {
    return next(new ErrorHandler("Invalid or expired OTP", 400));
  }

  // Verify account
  user.accountVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpire = undefined;

  await user.save({validateModifiedOnly: true});

  sendToken(user, 200,"Account verified successfully", res);

});

export const login = catchAsyncErrors(async (req, res, next) => {

  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password", 400));
  }

  const user
    = await User.findOne({ email, accountVerified: true }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or account not verified", 401));
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid password", 401));
  }


  sendToken(user, 200, "Logged in successfully", res);
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
}
);

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  if (!req.body.email) {
    return next(new ErrorHandler("Please provide your email", 400));
  }

  const user = await User.findOne({
    email: req.body.email,
    accountVerified: true,
  });

  if (!user) {
    return next(new ErrorHandler("Invalid email", 400));
  }

  // Generate reset token
  const resetToken = user.generatePasswordResetToken();

  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  // Generate email message
  const message = generateForgotPasswordEmailTemplate(resetPasswordUrl);

  console.log("working till here");
  console.log(user.email);
  console.log(message);

  try {
    await sendEmail(
  user.email, 
  "SHELFSYNC Password Recovery", 
  message
);

    // ✅ SEND RESPONSE
    res.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
    });

  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const {token} = req.params;
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
    accountVerified: true,
  });

  if (!user) {
    return next(new ErrorHandler("Invalid or expired password reset token", 400));
  }

  if(req.body.password !== req.body.confirmPassword){
    return next(new ErrorHandler("Password and confirm password do not match", 400));
  }

  if (req.body.password.length < 6||req.body.password.length > 20||
    req.body.confirmPassword.length < 6||req.body.confirmPassword.length > 20
  ) {
    return next(
      new ErrorHandler("Password must be at least 6 characters long and at most 20 characters long", 400)
    );
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);


  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, "Password reset successfully", res);
}
);

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  // 1. Fetch user and explicitly include password field
  const user = await User.findById(req.user._id).select("+password");

  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  // 2. Basic validation
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new ErrorHandler("Please fill all password fields", 400));
  }

  // 3. Verify current password
  const isPasswordMatched = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Current password is incorrect", 400));
  }

  // 4. Validate new password length
  if (newPassword.length < 6 || newPassword.length > 20) {
    return next(new ErrorHandler("New password must be between 6 and 20 characters", 400));
  }

  // 5. Match new passwords
  if (newPassword !== confirmNewPassword) {
    return next(new ErrorHandler("New password and confirm password do not match", 400));
  }

  // 6. Hash and Save (Ensure you hash it here if not using a pre-save hook)

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  // 7. Send fresh token so the user stays logged in
  sendToken(user, 200, "Password updated successfully", res);
});