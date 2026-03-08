import express from "express";
// Express framework server banane ke liye

import { config } from "dotenv";
// .env file se environment variables load karne ke liye

import cookieParser from "cookie-parser";
// Client/browser se aane wali cookies read karne ke liye

import cors from "cors";
// Cross-Origin requests allow karne ke liye (frontend ↔ backend communication)

import { connectDB } from "./database/db.js";
// MongoDB connection function

import { errorMiddleware } from "./middlewares/errorMiddleware.js";
// Custom global error handler

import authRoutes from "./routes/authRoutes.js";
// Authentication routes (register, login, verify OTP etc.)

// Express application create kar rahe hain
export const app = express();


// Environment variables load kar rahe hain
config({ path: "./config/config.env" });


// MongoDB database connect kar rahe hain
connectDB();


// CORS middleware enable
// Sirf specified frontend ko backend access ki permission
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  })
);


// Cookie parser middleware
// Request ke cookies ko read karne ke liye
app.use(cookieParser());


// JSON body parse karne ke liye
// Frontend se JSON data aata hai to Express usse read kar sakta hai
app.use(express.json());


// URL encoded form data parse karne ke liye
// Example: form submissions
app.use(express.urlencoded({ extended: true }));


// Authentication routes mount
// Final endpoints example:
// POST /api/auth/register
// POST /api/auth/login
// POST /api/auth/verify-otp
app.use("/api/auth", authRoutes);


// Global error handling middleware
// Agar kahin bhi error aaye to ye middleware handle karega
app.use(errorMiddleware);