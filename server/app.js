import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import expressFileUpload from "express-fileupload";

import { connectDB } from "./database/db.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRouter.js";
import borrowRouter from "./routes/borrowRouter.js";
import userRouter from "./routes/userRouter.js";
import aiRoutes from "./routes/aiRoutes.js";
import notificationRouter from "./routes/notificationRouter.js"; // ✅ single import

import { notifyUsers } from "./services/notifyUsers.js";
import { removeUnverifiedAccounts } from "./services/removeUnverifiedAccounts.js";

export const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Request-Timestamp"],
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressFileUpload({ useTempFiles: true, tempFileDir: "./tmp/" }));

app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRouter);
app.use("/api/users", userRouter);
app.use("/api/ai", aiRoutes);
app.use("/api/notifications", notificationRouter); // ✅ actually mounted now

notifyUsers();
removeUnverifiedAccounts();

app.use(errorMiddleware);