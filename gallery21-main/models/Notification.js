import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, // Recipient of the notification
    message: {
        type: String,
        required: true
    }, // Notification content
    isRead: {
        type: Boolean,
        default: false
    }, // Mark as read/unread
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

export default Notification;