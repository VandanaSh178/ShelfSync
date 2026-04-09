import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import expressFileUpload from "express-fileupload";

import { connectDB } from "./database/db.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRouter.js";
import borrowRouter from "./routes/borrowRouter.js";
import userRouter from "./routes/userRouter.js"; // ✅ FIXED
import { notifyUsers } from "./services/notifyUsers.js";
import { removeUnverifiedAccounts } from "./services/removeUnverifiedAccounts.js";
import aiRoutes from "./routes/aiRoutes.js";

export const app = express();

// ✅ DB connect
// connectDB();

// ✅ CORS
// ✅ CORS - Robust Configuration
app.use(
  cors({
    // Fallback to localhost if env variable isn't loading
    origin: process.env.FRONTEND_URL || "http://localhost:5173", 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    // Include the custom timestamp header you added to your API.js
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-Timestamp"],
  })
);


// ✅ Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ File Upload FIX (Windows compatible)
app.use(
  expressFileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp/", // ✅ FIXED
  })
);

app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRouter);
app.use("/api/users", userRouter);

app.use("/api/ai", aiRoutes);


notifyUsers(); // ✅ CALL THE FUNCTION TO START NOTIFICATIONS
removeUnverifiedAccounts(); // ✅ CALL THE FUNCTION TO START ACCOUNT CLEANUP
// ✅ Error middleware (ALWAYS LAST)
app.use(errorMiddleware);