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

// --- MAIN ROUTE: HANDLE PDF & IMAGE BOTH ---
app.post('/summarize', upload.single('report'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "File select karein!" });

        const apiKey = process.env.GOOGLE_API_KEY;
        const modelId = "gemini-3-flash-preview"; 
        const prompt = "Please analyze this medical report and give a clear summary in bullet points. Highlight any abnormal values or important health indicators.";

        let payload;

        // 🖼️ CONDITION 1: AGAR IMAGE HAI (PNG, JPG, etc.)
        if (req.file.mimetype.startsWith('image/')) {
            console.log("📸 Image detect hui hai. Gemini Vision use kar raha hoon...");
            const base64Image = req.file.buffer.toString('base64');
            
            payload = {
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: req.file.mimetype,
                                data: base64Image
                            }
                        }
                    ]
                }]
            };
        } 
        // 📄 CONDITION 2: AGAR PDF HAI
        else if (req.file.mimetype === 'application/pdf') {
            console.log("📄 PDF detect hui hai. Text extract kar raha hoon...");
            try {
                const data = await pdf(req.file.buffer);
                if (!data.text || data.text.trim().length < 5) {
                    throw new Error("PDF mein text nahi mila (shayad scanned PDF hai).");
                }
                
                payload = {
                    contents: [{
                        parts: [{ text: `${prompt}\n\nReport Text:\n${data.text}` }]
                    }]
                };
            } catch (pdfErr) {
                return res.status(400).json({ error: "PDF read karne mein error: " + pdfErr.message });
            }
        } 
        else {
            return res.status(400).json({ error: "Sirf PDF aur Images allowed hain!" });
        }

        // --- GOOGLE API CALL ---
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`,
            payload
        );

        const summary = response.data.candidates[0].content.parts[0].text;
        console.log("✨ Summary Successfully Generated!");
        res.json({ summary: summary });

    } catch (err) {
        console.error("❌ Error:", err.response?.data || err.message);
        res.status(500).json({ error: "Processing failed: " + (err.response?.data?.error?.message || err.message) });
    }
});

// Chat Route (As it is)
app.post('/chat', async (req, res) => {
    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GOOGLE_API_KEY}`,
            { contents: [{ parts: [{ text: req.body.message }] }] }
        );
        res.json({ text: response.data.candidates[0].content.parts[0].text });
    } catch (e) { res.status(500).send("Chat system down."); }
});

app.listen(5000, () => console.log("🚀 Multi-Format Server Ready on Port 5000"));