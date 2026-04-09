import express from "express";
import { getBookRecommendations } from "../controllers/aiController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/recommend", isAuthenticated, getBookRecommendations);
export default router;