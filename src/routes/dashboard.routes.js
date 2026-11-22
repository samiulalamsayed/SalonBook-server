import express from "express";
import { getAdminDashboardStats } from "../controllers/dashboard.controller.js";
import {
    verifyAuth,
    verifyAdmin,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Admin Dashboard Statistics
router.get(
    "/admin",
    verifyAuth,
    verifyAdmin,
    getAdminDashboardStats
);

export default router;