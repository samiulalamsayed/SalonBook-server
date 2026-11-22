import express from "express";

import {
    createAppointment,
    getMyAppointments,
    cancelMyAppointment,
    getAllAppointments,
    updateAppointmentStatus,
} from "../controllers/appointment.controller.js";

import {
    verifyJWT,
    verifyCustomer,
    verifyAdmin,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Customer Appointment Booking
router.post(
    "/",
    verifyJWT,
    verifyCustomer,
    createAppointment
);

// Get Customer Appointments
router.get(
    "/my-appointments",
    verifyJWT,
    verifyCustomer,
    getMyAppointments
);

// Cancel Customer Appointment
router.patch(
    "/:id/cancel",
    verifyJWT,
    verifyCustomer,
    cancelMyAppointment
);

// Get All Appointments (Admin)
router.get(
    "/",
    verifyJWT,
    verifyAdmin,
    getAllAppointments
);

// Update Appointment Status (Admin)
router.patch(
    "/:id/status",
    verifyJWT,
    verifyAdmin,
    updateAppointmentStatus
);

export default router;