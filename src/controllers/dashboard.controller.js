import { connectMongoDB } from "../config/db.js";
import Service from "../models/service.model.js";
import Appointment from "../models/appointment.model.js";

export const getAdminDashboardStats = async (req, res) => {
    try {
        const db = await connectMongoDB();

        const [
            totalCustomers,
            totalActiveServices,
            totalAppointments,
            pendingAppointments,
            confirmedAppointments,
            totalSuccessfulPayments,
        ] = await Promise.all([
            db.collection("user").countDocuments({
                role: "customer",
            }),

            Service.countDocuments({
                status: "active",
            }),

            Appointment.countDocuments(),

            Appointment.countDocuments({
                status: "pending",
            }),

            Appointment.countDocuments({
                status: "confirmed",
            }),

            db.collection("transactions").countDocuments({
                status: "paid",
            }),
        ]);

        res.status(200).json({
            success: true,
            message: "Admin dashboard statistics fetched successfully.",
            data: {
                totalCustomers,
                totalActiveServices,
                totalAppointments,
                pendingAppointments,
                confirmedAppointments,
                totalSuccessfulPayments,
            },
        });

    } catch (error) {
        console.error("Admin Dashboard Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics.",
        });
    }
};