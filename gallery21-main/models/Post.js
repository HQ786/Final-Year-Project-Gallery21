// models/Post.js

import mongoose from 'mongoose';

const ImageDescriptionSchema = new mongoose.Schema({
  src: {
    type: String,
    required: true, // URL to the image
  },
  description: {
    type: String,
    default: '', // Description for the image
  },
});

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    validate: {
      validator: function () {
        return this.postType !== 'art' || (this.title && this.title.length > 0);
      },
      message: 'Title is required for art posts.',
    },
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  images: {
    type: [ImageDescriptionSchema],
    validate: {
      validator: function () {
        return this.postType !== 'art' || (this.images && this.images.length > 0 && this.images.length <=6);
      },
      message: 'Images are required for art posts and can not exceed 6 images.',
    },
  },
  communityImages: {
    type: [String],
    default: [],
    validate: {
      validator: function (value) {
        return (
          this.postType !== 'community' || 
          (value.length <= 4) // Allow empty array or up to 4 images
        );
      },
      message: 'If community images are provided, they cannot exceed 4 images.',
    },
  },
  gifs: {
    type: [String],
    default: [],
    validate: {
      validator: function (value) {
        return (
          this.postType !== 'community' || 
          (value.length <= 3)
        );
      },
      message: 'If community GIFs are provided, they cannot exceed 3 GIFs.',
    },
  },
  likes: {
    type: Number,
    default: 0,
  },
  postType: {
    type: String,
    enum: ['art', 'community'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: { 
    type: Date, 
    default: null,
  },
  flags: [
    {
      userId: mongoose.Schema.Types.ObjectId, // User who flagged
      reason: String,                        //  reason
      flaggedAt: { type: Date, default: Date.now }, // Timestamp
    },
  ],
  isPinned: {
    type:Boolean,
    default: false,
  }
});

// Create the Post model
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

export default Post;
