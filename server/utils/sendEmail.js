// import nodeMailer from "nodemailer"; 
// // Nodemailer ek Node.js library hai jo backend se email send karne ke liye use hoti hai

// // Email send karne ka reusable function
// export const sendEmail = async (email, subject, message) => {

//   // Email transporter create kar rahe hain
//   // Ye SMTP server ke through email bhejne ka configuration hota hai
//   const transporter = nodeMailer.createTransport({
    
//     host: process.env.SMTP_HOST, 
//     // SMTP server ka host (example: smtp.gmail.com)

//     service: process.env.SMTP_SERVICE, 
//     // Email service provider (example: gmail)

//     port: Number(process.env.SMTP_PORT) || 587,
//     secure: false,
//     // SMTP port (usually 465 or 587)

//     auth: {
//       user: process.env.SMTP_EMAIL, 
//       // Sender email address

//       pass: process.env.SMTP_PASSWORD, 
//       // Email account ka password ya app password
//     },
//   });

//   // Email ka structure define kar rahe hain
//   const mailOptions = {

//     from: process.env.SMTP_EMAIL, 
//     // Kaun email bhej raha hai

//     to: email, 
//     // Kis email address par bhejna hai

//     subject: subject, 
//     // Email subject line

//     html: message, 
//     // Email ka content (HTML format me)
//   };

//   // Actual email send ho raha hai
//   await transporter.sendMail(mailOptions);
// };


import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (email, subject, message) => {
  const { error } = await resend.emails.send({
    from: "ShelfSync <onboarding@resend.dev>", // change to your domain once verified
    to: email,
    subject: subject,
    html: message,
  });

  if (error) {
    console.error("❌ Resend error:", error);
    throw new Error(error.message || "Email delivery failed");
  }
};