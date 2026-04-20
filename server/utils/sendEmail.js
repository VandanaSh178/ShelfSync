import nodeMailer from "nodemailer";

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    family: 4,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  return transporter;
};

export const verifyEmailConnection = () => {
  getTransporter().verify((error) => {
    if (error) {
      console.error("❌ SMTP connection failed:", error.message);
    } else {
      console.log("✅ SMTP server ready");
    }
  });
};

export const sendEmail = async (emailOrOptions, subject, message) => {
  let to, sub, html;

  if (typeof emailOrOptions === "object" && emailOrOptions !== null) {
    to   = emailOrOptions.email;
    sub  = emailOrOptions.subject;
    html = emailOrOptions.message;
  } else {
    to   = emailOrOptions;
    sub  = subject;
    html = message;
  }

  await getTransporter().sendMail({
    from: `"ShelfSync" <${process.env.SMTP_EMAIL}>`,
    to,
    subject: sub,
    html,
  });
};