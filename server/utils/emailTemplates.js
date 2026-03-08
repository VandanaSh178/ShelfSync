export function generateVerificationOtpEmailTemplate(verificationCode) {
  return `
  <div style="background:#f4f6f8;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
    
    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;
    padding:40px;border:1px solid #e6e6e6;text-align:center">

      <h2 style="color:#333;margin-bottom:10px;">
        Email Verification
      </h2>

      <p style="color:#555;font-size:15px;">
        Thank you for signing up. Please use the verification code below to verify your email address.
      </p>

      <div style="margin:30px 0;">
        <span style="
          display:inline-block;
          font-size:32px;
          letter-spacing:6px;
          font-weight:bold;
          color:#2c3e50;
          background:#f1f3f5;
          padding:15px 25px;
          border-radius:6px;
          border:1px dashed #ccc;
        ">
          ${verificationCode}
        </span>
      </div>

      <p style="color:#555;font-size:14px;">
        This verification code will expire in 
        <strong>15 minutes</strong>.
      </p>

      <p style="color:#777;font-size:13px;margin-top:25px;">
        If you did not request this email, you can safely ignore it.
      </p>

      <hr style="margin:30px 0;border:none;border-top:1px solid #eee;">

      <p style="font-size:12px;color:#999;">
        This is an automated message. Please do not reply to this email.
      </p>

      <p style="font-size:12px;color:#aaa;">
        © ${new Date().getFullYear()} ShelfSync. All rights reserved.
      </p>

    </div>
  </div>
  `;
}