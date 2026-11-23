import Appointment from "../models/appointment.model.js";
import Service from "../models/service.model.js";
import { appointmentSchema } from "../utils/appointment.validation.js";
import mongoose from "mongoose";
import { connectMongoDB } from "../config/db.js";
import { ObjectId } from "mongodb";

// Create Appointment
export const createAppointment = async (req, res) => {
    try {
        // Validate request body
        const validation = appointmentSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.issues,
            });
        }

        const {
            serviceId,
            appointmentDate,
            appointmentTime,
            phoneNumber,
            message,
        } = validation.data;

        // Convert appointment date and time to Bangladesh time
        const bookingDateTime = new Date(
            `${appointmentDate}T${appointmentTime}:00+06:00`
        );

        if (
            Number.isNaN(bookingDateTime.getTime()) ||
            bookingDateTime <= new Date()
        ) {
            return res.status(400).json({
                success: false,
                message: "Please select a future appointment date and time.",
            });
        }

        const appointmentDateValue = new Date(
            `${appointmentDate}T00:00:00+06:00`
        );

        // Find active service
        const service = await Service.findOne({
            _id: serviceId,
            status: "active",
        });

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found or currently unavailable.",
            });
        }

        // Prevent duplicate active appointments for the same date and time
        const existingAppointment = await Appointment.findOne({
            appointmentDate: appointmentDateValue,
            appointmentTime,
            status: { $in: ["pending", "confirmed"] },
        });

        if (existingAppointment) {
            return res.status(409).json({
                success: false,
                message: "This time slot is already booked. Please select another time.",
            });
        }

        // Create appointment
        const appointment = await Appointment.create({
            customerId: req.user.id,
            serviceId: service._id,
            appointmentDate: appointmentDateValue,
            appointmentTime,
            phoneNumber,
            message,
            totalAmount: service.price,
            status: "pending",
            paymentStatus: "unpaid",
        });

        return res.status(201).json({
            success: true,
            message: "Appointment booked successfully.",
            data: appointment,
        });

    } catch (error) {
        console.error("Create Appointment Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create appointment.",
        });
    }
};


// Get Customer Appointments
export const getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({
            customerId: req.user.id,
        })
            .populate("serviceId", "name category price duration image")
            .sort({ createdAt: -1 })
            .lean();

        // Get Customer Information
        const db = await connectMongoDB();

        const customer = await db.collection("user").findOne(
            {
                _id: new ObjectId(req.user.id),
            },
            {
                projection: {
                    name: 1,
                    email: 1,
                },
            }
        );

        // Attach Customer Information to Appointments
        const result = appointments.map((appointment) => ({
            ...appointment,
            customer: customer
                ? {
                    name: customer.name,
                    email: customer.email,
                }
                : null,
        }));

        return res.status(200).json({
            success: true,
            message: "Appointments fetched successfully.",
            total: result.length,
            data: result,
        });

    } catch (error) {
        console.error("Get Appointments Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch appointments.",
        });
    }
};

// Cancel Customer Appointment
export const cancelMyAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid appointment ID.",
            });
        }

        const appointment = await Appointment.findOne({
            _id: id,
            customerId: req.user.id,
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found.",
            });
        }

        if (appointment.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Only pending appointments can be cancelled.",
            });
        }

        appointment.status = "cancelled";
        await appointment.save();

        return res.status(200).json({
            success: true,
            message: "Appointment cancelled successfully.",
            data: appointment,
        });

    } catch (error) {
        console.error("Cancel Appointment Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to cancel appointment.",
        });
    }
};


// Get All Appointments for Admin
export const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate("serviceId", "name category price duration image")
            .sort({ createdAt: -1 })
            .lean();

        const db = await connectMongoDB();

        const customerIds = [
            ...new Set(appointments.map((item) => item.customerId)),
        ];

        const customers = await db.collection("user")
            .find(
                {
                    _id: {
                        $in: customerIds
                            .filter((id) => ObjectId.isValid(id))
                            .map((id) => new ObjectId(id)),
                    },
                },
                {
                    projection: {
                        name: 1,
                        email: 1,
                    },
                }
            )
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

        const result = appointments.map((appointment) => ({
            ...appointment,
            customer: customerMap.get(appointment.customerId) || null,
        }));

        return res.status(200).json({
            success: true,
            message: "All appointments fetched successfully.",
            total: result.length,
            data: result,
        });

    } catch (error) {
        console.error("Get All Appointments Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch appointments.",
        });
    }
};


// Update Appointment Status for Admin
export const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate Appointment ID
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid appointment ID.",
            });
        }

        // Only confirmed and cancelled status updates are allowed
        if (!["confirmed", "cancelled"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Admin can only confirm or cancel appointments.",
            });
        }

        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found.",
            });
        }

        // Only pending appointments can be confirmed
        if (status === "confirmed" && appointment.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Only pending appointments can be confirmed.",
            });
        }

        // Admin can cancel pending or confirmed appointments
        if (
            status === "cancelled" &&
            !["pending", "confirmed"].includes(appointment.status)
        ) {
            return res.status(400).json({
                success: false,
                message: "Only pending or confirmed appointments can be cancelled.",
            });
        }

        appointment.status = status;
        await appointment.save();

        return res.status(200).json({
            success: true,
            message: `Appointment ${status} successfully.`,
            data: appointment,
        });

    } catch (error) {
        console.error("Update Appointment Status Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update appointment status.",
        });
    }
};