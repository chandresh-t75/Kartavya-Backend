import mongoose from "mongoose";

const verificationCodeSchema = new mongoose.Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } // Expires after 5 minutes
});

const VerificationCode = mongoose.model('VerificationCode', verificationCodeSchema);

export default VerificationCode
