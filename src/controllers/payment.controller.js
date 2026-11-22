import Stripe from "stripe";
import Appointment from "../models/appointment.model.js";
import "dotenv/config";

import { connectMongoDB } from "../config/db.js";
import { ObjectId } from "mongodb";
import Transaction from "../models/transaction.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        if (!appointmentId) {
            return res.status(400).json({
                success: false,
                message: "Appointment ID is required.",
            });
        }

        const appointment = await Appointment.findOne({
            _id: appointmentId,
            customerId: req.user.id,
        }).populate("serviceId", "name price");

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found.",
            });
        }

        if (appointment.status !== "confirmed") {
            return res.status(400).json({
                success: false,
                message: "Only confirmed appointments can be paid.",
            });
        }

        if (appointment.paymentStatus !== "unpaid") {
            return res.status(400).json({
                success: false,
                message: "This appointment has already been paid.",
            });
        }

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            customer_email: req.user.email,

            line_items: [
                {
                    price_data: {
                        currency: "bdt",
                        product_data: {
                            name: appointment.serviceId.name,
                        },
                        unit_amount: Math.round(
                            appointment.totalAmount * 100
                        ),
                    },
                    quantity: 1,
                },
            ],

            metadata: {
                appointmentId: appointment._id.toString(),
                customerId: req.user.id,
            },

            payment_intent_data: {
                metadata: {
                    appointmentId: appointment._id.toString(),
                    customerId: req.user.id,
                },
            },

            success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,

            cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
        });

        appointment.stripeSessionId = session.id;
        await appointment.save();

        res.status(200).json({
            success: true,
            message: "Checkout session created successfully.",
            data: {
                checkoutUrl: session.url,
                sessionId: session.id,
            },
        });

    } catch (error) {
        console.error("Create Checkout Session Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create checkout session.",
        });
    }
};


export const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate({
                path: "appointmentId",
                select: "appointmentDate appointmentTime serviceId",
                populate: {
                    path: "serviceId",
                    select: "name category price duration image",
                },
            })
            .sort({ createdAt: -1 })
            .lean();

        const db = await connectMongoDB();

        const customerIds = [
            ...new Set(transactions.map((item) => item.customerId)),
        ];

        const customers = await db.collection("user")
            .find({
                _id: {
                    $in: customerIds.map((id) => new ObjectId(id)),
                },
            })
            .project({
                name: 1,
                email: 1,
            })
            .toArray();

        const customerMap = new Map(
            customers.map((customer) => [
                customer._id.toString(),
                {
                    name: customer.name,
                    email: customer.email,
                },
            ])
        );

        const result = transactions.map((transaction) => ({
            ...transaction,
            customer: customerMap.get(transaction.customerId) || null,
        }));

        res.status(200).json({
            success: true,
            message: "Transactions fetched successfully.",
            total: result.length,
            data: result,
        });

    } catch (error) {
        console.error("Get All Transactions Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch transactions.",
        });
    }
};