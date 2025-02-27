// models/Otp.js
import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const Otp = mongoose.models.Otp || mongoose.model('Otp', otpSchema);
export default Otp;
