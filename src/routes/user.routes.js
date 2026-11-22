import express from "express";
import {
    getAllCustomers,
    getCustomerById,
    blockCustomer,
    unblockCustomer,
} from "../controllers/user.controller.js";
import { verifyAuth, verifyAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get All Registered Customers (Admin)
router.get("/", verifyAuth, verifyAdmin, getAllCustomers);

// Get Customer Details
router.get("/:id", verifyAuth, verifyAdmin, getCustomerById);

// Block Customer
router.patch(
    "/:id/block",
    verifyAuth,
    verifyAdmin,
    blockCustomer
);

// Unblock Customer
router.patch(
    "/:id/unblock",
    verifyAuth,
    verifyAdmin,
    unblockCustomer
);

export default router;