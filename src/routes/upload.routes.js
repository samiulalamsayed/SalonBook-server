import express from "express";
import multer from "multer";

const router = express.Router();

// Multer Configuration
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPG, PNG and WEBP images are allowed."));
        }
    },
});

// Upload Image to ImgBB
router.post("/", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please select an image.",
            });
        }

        const formData = new FormData();

        formData.append(
            "image",
            req.file.buffer.toString("base64")
        );

        const response = await fetch(
            `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
            {
                method: "POST",
                body: formData,
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            return res.status(500).json({
                success: false,
                message: "Image upload failed.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Image uploaded successfully.",
            imageUrl: result.data.url,
        });

    } catch (error) {
        console.error("Image Upload Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong during image upload.",
        });
    }
});

export default router;
