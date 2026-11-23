import express from "express";
import {
    getAllCustomers,
    getCustomerById,
    blockCustomer,
    unblockCustomer,
    updateMyProfile,
} from "../controllers/user.controller.js";

import {
    verifyJWT,
    verifyAdmin
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Update Own Profile (Admin & Customer)
router.patch("/profile/me", verifyJWT, updateMyProfile);

// Get All Registered Customers (Admin)
router.get("/", verifyJWT, verifyAdmin, getAllCustomers);

// Get Customer Details
router.get("/:id", verifyJWT, verifyAdmin, getCustomerById);

// Block Customer
router.patch(
    "/:id/block",
    verifyJWT,
    verifyAdmin,
    blockCustomer
);

// Unblock Customer
router.patch(
    "/:id/unblock",
    verifyJWT,
    verifyAdmin,
    unblockCustomer
);

export default router;