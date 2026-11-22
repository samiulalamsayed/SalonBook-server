import express from "express";

import {
    createAppointment,
    getMyAppointments,
    cancelMyAppointment,
} from "../controllers/appointment.controller.js";

import {
    verifyAuth,
    verifyCustomer,
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

export default router;