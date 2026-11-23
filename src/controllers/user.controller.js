import { connectMongoDB } from "../config/db.js";
import { ObjectId } from "mongodb";

export const getAllCustomers = async (req, res) => {
    try {
        const db = await connectMongoDB();

        const customers = await db.collection("user")
            .find(
                { role: "customer" },
                {
                    projection: {
                        name: 1,
                        email: 1,
                        image: 1,
                        role: 1,
                        isBlocked: 1,
                        createdAt: 1,
                    },
                }
            )
            .sort({ createdAt: -1 })
            .toArray();

        res.status(200).json({
            success: true,
            message: "Customers fetched successfully.",
            total: customers.length,
            data: customers,
        });

    } catch (error) {
        console.error("Get All Customers Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch customers.",
        });
    }
};

export const getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid customer ID.",
            });
        }

        const db = await connectMongoDB();

        const customer = await db.collection("user").findOne(
            {
                _id: new ObjectId(id),
                role: "customer",
            },
            {
                projection: {
                    name: 1,
                    email: 1,
                    image: 1,
                    phoneNumber: 1,
                    role: 1,
                    isBlocked: 1,
                    createdAt: 1,
                },
            }
        );

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Customer details fetched successfully.",
            data: customer,
        });

    } catch (error) {
        console.error("Get Customer Details Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch customer details.",
        });
    }
};


export const blockCustomer = async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid customer ID.",
            });
        }

        const db = await connectMongoDB();

        const result = await db.collection("user").updateOne(
            {
                _id: new ObjectId(id),
                role: "customer",
            },
            {
                $set: { isBlocked: true },
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Customer not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Customer blocked successfully.",
        });

    } catch (error) {
        console.error("Block Customer Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to block customer.",
        });
    }
};

export const unblockCustomer = async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid customer ID.",
            });
        }

        const db = await connectMongoDB();

        const result = await db.collection("user").updateOne(
            {
                _id: new ObjectId(id),
                role: "customer",
            },
            {
                $set: { isBlocked: false },
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Customer not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Customer unblocked successfully.",
        });

    } catch (error) {
        console.error("Unblock Customer Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to unblock customer.",
        });
    }
};

export const updateMyProfile = async (req, res) => {
    try {
        const { name, image, phoneNumber } = req.body;

        if (!name || typeof name !== "string" || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Name is required.",
            });
        }

        if (
            image !== undefined &&
            image !== null &&
            typeof image !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid profile image.",
            });
        }

        if (
            phoneNumber !== undefined &&
            typeof phoneNumber !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid phone number.",
            });
        }

        if (!ObjectId.isValid(req.user.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID.",
            });
        }

        const db = await connectMongoDB();

        const updateData = {
            name: name.trim(),
        };

        if (image !== undefined) {
            updateData.image = image;
        }

        if (phoneNumber !== undefined) {
            updateData.phoneNumber = phoneNumber.trim();
        }

        const result = await db.collection("user").updateOne(
            {
                _id: new ObjectId(req.user.id),
            },
            {
                $set: updateData,
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const updatedUser = await db.collection("user").findOne(
            { _id: new ObjectId(req.user.id) },
            {
                projection: {
                    name: 1,
                    email: 1,
                    image: 1,
                    phoneNumber: 1,
                    role: 1,
                    isBlocked: 1,
                },
            }
        );

        res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            data: updatedUser,
        });

    } catch (error) {
        console.error("Update My Profile Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update profile.",
        });
    }
};