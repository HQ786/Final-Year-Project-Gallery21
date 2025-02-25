import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'commentType', // Dynamic reference (Post or Thread)
  },
  commentType: {
    type: String,
    required: true,
    enum: ['Post', 'Thread'], // Indicates the type of comment
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment', // Reference to the parent Comment model
    default: null, // null for top-level comments
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Comment model
const Comment = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);

export default Comment;
