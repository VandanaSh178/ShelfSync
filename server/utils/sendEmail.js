// import nodeMailer from "nodemailer";

// let transporter = null;

// const getTransporter = () => {
//   if (transporter) return transporter;

//   transporter = nodeMailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   family: 4,
//   auth: {
//     user: process.env.SMTP_EMAIL,
//     pass: process.env.SMTP_PASSWORD,
//   },
// });

//   return transporter;
// };

// export const verifyEmailConnection = () => {
//   getTransporter().verify((error) => {
//     if (error) {
//       console.error("❌ SMTP connection failed:", error.message);
//     } else {
//       console.log("✅ SMTP server ready");
//     }
//   });
// };

// export const sendEmail = async (emailOrOptions, subject, message) => {
//   let to, sub, html;

//   if (typeof emailOrOptions === "object" && emailOrOptions !== null) {
//     to   = emailOrOptions.email;
//     sub  = emailOrOptions.subject;
//     html = emailOrOptions.message;
//   } else {
//     to   = emailOrOptions;
//     sub  = subject;
//     html = message;
//   }

//   return await getTransporter().sendMail({
//   from: `"ShelfSync" <${process.env.SMTP_EMAIL}>`,
//   to,
//   subject: sub,
//   html,
// });
// }



// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export const verifyEmailConnection = async () => {
//   if (!process.env.RESEND_API_KEY) {
//     console.error("❌ RESEND_API_KEY is missing");
//     return;
//   }

//   console.log("✅ Resend email service configured");
// };

// export const sendEmail = async (emailOrOptions, subject, message) => {
//   let to, sub, html;

//   if (typeof emailOrOptions === "object" && emailOrOptions !== null) {
//     to = emailOrOptions.email;
//     sub = emailOrOptions.subject;
//     html = emailOrOptions.message;
//   } else {
//     to = emailOrOptions;
//     sub = subject;
//     html = message;
//   }

//   if (!process.env.RESEND_API_KEY) {
//     throw new Error("RESEND_API_KEY is missing");
//   }

//   const { data, error } = await resend.emails.send({
//     from: "ShelfSync <onboarding@resend.dev>",
//     to,
//     subject: sub,
//     html,
//   });

//   if (error) {
//     console.error("❌ Resend email error:", error);
//     throw new Error(error.message);
//   }

//   console.log("✅ Email sent through Resend:", data?.id);

//   return data;
// };


import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 465),
  secure: Number(process.env.SMTP_PORT || 465) === 465,
  family: 4,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log("✅ Gmail SMTP connection successful");
  } catch (error) {
    console.error("❌ Gmail SMTP connection failed:", error.message);
  }
};

export const sendEmail = async (emailOrOptions, subject, message) => {
  let to;
  let sub;
  let html;

  if (typeof emailOrOptions === "object" && emailOrOptions !== null) {
    to = emailOrOptions.email;
    sub = emailOrOptions.subject;
    html = emailOrOptions.message;
  } else {
    to = emailOrOptions;
    sub = subject;
    html = message;
  }

  const info = await transporter.sendMail({
    from: `"ShelfSync" <${process.env.SMTP_EMAIL}>`,
    to,
    subject: sub,
    html,
  });

  console.log("✅ Email sent:", info.messageId);

  return info;
};
