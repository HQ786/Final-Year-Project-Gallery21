import mongoose, { Schema, model, models } from "mongoose";

const ArtworkSchema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    workPhotoPaths: [
      { 
        type: String, 
        required: [true, "At least one artwork photo is required"],
      }
    ],
    flags: [
      {
        userId: mongoose.Schema.Types.ObjectId, // User who flagged
        reason: String,                        //  reason
        flaggedAt: { type: Date, default: Date.now }, // Timestamp
      },
    ],
    tags: [
      { 
        type: String, 
      }
    ]
  },
  { timestamps: true }
);

const Artwork = models.Artwork || model("Artwork", ArtworkSchema);

export default Artwork;
