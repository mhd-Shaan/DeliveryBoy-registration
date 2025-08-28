import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
userType: {
  type: String,
  default: "delhiveryboy",
},
  otpisverfied: {
    type: Boolean,
    default: false,
  },
  expiresAt: { type: Date, required: true },
});

const OtpVerification = mongoose.model("OTPVerification", otpSchema);

export default OtpVerification;