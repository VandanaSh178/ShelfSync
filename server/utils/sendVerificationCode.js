import { generateVerificationOtpEmailTemplate } from "./emailTemplates.js";
import { sendEmail } from "./sendEmail.js";

export async function sendVerificationCode(verificationCode, email, res) {
  try {

    // OTP email template generate
    const message = generateVerificationOtpEmailTemplate(verificationCode);

    // Email send
    await sendEmail(
      email,
      "Your OTP for ShelfSync Account Verification",
      message
    );

    // ✅ IMPORTANT: Postman ko response bhejna
    return res.status(200).json({
      success: true,
      message: "Verification OTP sent to your email"
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Failed to send verification code"
    });

  }
}