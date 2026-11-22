import "dotenv/config";
import Stripe from "stripe";
import mongoose from "mongoose";
import Appointment from "../models/appointment.model.js";
import Transaction from "../models/transaction.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handleStripeWebhook = async (req, res) => {
    const signature = req.headers["stripe-signature"];

    let event;

    // Verify Stripe Webhook Signature
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.error("Webhook Signature Error:", error.message);

        return res.status(400).json({
            success: false,
            message: "Invalid webhook signature.",
        });
    }

    try {
        const session = event.data.object;

        // Successful Payment
        if (
            event.type === "checkout.session.completed" ||
            event.type === "checkout.session.async_payment_succeeded"
        ) {
            if (session.payment_status !== "paid") {
                return res.status(200).json({
                    received: true,
                    message: "Payment is not completed yet.",
                });
            }

            const { appointmentId, customerId } = session.metadata || {};

            if (
                !mongoose.isValidObjectId(appointmentId) ||
                !customerId
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid payment metadata.",
                });
            }

            const appointment = await Appointment.findOne({
                _id: appointmentId,
                customerId,
                status: "confirmed",
            });

            if (!appointment) {
                return res.status(404).json({
                    success: false,
                    message: "Appointment not found.",
                });
            }

            // Verify amount and currency
            if (
                session.amount_total !== Math.round(appointment.totalAmount * 100) ||
                session.currency !== "bdt"
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Payment amount or currency mismatch.",
                });
            }

            // Save transaction (idempotent)
            await Transaction.findOneAndUpdate(
                { stripeSessionId: session.id },
                {
                    $set: {
                        appointmentId: appointment._id,
                        customerId,
                        amount: session.amount_total / 100,
                        currency: session.currency,
                        status: "paid",
                    },
                },
                {
                    upsert: true,
                    new: true,
                    runValidators: true,
                }
            );

            // Update appointment payment status
            await Appointment.updateOne(
                {
                    _id: appointment._id,
                    paymentStatus: "unpaid",
                },
                {
                    $set: {
                        paymentStatus: "paid",
                    },
                }
            );
        }

        // Failed asynchronous payment
        if (event.type === "checkout.session.async_payment_failed") {
            const { appointmentId, customerId } = session.metadata || {};

            if (
                mongoose.isValidObjectId(appointmentId) &&
                customerId
            ) {
                await Transaction.findOneAndUpdate(
                    { stripeSessionId: session.id },
                    {
                        $set: {
                            appointmentId,
                            customerId,
                            amount: (session.amount_total || 0) / 100,
                            currency: session.currency || "bdt",
                            status: "failed",
                        },
                    },
                    {
                        upsert: true,
                        new: true,
                        runValidators: true,
                    }
                );
            }
        }

        return res.status(200).json({
            received: true,
        });

    } catch (error) {
        console.error("Webhook Processing Error:", error);

        return res.status(500).json({
            success: false,
            message: "Webhook processing failed.",
        });
    }
};