require('dotenv').config();
const express = require('express');
const cors = require('cors');
// ✅ Naya dukan: Google ka official SDK use kar rahe hain
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;

// Google AI Setup
const genAI = new GoogleGenerativeAI(API_KEY);
// Model setup - SDK khud handle karega version ka chakkar
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

app.get('/status', (req, res) => {
    res.json({ message: "Babu Rao ekdum raapchik hai re baba! ✅" });
});

app.post('/api/chat', async (req, res) => {
    try {
        const { question } = req.body;
        console.log("User ka sawal:", question);

        const prompt = `Tera naam Babu Bhaiya hai. Tujhse ye pucha hai: "${question}". Ekdum funny style mein Hindi mein jawab de. Max 1 line.`;

        // ✅ SDK Method: Isme koi fetch ya URL nahi chahiye
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log("Babu Bhaiya ka Jawab:", text);
        res.json({ answer: text });

    } catch (error) {
        console.error("--- ASLI LOCHA TERMINAL MEIN DEKH ---", error);
        // User ko abhi bhi funny error hi dikhayenge
        res.status(500).json({ answer: "Arey deva! BSNL ka dabba kharab hai lagta hai! 15 sec me wapas bolna, abhi line busy hai! 📞" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Babu Rao LIVE! SDK wala engine fit kar diya hai! 🔥`);
});