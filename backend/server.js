require('dotenv').config(); // 👈 Ye line environment variables ko load karti hai
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 🚨 Ab API key direct nahi likhi, .env file se aayegi!
const API_KEY = process.env.API_KEY; 

// ROUTE 1: Frontend ke liye connection check
app.get('/status', (req, res) => {
    res.json({ message: "Babu Rao ka server ekdum raapchik chal raha hai! ✅" });
});

// ROUTE 2: Asli Babu Bhaiya Chatbot API
app.post('/api/chat', async (req, res) => {
    try {
        const { question } = req.body;
        console.log("User ka sawal:", question);

        const prompt = `Tera naam Babu Bhaiya hai (Hera Pheri movie wala). Tujhse ye pucha hai: "${question}". Ekdum funny style mein Hindi mein jawab de. Max 1 lines mein khatam kar`;

        // Using gemini-1.5-flash as it's the fastest and recommended model now
        // 🚀 1.5 hata ke 2.5 laga diya!
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        // Agar Google ne error diya
        if (!response.ok) {
            console.error("GOOGLE API DIRECT ERROR:", JSON.stringify(data, null, 2));
            return res.status(500).json({ answer: `Google Error: ${data.error?.message || "Unknown"}` });
        }

        // Asli Jawab nikalna
        const text = data.candidates[0].content.parts[0].text;
        console.log("Babu Bhaiya ka Jawab:", text);
        
        res.json({ answer: text });

    } catch (error) {
        console.error("--- ASLI LOCHA YAHAN HAI ---", error);
        res.status(500).json({ answer: "Arey baba, code mein locha ho gaya re!" });
    }
});

const PORT = 10000;
app.listen(PORT, () => {
    console.log(`Babu Rao LIVE on port ${PORT}... SDK ko laat maar di! 🔥`);
});