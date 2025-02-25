
import mongoose from 'mongoose';

const auctionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    artwork: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artwork',
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true,
        validate: {
            validator: function(endTime) {
                return endTime > this.startTime;
            },
            message: "End time must be after start time"
        }
    },
    duration: {
        type: Number,  // duration in hours
        default: 1
    },
    
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number], 
            required: true,
        },
        address: {
            type: String, 
            required: true,
        },
    },
    timeSlots: [{
        startTime: Date,
        endTime: Date
    }],
    bids: [{
        type: String,
    }],
    startingBid: {
        type: Number,
        required: true,
        min: 0
    },
    minimumIncrement: {
        type: Number,
        default: 1,
        min: 0
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Ongoing', 'Completed', 'Cancelled'],
        default: 'Scheduled'
    },
    interested: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    flags: [
        {
          userId: mongoose.Schema.Types.ObjectId, // User who flagged
          reason: String,                        //  reason
          flaggedAt: { type: Date, default: Date.now }, // Timestamp
        },
      ],
}, { timestamps: true });

// Geospatial index for location-based search
auctionSchema.index({ location: '2dsphere' });

const Auction = mongoose.models.Auction || mongoose.model('Auction', auctionSchema);

export default Auction;