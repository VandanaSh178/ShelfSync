import ErrorHandler from "../middlewares/errorMiddleware.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateForgotPasswordEmailTemplate } from "../utils/emailTemplates.js";
import crypto from "crypto";

// ─── Register ────────────────────────────────────────────────────────────────
export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please fill all fields", 400));
  }

  const isRegistered = await User.findOne({ email, accountVerified: true });
  if (isRegistered) {
    return next(new ErrorHandler("User already exists", 400));
  }

  const registerationAttemptsByUser = await User.find({
    email,
    accountVerified: false,
  });

  if (registerationAttemptsByUser.length >= 5) {
    return next(
      new ErrorHandler(
        "Too many registration attempts. Please try again later.",
        429
      )
    );
  }

  if (password.length < 6) {
    return next(
      new ErrorHandler("Password must be at least 6 characters long", 400)
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const verificationCode = await user.generateVerificationCode();
  await user.save();

  // Wrapped in try/catch so a failed email doesn't crash registration
  try {
    await sendVerificationCode(verificationCode, email, res);
  } catch (emailError) {
    console.error("Verification email failed (non-fatal):", emailError.message);
    return res.status(201).json({
      success: true,
      message:
        "Registration successful but email delivery failed. Please contact support.",
    });
  }
});

// ─── Verify OTP ──────────────────────────────────────────────────────────────
export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new ErrorHandler("Please provide email and OTP", 400));
  }

  const userAllEntries = await User.find({
    email,
    accountVerified: false,
  }).sort({ createdAt: -1 });

  if (userAllEntries.length === 0) {
    return next(
      new ErrorHandler(
        "No registration attempts found for this email",
        404
      )
    );
  }

  let user = userAllEntries[0];

  if (userAllEntries.length > 1) {
    await User.deleteMany({
      email,
      accountVerified: false,
      _id: { $ne: user._id },
    });
  }

  if (
    user.verificationCode !== Number(otp) ||
    user.verificationCodeExpire < Date.now()
  ) {
    return next(new ErrorHandler("Invalid or expired OTP", 400));
  }

  user.accountVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpire = undefined;

  await user.save({ validateModifiedOnly: true });

  sendToken(user, 200, "Account verified successfully", res);
});

// ─── Login ───────────────────────────────────────────────────────────────────
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password", 400));
  }

  const user = await User.findOne({
    email,
    accountVerified: true,
  }).select("+password");

  if (!user) {
    return next(
      new ErrorHandler("Invalid email or account not verified", 401)
    );
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid password", 401));
  }

  sendToken(user, 200, "Logged in successfully", res);
});

// ─── Logout ──────────────────────────────────────────────────────────────────
export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

// ─── Get User Details ─────────────────────────────────────────────────────────
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

// ─── Forgot Password ──────────────────────────────────────────────────────────
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

  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  const message = generateForgotPasswordEmailTemplate(resetPasswordUrl);

  try {
    await sendEmail(user.email, "SHELFSYNC Password Recovery", message);

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

// ─── Reset Password ───────────────────────────────────────────────────────────
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
    accountVerified: true,
  });

  if (!user) {
    return next(
      new ErrorHandler("Invalid or expired password reset token", 400)
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler(
        "Password and confirm password do not match",
        400
      )
    );
  }

  if (
    req.body.password.length < 6 ||
    req.body.password.length > 20 ||
    req.body.confirmPassword.length < 6 ||
    req.body.confirmPassword.length > 20
  ) {
    return next(
      new ErrorHandler(
        "Password must be at least 6 and at most 20 characters long",
        400
      )
    );
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, "Password reset successfully", res);
});

// ─── Update Password ──────────────────────────────────────────────────────────
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new ErrorHandler("Please fill all password fields", 400));
  }

  const isPasswordMatched = await bcrypt.compare(
    currentPassword,
    user.password
  );
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Current password is incorrect", 400));
  }

  if (newPassword.length < 6 || newPassword.length > 20) {
    return next(
      new ErrorHandler(
        "New password must be between 6 and 20 characters",
        400
      )
    );
  }

  if (newPassword !== confirmNewPassword) {
    return next(
      new ErrorHandler(
        "New password and confirm password do not match",
        400
      )
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  sendToken(user, 200, "Password updated successfully", res);
});