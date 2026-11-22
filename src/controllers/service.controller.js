import Service from "../models/service.model.js";
import mongoose from "mongoose";

// Get All Active Services
export const getAllServices = async (req, res) => {
    try {
        const { search, category, sort } = req.query;

        // Build query
        const query = {
            status: "active",
        };

        // Search by service name
        if (search) {
            query.name = {
                $regex: search,
                $options: "i",
            };
        }

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Sort by price
        let sortOption = { createdAt: -1 };

        if (sort === "price-asc") {
            sortOption = { price: 1 };
        } else if (sort === "price-desc") {
            sortOption = { price: -1 };
        }

        const services = await Service.find(query).sort(sortOption);

        res.status(200).json({
            success: true,
            message: "Services fetched successfully",
            total: services.length,
            data: services,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch services",
            error: error.message,
        });
    }
};

// Get Featured Services
export const getFeaturedServices = async (req, res) => {
    try {
        const services = await Service.find({ status: "active" })
            .sort({ createdAt: -1 })
            .limit(6);

        res.status(200).json({
            success: true,
            message: "Featured services fetched successfully",
            data: services,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch featured services",
            error: error.message,
        });
    }
};

// Get Single Service
export const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;

        const service = await Service.findOne({
            _id: id,
            status: "active",
        });

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Service fetched successfully",
            data: service,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch service",
            error: error.message,
        });
    }
};

// Create New Service
export const createService = async (req, res) => {
    try {
        const service = await Service.create(req.body);

        res.status(201).json({
            success: true,
            message: "Service created successfully",
            data: service,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Update Service
export const updateService = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid service ID",
            });
        }

        const service = await Service.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Service updated successfully",
            data: service,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete Service
export const deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid service ID",
            });
        }

        const service = await Service.findByIdAndDelete(id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Service deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update Service Status
export const updateServiceStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid service ID",
            });
        }

        if (!["active", "inactive"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid service status",
            });
        }

        const service = await Service.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Service status updated successfully",
            data: service,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};