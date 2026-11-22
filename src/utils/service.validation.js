import { z } from "zod";

export const serviceSchema = z.object({
    name: z.string().trim().min(2, "Service name must be at least 2 characters"),

    category: z.enum([
        "Haircut & Styling",
        "Hair Coloring",
        "Hair Treatment",
        "Facial & Skincare",
        "Makeup",
        "Manicure & Pedicure",
        "Spa & Massage",
    ]),

    description: z.string().min(10, "Description must be at least 10 characters"),

    price: z.coerce.number().min(0, "Price cannot be negative"),

    duration: z.coerce.number().int().min(1, "Duration must be at least 1 minute"),

    image: z.string().url("Please provide a valid image URL"),

    status: z.enum(["active", "inactive"]).default("active"),
}).strict();

export const serviceStatusSchema = z.object({
    status: z.enum(["active", "inactive"]),
}).strict();