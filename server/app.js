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

export const app = express();

// ✅ DB connect
// connectDB();

// ✅ CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
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

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRouter);
app.use("/api/users", userRouter);


notifyUsers(); // ✅ CALL THE FUNCTION TO START NOTIFICATIONS
removeUnverifiedAccounts(); // ✅ CALL THE FUNCTION TO START ACCOUNT CLEANUP
// ✅ Error middleware (ALWAYS LAST)
app.use(errorMiddleware);