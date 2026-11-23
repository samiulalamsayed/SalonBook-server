import express from "express";

import {
    createCheckoutSession,
    getAllTransactions,
    verifyPaymentSession,
} from "../controllers/payment.controller.js";

import { handleStripeWebhook } from "../controllers/webhook.controller.js";

import {
    verifyJWT,
    verifyCustomer,
    verifyAdmin,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Stripe Webhook (Public - Stripe Signature Verification)
router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    handleStripeWebhook
);

// Create Checkout Session
router.post(
    "/create-checkout-session",
    express.json(),
    verifyJWT,
    verifyCustomer,
    createCheckoutSession
);

router.get(
    "/verify-session",
    verifyJWT,
    verifyCustomer,
    verifyPaymentSession
);

// Get All Transactions (Admin)
router.get(
    "/transactions",
    verifyJWT,
    verifyAdmin,
    getAllTransactions
);

export default router;