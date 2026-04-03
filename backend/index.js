const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

const API_KEY = process.env.GOOGLE_API_KEY;
const MODEL_ID = "gemini-3-flash-preview"; 
const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${API_KEY}`;

// --- 1. SUMMARIZE ROUTE (PDF & Image) ---
app.post('/summarize', upload.single('report'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "File select karein!" });

        let payload;
        const prompt = "Analyze this medical report and summarize it in simple bullet points. Highlight abnormal values.";

        if (req.file.mimetype.startsWith('image/')) {
            const base64Image = req.file.buffer.toString('base64');
            payload = {
                contents: [{
                    parts: [{ text: prompt }, { inline_data: { mime_type: req.file.mimetype, data: base64Image } }]
                }]
            };
        } else if (req.file.mimetype === 'application/pdf') {
            const data = await pdf(req.file.buffer);
            payload = {
                contents: [{ parts: [{ text: `${prompt}\n\n${data.text}` }] }]
            };
        }

        const response = await axios.post(BASE_URL, payload);
        res.json({ summary: response.data.candidates[0].content.parts[0].text });
    } catch (err) {
        res.status(500).json({ error: "Summarize fail: " + err.message });
    }
});

// --- 2. CHAT ROUTE (With Image Support) ---
app.post('/chat', upload.single('report'), async (req, res) => {
    try {
        const { message } = req.body;
        let payload;

        if (req.file && req.file.mimetype.startsWith('image/')) {
            const base64Image = req.file.buffer.toString('base64');
            payload = {
                contents: [{
                    parts: [
                        { text: message || "Analyze this" },
                        { inline_data: { mime_type: req.file.mimetype, data: base64Image } }
                    ]
                }]
            };
        } else {
            payload = { contents: [{ parts: [{ text: message }] }] };
        }

        const response = await axios.post(BASE_URL, payload);
        res.json({ text: response.data.candidates[0].content.parts[0].text });
    } catch (err) {
        res.status(500).json({ text: "AI Error: " + err.message });
    }
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));