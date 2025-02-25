import { Schema, model, models, mongoose } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const UserSchema = new Schema({
  firstName: { type: String},
  lastName: { type: String },
  username: {
    type: String,
    unique: [true, "Username already exists"],
    required: [true, "Username is required"],
    maxlength: 20,
  },
  email: {
    type: String,
    unique: [true, "Email already exists"],
    required: [true, "Email is required"],
    maxlength: 50,
  },
  roles: {
    type: [String],
    enum: ['Novice User', 'Art Enthusiast', 'Artist'],
    default: ['Novice User'],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  profileImagePath: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false, // Default to false until the user verifies via OTP
  },
  wishList: {
    type: Array,
    default: [],
  },
  cart: {
    type: Array,
    default: [],
  },
  orders: {
    type: Array,
    default: [],
  },
  artwork: {
    type: [Schema.Types.ObjectId],
    ref: "Artwork",
    default: [],
  },
  followers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    default: [],
  }],
  following: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    default: [], 
  }],
  joinedForums: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Forum' 
  }],
  createdThreads: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Thread' 
  }],
  createdComments: [{ 
    type: mongoose.Schema.Types.ObjectId, ref: 'Comment' 
  }],
  connectedAccountId: {
    type: String,
    default: null,
  },
  lastUsernameChanged: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Add an index for the followers field
UserSchema.index({ followers: 1 });

// Add an index for the following field
UserSchema.index({ following: 1 });

UserSchema.methods.generatePasswordResetToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  this.passwordResetToken = token; // Add this field to your user model
  this.passwordResetExpires = Date.now() + 3600000; // 1 hour
  return token;
};

// Middleware to hash password before saving the user
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Method to find a user by email and password
UserSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email });
  
  if (!user) {
    throw new Error('User not found');
  }
  if (!await bcrypt.compare(password, user.password)) {
    throw new Error('Incorrect password');
  }
  
  return user;
};

const User = models.User || model("User", UserSchema);

export default User;
