// models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    seats: Number,
    totalAmount: Number,
    paymentStatus: {
        type: String,
        enum: ["Pending", "Success"],
        default: "Pending"
    },
    transactionId: String,
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);