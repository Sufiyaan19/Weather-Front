const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors({
    origin: true, // Allow all origins including 'null'
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Handle preflight requests for /api/chat
app.options('/api/chat', cors());

// Proxy endpoint for Hugging Face API
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        const response = await fetch('https://api-inference.huggingface.co/models/microsoft/phi-2', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: message,
                parameters: {
                    max_length: 50,
                    min_length: 10,
                    temperature: 0.7,
                    do_sample: true
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        let aiResponse = data.generated_text || data[0]?.generated_text || "I'm sorry, I couldn't generate a response. Please try again.";

        // Clean up response
        aiResponse = aiResponse.replace(new RegExp(message, 'gi'), '').trim();

        res.json({ response: aiResponse });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({
            response: "I'm having trouble connecting to the AI service right now. Please check your internet connection and try again."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
