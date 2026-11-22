import express from "express";
import Stripe from "stripe";

import {
    createCheckoutSession,
    getAllTransactions,
} from "../controllers/payment.controller.js";
import { handleStripeWebhook } from "../controllers/webhook.controller.js";

import {
    verifyAuth,
    verifyCustomer,
    verifyAdmin,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Stripe Webhook
router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    handleStripeWebhook
);


// Create Checkout Session
router.post(
    "/create-checkout-session",
    express.json(),
    verifyAuth,
    verifyCustomer,
    createCheckoutSession
);

// Get All Transactions (Admin)
router.get(
    "/transactions",
    verifyAuth,
    verifyAdmin,
    getAllTransactions
);

export default router;