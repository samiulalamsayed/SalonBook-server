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
    verifyJWT,
    verifyAdmin,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Public Routes
router.get("/", getAllServices);
router.get("/featured", getFeaturedServices);
router.get("/:id", getServiceById);

// Admin Routes
router.post("/", verifyJWT, verifyAdmin, createService);

router.patch("/:id", verifyJWT, verifyAdmin, updateService);

router.delete("/:id", verifyJWT, verifyAdmin, deleteService);

router.patch(
    "/:id/status",
    verifyJWT,
    verifyAdmin,
    updateServiceStatus
);

export default router;