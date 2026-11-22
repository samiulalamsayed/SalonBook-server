import { auth } from "../config/auth.js";
import { fromNodeHeaders } from "better-auth/node";

// Verify authenticated user
export const verifyAuth = async (req, res, next) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        if (!session) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. Please login first.",
            });
        }

        if (session.user.isBlocked) {
            return res.status(403).json({
                success: false,
                message: "Your account has been blocked.",
            });
        }

        req.user = session.user;

        next();
    } catch (error) {
        console.error("Authentication Error:", error);

        return res.status(500).json({
            success: false,
            message: "Authentication failed.",
        });
    }
};

// Verify admin role
export const verifyAdmin = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin only.",
        });
    }

    next();
};