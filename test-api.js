import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API key found in .env");
        process.exit(1);
    }
    console.log("Using API Key:", apiKey.substring(0, 5) + "..." + apiKey.substring(apiKey.length - 4));
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        console.log("Listing available models...");
        // Use the v1 API for listing models if possible, or just try to list
        const models = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Dummy to get genAI object if needed, but genAI has listModels

        // Actually, listing models might require a different approach depending on library version
        // Let's try to just use 'gemini-1.5-flash' again but maybe it's just 'gemini-1.5-flash' in some contexts?
        // Wait, the error suggests it's using v1beta.

        console.log("Attempting with gemini-flash-latest...");
        const modelFlash = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const resultFlash = await modelFlash.generateContent("Say 'API is working!'");
        console.log("Response:", resultFlash.response.text());

    } catch (error) {
        console.error("API Error:", error.message);
        // fallback to list models if supported
        try {
            // If genAI.listModels exists
            // const list = await genAI.listModels();
            // console.log("Models:", list);
        } catch (e) { }
        process.exit(1);
    }
}
test();
