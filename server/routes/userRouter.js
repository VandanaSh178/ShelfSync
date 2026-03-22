import express from "express";

import {
  getAllUsers,
  registerNewAdmin,
} from "../controllers/userController.js";

import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

/*
================================
ADMIN ROUTES
================================
*/

// 👥 Get all users
router.get(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  getAllUsers
);

// 👤 Create new admin
router.post(
  "/admin",
  isAuthenticated,
  isAuthorized("admin"),
  registerNewAdmin
);

export default router;