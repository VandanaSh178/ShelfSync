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
import notificationRouter from "./routes/notificationRouter.js";

import { notifyUsers } from "./services/notifyUsers.js";
import { removeUnverifiedAccounts } from "./services/removeUnverifiedAccounts.js";

export const app = express();

// CORS - Multi-origin (supports Netlify, Vercel, and localhost)
const allowedOrigins = [
  "https://shelf-sync-1.vercel.app",
  "http://localhost:5173",
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-Timestamp"],
  })
);

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File Upload
app.use(
  expressFileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp/",
  })
);

// Request Logger
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRouter);
app.use("/api/users", userRouter);
app.use("/api/ai", aiRoutes);
app.use("/api/notifications", notificationRouter);

notifyUsers();
removeUnverifiedAccounts();

// Add BEFORE errorMiddleware
app.use((req, res) => {
  console.log("❌ Unmatched route:", req.method, req.url);
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

// Error middleware (ALWAYS LAST)
app.use(errorMiddleware);