import express from "express";

import {
    createAppointment,
    getMyAppointments,
    cancelMyAppointment,
    getAllAppointments,
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

export default router;