import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinaryConfig.js";

// One combined storage that routes based on fieldname
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (file.fieldname === "photo") {
      return {
        folder: "profilephoto",
        format: file.mimetype.split("/")[1],
        transformation: [{ width: 500, height: 500, crop: "limit" }],
      };
    } else if (file.fieldname === "licenseImage") {
      return {
        folder: "delivery-boy-docs",
        resource_type: "raw",
        format: file.mimetype.split("/")[1],
      };
    }
  },
});

// ✅ One multer instance
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});
