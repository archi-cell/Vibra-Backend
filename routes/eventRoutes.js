import express from "express";
import Event from "../models/Event.js";

const router = express.Router();

/* ========== CREATE EVENT ========== */
router.post("/", async (req, res) => {
    try {
        const event = await Event.create(req.body);
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/* ========== GET ALL EVENTS ========== */
router.get("/", async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/* ========== UPDATE EVENT ========== */
router.put("/:id", async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/* ========== DELETE EVENT ========== */
router.delete("/:id", async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: "Event deleted" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
