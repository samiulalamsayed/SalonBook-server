import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
    {
        customerId: {
            type: String,
            required: [true, "Customer ID is required"],
        },

        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: [true, "Service ID is required"],
        },

        appointmentDate: {
            type: Date,
            required: [true, "Appointment date is required"],
        },

        appointmentTime: {
            type: String,
            required: [true, "Appointment time is required"],
        },

        phoneNumber: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
            match: [
                /^01[3-9]\d{8}$/,
                "Please provide a valid Bangladeshi mobile number",
            ],
        },

        message: {
            type: String,
            trim: true,
            maxlength: [500, "Message cannot exceed 500 characters"],
            default: "",
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },

        status: {
            type: String,
            enum: [
                "pending",
                "confirmed",
                "completed",
                "cancelled",
            ],
            default: "pending",
        },

        paymentStatus: {
            type: String,
            enum: [
                "unpaid",
                "paid",
                "refunded",
            ],
            default: "unpaid",
        },

        stripeSessionId: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent model recompilation
const Appointment =
    mongoose.models.Appointment ||
    mongoose.model("Appointment", appointmentSchema);

export default Appointment;