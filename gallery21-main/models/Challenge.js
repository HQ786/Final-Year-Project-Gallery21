// models/Otp.js
import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
});

const Challenge = mongoose.models.Challenge || mongoose.model('Challenge', challengeSchema);
export default Challenge;
