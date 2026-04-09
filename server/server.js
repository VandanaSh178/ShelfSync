// server.js  ← your new entry point
import { config } from "dotenv";
config({ path: "./config/config.env" }); // ✅ Must be first

// Now safe to import everything else
import { app } from "./app.js";
import { v2 as cloudinary } from "cloudinary";
import { connectDB } from "./database/db.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));