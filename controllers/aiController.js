import Groq from "groq-sdk";

export const generateDescription = async (req, res) => {
    try {
        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({
                message: "Groq API key not found"
            });
        }

        const { title, location, date, category } = req.body;

        if (!title || !location || !date || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });

        const prompt = `
Write a professional and attractive event description.

Event Title: ${title}
Location: ${location}
Date: ${date}
Category: ${category}

Make it engaging and exciting. Keep it under 150 words.
`;

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are a professional event copywriter."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
        });

        const description = completion.choices[0].message.content;

        res.status(200).json({ description });

    } catch (error) {
        console.error("GROQ ERROR:", error);
        res.status(500).json({
            message: "AI generation failed"
        });
    }
};
export const recommendEvents = async (req, res) => {
    try {
        const { pastBookings, interests, budget, location } = req.body;

        if (!interests || !budget || !location) {
            return res.status(400).json({
                message: "Interests, budget and location are required"
            });
        }

        // 🔥 Get all events from DB
        const Event = (await import("../models/Event.js")).default;
        const allEvents = await Event.find();

        // Basic filtering first (budget + location)
        const filteredEvents = allEvents.filter(event =>
            event.price <= budget &&
            event.location.toLowerCase().includes(location.toLowerCase())
        );

        if (filteredEvents.length === 0) {
            return res.json({ recommendations: [] });
        }

        // 🔥 AI Ranking with GROQ
        const Groq = (await import("groq-sdk")).default;

        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });

        const prompt = `
User interests: ${interests.join(", ")}
Past bookings: ${JSON.stringify(pastBookings)}

Available events:
${filteredEvents.map(e => `
Title: ${e.title}
Category: ${e.category}
Price: ${e.price}
Location: ${e.location}
`).join("\n")}

Return ONLY the titles of the top 5 most relevant events in JSON array format.
`;

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are an event recommendation AI." },
                { role: "user", content: prompt }
            ],
            temperature: 0.5,
        });

        let aiResponse = completion.choices[0].message.content;

        let recommendedTitles;

        try {
            recommendedTitles = JSON.parse(aiResponse);
        } catch {
            // fallback if AI returns text
            recommendedTitles = filteredEvents.slice(0, 5).map(e => e.title);
        }

        const recommendations = filteredEvents.filter(event =>
            recommendedTitles.includes(event.title)
        );

        res.status(200).json({ recommendations });

    } catch (error) {
        console.error("RECOMMENDATION ERROR:", error);
        res.status(500).json({
            message: "Recommendation failed"
        });
    }
};
