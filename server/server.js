// server.js
import { config } from "dotenv";
config({ path: "./config/config.env" }); // ✅ dotenv runs first

import { app } from "./app.js";
import { v2 as cloudinary } from "cloudinary";
import { connectDB } from "./database/db.js";
import { verifyEmailConnection } from "./utils/sendEmail.js"; // ← add this

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

connectDB();
verifyEmailConnection(); // ← add this

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));