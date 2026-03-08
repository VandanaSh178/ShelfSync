import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./database/db.js";
import {errorMiddleware} from "./middlewares/errorMiddleware.js";

export const app = express();

// Load environment variables
config({ path: "./config/config.env" });

// Connect database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(errorMiddleware);