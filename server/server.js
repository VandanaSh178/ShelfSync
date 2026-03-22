import { app } from "./app.js";
import { config } from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { connectDB } from "./database/db.js"; // ✅ ADD THIS

// ✅ LOAD ENV FIRST
config({ path: "./config/config.env" });

// ✅ CONNECT DB AFTER ENV
connectDB(); // ✅ THIS WAS MISSING

// ✅ Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

console.log("ENV TEST:", process.env.MONGODB_URI);