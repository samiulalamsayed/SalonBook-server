import { z } from "zod";

export const appointmentSchema = z.object({
    serviceId: z.string().regex(
        /^[0-9a-fA-F]{24}$/,
        "Invalid service ID"
    ),

    appointmentDate: z.string().regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "Invalid appointment date. Use YYYY-MM-DD format."
    ),

    appointmentTime: z.string().regex(
        /^([01]\d|2[0-3]):[0-5]\d$/,
        "Invalid appointment time. Use HH:mm format."
    ),
}).strict();