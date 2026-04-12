import { generateVerificationOtpEmailTemplate } from "./emailTemplates.js";
import { sendEmail } from "./sendEmail.js";

export async function sendVerificationCode(verificationCode, email, res) {
  // Generate OTP email template
  const message = generateVerificationOtpEmailTemplate(verificationCode);

  // Send email — let errors propagate to authController's try/catch
  await sendEmail(
    email,
    "Your OTP for ShelfSync Account Verification",
    message
  );

  return res.status(200).json({
    success: true,
    message: "Verification OTP sent to your email",
  });
}