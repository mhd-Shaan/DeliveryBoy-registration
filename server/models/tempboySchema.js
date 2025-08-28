// models/TempBoy.js
import mongoose from "mongoose";

const tempBoySchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true, unique: true },
  verified: { type: Boolean, default: false }, // after OTP verification
}, { timestamps: true });

export default mongoose.model("TempBoy", tempBoySchema);
