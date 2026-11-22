import { auth } from "../config/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { jwtVerify, createRemoteJWKSet } from "jose";
import { ObjectId } from "mongodb";
import { connectMongoDB } from "../config/db.js";

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

// Verify customer role
export const verifyCustomer = (req, res, next) => {
    if (req.user?.role !== "customer") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Customers only.",
        });
    }

    next();
};

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.BETTER_AUTH_URL}/api/auth/jwks`)
);

export const verifyJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. JWT Token is required.",
      });
    }

    const token = authHeader.split(" ")[1];

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: process.env.BETTER_AUTH_URL,
      audience: process.env.BETTER_AUTH_URL,
    });

    if (!payload.sub || !ObjectId.isValid(payload.sub)) {
      return res.status(401).json({
        success: false,
        message: "Invalid JWT Token.",
      });
    }

    // Get the latest user information from MongoDB
    const db = await connectMongoDB();

    const user = await db.collection("user").findOne({
      _id: new ObjectId(payload.sub),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check whether the user is blocked
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked.",
      });
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked,
    };

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired JWT Token.",
    });
  }
};