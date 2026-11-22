
import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Service name is required"],
            trim: true,
        },

        category: {
            type: String,
            required: [true, "Category is required"],
            enum: [
                "Haircut & Styling",
                "Hair Coloring",
                "Hair Treatment",
                "Facial & Skincare",
                "Makeup",
                "Manicure & Pedicure",
                "Spa & Massage",
            ],
        },

        description: {
            type: String,
            required: [true, "Description is required"],
        },

        price: {
            type: Number,
            required: [true, "Price is required"],
            min: 0,
        },

        duration: {
            type: Number,
            required: [true, "Duration is required"],
            min: 1,
        },

        image: {
            type: String,
            required: [true, "Service image is required"],
        },

        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

const Service =
    mongoose.models.Service ||
    mongoose.model("Service", serviceSchema);

export default Service;
