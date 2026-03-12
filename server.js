import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config(); // Load env variables FIRST

const app = express();
app.use(cors());
app.use(express.json());

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


/* ---------------- OPENAI CHAT ---------------- */

app.post("/openai-chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
You are an AI assistant for Google.

Services:
- Website Development
- Ecommerce Development
- ERP Software
- Mobile App Development

Location: Mountain View, California
Website: https://www.google.com
`
        },
        { role: "user", content: userMessage }
      ]
    });

    res.json({
      reply: completion.choices[0].message.content
    });

  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ error: "OpenAI request failed" });
  }
});


/* ---------------- GEMINI CHAT ---------------- */

app.post("/gemini-chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const prompt = `
You are the AI assistant for Google.

Company: Google
Location: Mountain View, California

Services:
• Website Development
• Ecommerce Development
• ERP Software Development
• Mobile App Development
• Business Software Solutions

Website: https://www.google.com

Your job:
- Answer customer questions
- Promote Laksha Solutions services
- Encourage users to contact the company

Customer question:
${userMessage}
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({
      reply: response
    });

  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Gemini request failed" });
  }
});


/* ---------------- SERVER ---------------- */

app.listen(5000, () => {
  console.log("Chatbot server running on port 5000");
});