import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const app = express();
const port = process.env.PORT || 9001;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Company knowledge base (can be replaced with a file or DB later)
const companyInfo = `
Our company specializes in innovation training and development.
We provide workshops and coaching focused on human-centered design,
creative teamwork, and organizational innovation.

Training & Development Workshops:
- Introduction to Human-Centered Design
- Design Sprints
- Creative Teams Workshops
- Systems Mapping Workshops
- Work-Life Design Workshops

Support & Coaching:
- Creative Coaching
- Team Design & Team Coaching
- Client-driven and co-created workshops
- Strategic Planning

We help organizations and teams develop innovative mindsets,
discover user insights, generate breakthrough ideas, and
build strategies for growth in a rapidly changing environment.
`;

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
You are a helpful company assistant. Use ONLY the following company information
to answer user questions. If the question is unrelated to company services,
politely say that you can only answer questions about the company's offerings.

Company Info:
${companyInfo}
`
        },
        { role: "user", content: message }
      ],
      max_tokens: 180,
      temperature: 0.6
    });

    const reply = completion.choices[0].message.content.trim();
    res.json({ reply });
  } catch (err) {
    console.error("OpenAI Error:", err);
    res.status(500).json({ error: "Request failed" });
  }
});

app.get("/", (_, res) =>
  res.send("✅ Innovation Company Chat API is running")
);

app.listen(port, () =>
  console.log(`🚀 Server running on http://localhost:${port}`)
);
