import mongoose from "mongoose";

const ThreadSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    content: { 
        type: String, 
        required: true 
    }, // Initial post content
    creator: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, // Who started the thread
    forum: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Forum', 
        required: true 
    }, // Associated forum
    comments: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Comment' 
    }], // Comments on the thread
    tags: [String], // Optional: Tags for searchability
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

const Thread = mongoose.models.Thread || mongoose.model('Thread', ThreadSchema);

export default Thread;