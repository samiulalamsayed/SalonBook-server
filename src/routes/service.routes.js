import express from "express";

import {
    getAllServices,
    getFeaturedServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    updateServiceStatus,
} from "../controllers/service.controller.js";

import {
    verifyAuth,
    verifyAdmin,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Public Routes
router.get("/", getAllServices);
router.get("/featured", getFeaturedServices);
router.get("/:id", getServiceById);

// Admin Routes
router.post("/", verifyAuth, verifyAdmin, createService);

router.patch("/:id", verifyAuth, verifyAdmin, updateService);

router.delete("/:id", verifyAuth, verifyAdmin, deleteService);

router.patch(
    "/:id/status",
    verifyAuth,
    verifyAdmin,
    updateServiceStatus
);

export default router;
