
import mongoose from 'mongoose';

const ForumSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    }, // Forum title
    description: { 
        type: String 
    },
    category: { 
        type: String 
    }, // Optional: Categorize forums (e.g., "Painting", "Digital Art")
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, // Admin of the forum
    members: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }], // Users who joined the forum
    threads: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Thread' 
    }], // Threads in the forum
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

const Forum = mongoose.models.Forum || mongoose.model('Forum', ForumSchema);

export default Forum;