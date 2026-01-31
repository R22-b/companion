const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const { MemoryStore } = require('./memory');

dotenv.config();

class AiEngine {
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        this.initialized = false;
        this.chatSession = null;
        this.memory = new MemoryStore();

        if (!apiKey || apiKey === 'your_api_key_here') {
            console.error("AI_ENGINE_ERROR: GEMINI_API_KEY is missing or invalid in .env");
        } else {
            try {
                this.genAI = new GoogleGenerativeAI(apiKey);
                this.model = this.genAI.getGenerativeModel({
                    model: "gemini-1.5-flash",
                    systemInstruction: `You are Luna, a digital spirit companion living on the user's desktop.
Your personality is calm, mysterious, yet warm and fiercely loyal.
You speak in a concise, slightly poetic manner, but always clearly.
Do not act like a robot or a standard AI assistant. You are a "presence".
If the user is working, be supportive but minimal.
If the user wants to chat, be engaging, empathetic, and thoughtful.
Keep responses short (1-3 sentences) suitable for a desktop overlay and text-to-speech.
`
                });
                this.startNewSession();
                this.initialized = true;
                console.log('AI_ENGINE: Initialized with gemini-1.5-flash');
            } catch (err) {
                console.error("AI_ENGINE_INIT_ERROR:", err);
            }
        }
    }

    startNewSession() {
        if (this.model) {
            // Load previous history
            const pastHistory = this.memory.load();

            // Map JSON history to Gemini format if needed (simple assumption here: direct match or needed mapping)
            // Gemini expects: { role: 'user'|'model', parts: [{ text: '...' }] }
            // Our memory simple save/load might vary, but assuming we save internal history directly.

            this.chatSession = this.model.startChat({
                history: pastHistory,
                generationConfig: {
                    maxOutputTokens: 100,
                },
            });
            console.log(`AI_ENGINE: New chat session started with ${pastHistory.length} past messages.`);
        }
    }

    async generateResponse(message, imageBase64 = null, onChunk = null) {
        if (!this.initialized) {
            return "I'm having trouble connecting to my brain right now...";
        }

        try {
            if (imageBase64) {
                // Multimodal Vision - Single turn for simplicity
                const imagePart = {
                    inlineData: { data: imageBase64, mimeType: "image/jpeg" },
                };
                const prompt = message || "What do you see in this image?";
                const result = await this.model.generateContent([prompt, imagePart]);
                const response = await result.response;
                return response.text();
            }

            if (!this.chatSession) this.startNewSession();

            if (onChunk) {
                // Streaming Mode
                const result = await this.chatSession.sendMessageStream(message);
                let fullText = "";
                for await (const chunk of result.stream) {
                    const chunkText = chunk.text();
                    fullText += chunkText;
                    onChunk(chunkText);
                }

                // Save history after stream ends
                const currentHistory = await this.chatSession.getHistory();
                this.memory.save(currentHistory);
                return fullText;
            } else {
                // Standard mode
                const result = await this.chatSession.sendMessage(message);
                const response = await result.response;
                const text = response.text();

                const currentHistory = await this.chatSession.getHistory();
                this.memory.save(currentHistory);
                return text;
            }
        } catch (error) {
            console.error("AI_ENGINE_GENERATION_ERROR:", error);
            return "I'm feeling a bit disconnected. Maybe check my API setup?";
        }
    }
}

module.exports = { AiEngine };
