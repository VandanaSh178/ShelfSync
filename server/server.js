
import { config } from "dotenv";

config({ path: "./config/config.env" });

// Import modules after loading environment variables
const { app } = await import("./app.js");
const { v2: cloudinary } = await import("cloudinary");
const { connectDB } = await import("./database/db.js");
const { verifyEmailConnection } = await import("./utils/sendEmail.js");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

// Connect to MongoDB
connectDB();

// Verify Gmail SMTP
verifyEmailConnection();

// Start server
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
