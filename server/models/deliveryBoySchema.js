import mongoose from "mongoose";

const deliveryBoySchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true, unique: true },
  password: { type: String }, // Login password
  emailVerified: { type: Boolean, default: false },

  dob: { type: Date }, // 🎂 Date of Birth
  gender: {
    type: String,
    enum: ["male", "female"],
  },

  licenseNumber: { type: String },
licenseImage: {
  type: [String]
},
  district: { type: String },
  pincode: { type: String },
  photo: { type: String }, // Profile photo (Cloudinary URL)
  address: { type: String },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "blocked"],
    default: "pending",
  },

  isOnline: { type: Boolean, default: false },
  currentLocation: {
    lat: { type: Number },
    lng: { type: Number },
  },

  createdAt: { type: Date, default: Date.now },
});

const DeliveryRegistration = mongoose.model(
  "DeliveryBoyRegistration",
  deliveryBoySchema
);

export default DeliveryRegistration;
