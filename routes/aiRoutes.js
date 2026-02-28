import express from "express";
import { generateDescription } from "../controllers/aiController.js";
import { recommendEvents } from "../controllers/aiController.js";



const router = express.Router();

router.post("/generate-description", generateDescription);
router.post("/recommend-events", recommendEvents);

export default router;
