// routes/booking.js
import express from "express";
import Booking from "../models/Booking.js";
import Event from "../models/Event.js";

const router = express.Router();

router.post("/book", async (req, res) => {
    const { userId, eventId, seats } = req.body;

    const event = await Event.findById(eventId);

    if (event.availableSeats < seats) {
        return res.status(400).json({ message: "Not enough seats" });
    }

    const totalAmount = event.price * seats;

    const booking = await Booking.create({
        userId,
        eventId,
        seats,
        totalAmount,
        paymentStatus: "Success",
        transactionId: "TXN" + Date.now()
    });

    // Reduce seats
    event.availableSeats -= seats;
    await event.save();

    res.json({ message: "Payment Successful", booking });
});

export default router;