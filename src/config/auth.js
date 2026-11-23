import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { connectMongoDB, mongoClient } from "./db.js";

const db = await connectMongoDB();

export const auth = betterAuth({
    database: mongodbAdapter(db, { client: mongoClient }),

    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: [
        "http://localhost:3000",
        "https://salon-book-client-zeta.vercel.app",
    ],
    secret: process.env.BETTER_AUTH_SECRET,

    // Session Configuration
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24,     // 1 day
    },

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },

    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "customer",
                input: false,
            },

            isBlocked: {
                type: "boolean",
                required: false,
                defaultValue: false,
                input: false,
            },

            phoneNumber: {
                type: "string",
                required: false,
            },
        },
    },

    plugins: [
        jwt({
            jwt: {
                definePayload: ({ user }) => ({
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    isBlocked: user.isBlocked,
                }),
            },
        }),
    ],
});