
import mongoose, { Schema } from 'mongoose';

const bidSchema = new mongoose.Schema({
    auction: {
        type: Schema.Types.ObjectId,
        ref: 'Auction',
        required: true
    },
    bidder: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bidAmount: {
        type: Number,
        required: true,
        min: 1  // Minimum bid amount (set to a reasonable value)
    },
    bidTime: {
        type: Date,
        default: Date.now
    },
    isValid: {
        type: Boolean,
        default: true  // Used to flag suspicious bids if needed
    }
}, { timestamps: true });

// Add bid restriction validation before saving
bidSchema.pre('save', async function(next) {
    const auction = await mongoose.model('Auction').findById(this.auction);

    if (!auction) {
        return next(new Error("Auction not found"));
    }

    // Implement bid increment restrictions and anti-sniping here
    const previousBid = await mongoose.model('Bid').findOne({ auction: this.auction })
        .sort({ bidAmount: -1 });

    if (previousBid && this.bidAmount <= previousBid.bidAmount) {
        return next(new Error("Bid amount must be higher than the previous bid"));
    }

    if (this.bidAmount > auction.maxBid) {
        auction.maxBid = this.bidAmount;
        await auction.save();
    }

    // Example anti-sniping feature: Extend auction end time if bid is close to end
    const timeLeft = auction.endTime - Date.now();
    if (timeLeft < 300000) { // 5 minutes
        auction.endTime = new Date(auction.endTime.getTime() + 300000); // Extend by 5 minutes
        await auction.save();
    }

    next();
});

const Bid = mongoose.models.Bid || mongoose.model('Bid', bidSchema);

export default Bid;