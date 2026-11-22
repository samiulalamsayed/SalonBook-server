import express from "express";

import {
    createAppointment,
    getMyAppointments,
    cancelMyAppointment,
    getAllAppointments,
    updateAppointmentStatus,
} from "../controllers/appointment.controller.js";

import {
    verifyAuth,
    verifyCustomer,
    verifyAdmin,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Customer Appointment Booking
router.post(
    "/",
    verifyAuth,
    verifyCustomer,
    createAppointment
);

// Get Customer Appointments
router.get(
    "/my-appointments",
    verifyAuth,
    verifyCustomer,
    getMyAppointments
);

// Cancel Customer Appointment
router.patch(
    "/:id/cancel",
    verifyAuth,
    verifyCustomer,
    cancelMyAppointment
);

// Get All Appointments (Admin)
router.get(
    "/",
    verifyAuth,
    verifyAdmin,
    getAllAppointments
);

// Update Appointment Status (Admin)
router.patch(
    "/:id/status",
    verifyAuth,
    verifyAdmin,
    updateAppointmentStatus
);

export default router;