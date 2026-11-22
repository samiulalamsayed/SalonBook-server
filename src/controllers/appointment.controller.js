import Appointment from "../models/appointment.model.js";
import Service from "../models/service.model.js";
import { appointmentSchema } from "../utils/appointment.validation.js";
import mongoose from "mongoose";

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

        const { serviceId, appointmentDate, appointmentTime } =
            validation.data;

        // Check appointment date and time
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

        // Create appointment
        const appointment = await Appointment.create({
            customerId: req.user.id,
            serviceId: service._id,
            appointmentDate: new Date(`${appointmentDate}T00:00:00+06:00`),
            appointmentTime,
            totalAmount: service.price,
            status: "pending",
            paymentStatus: "unpaid",
        });

        res.status(201).json({
            success: true,
            message: "Appointment booked successfully.",
            data: appointment,
        });

    } catch (error) {
        console.error("Create Appointment Error:", error);

        res.status(500).json({
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
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Appointments fetched successfully.",
            total: appointments.length,
            data: appointments,
        });

    } catch (error) {
        console.error("Get Appointments Error:", error);

        res.status(500).json({
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

        res.status(200).json({
            success: true,
            message: "Appointment cancelled successfully.",
            data: appointment,
        });

    } catch (error) {
        console.error("Cancel Appointment Error:", error);

        res.status(500).json({
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
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "All appointments fetched successfully.",
            total: appointments.length,
            data: appointments,
        });

    } catch (error) {
        console.error("Get All Appointments Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch appointments.",
        });
    }
};