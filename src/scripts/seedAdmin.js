import "dotenv/config";
import { auth } from "../config/auth.js";
import { connectMongoDB } from "../config/db.js";

const seedAdmin = async () => {
    try {
        const db = await connectMongoDB();

        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        if (!email || !password) {
            throw new Error("ADMIN_EMAIL or ADMIN_PASSWORD is missing.");
        }

        const usersCollection = db.collection("user");

        // Check existing admin
        const existingUser = await usersCollection.findOne({ email });

        if (existingUser) {
            // Ensure existing user has admin role
            await usersCollection.updateOne(
                { email },
                {
                    $set: {
                        role: "admin",
                        isBlocked: false,
                    },
                }
            );

            console.log("Existing user is already promoted to Admin.");
        } else {
            // Create new admin account
            const result = await auth.api.signUpEmail({
                body: {
                    name: "SalonBook Admin",
                    email,
                    password,
                },
            });

            // Assign admin role
            await usersCollection.updateOne(
                { email },
                {
                    $set: {
                        role: "admin",
                        isBlocked: false,
                    },
                }
            );

            console.log("Admin account created successfully!");
        }

        process.exit(0);

    } catch (error) {
        console.error("Admin Seed Failed:", error.message);
        process.exit(1);
    }
};

seedAdmin();