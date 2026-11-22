import express from "express";
import { getAdminDashboardStats } from "../controllers/dashboard.controller.js";

import {
    verifyJWT,
    verifyAdmin,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Admin Dashboard Statistics
router.get(
    "/admin",
    verifyJWT,
    verifyAdmin,
    getAdminDashboardStats
);

export default router;