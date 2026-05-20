/**
 * server.js — Express proxy for Anthropic streaming API
 *
 * Keeps your API key server-side (never exposed to the browser).
 * Run alongside the React dev server: node server.js
 */

const express = require("express");
const cors = require("cors");
const Anthropic = require("@anthropic-ai/sdk");

const app = express();
app.use(cors());
app.use(express.json());

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * POST /api/generate
 * Body: { contentType, tone, length, topic, instructions }
 * Streams SSE: data: <chunk>\n\n  |  data: [DONE]\n\n
 */
app.post("/api/generate", async (req, res) => {
  const { contentType, tone, length, topic, instructions } = req.body;

  if (!topic || !topic.trim()) {
    return res.status(400).json({ error: "Topic is required." });
  }

  const wordTargets = { Short: "150-250", Medium: "400-600", Long: "900-1200" };
  const systemPrompt = `You are an expert copywriter and content strategist.
Write compelling, high-quality content exactly as requested.
Always format your output in clean Markdown (use headings, bold, lists where appropriate).
Never add meta-commentary; output the content directly.`;

  const userPrompt = `Create a ${contentType} about: "${topic}"

Tone: ${tone}
Target length: ${wordTargets[length] || "400-600"} words
${instructions ? `Additional instructions: ${instructions}` : ""}

Write the complete ${contentType} now.`;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  try {
    const stream = await client.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    for await (const chunk of stream) {
      if (
        chunk.type === "content_block_delta" &&
        chunk.delta?.type === "text_delta"
      ) {
        const text = chunk.delta.text;
        res.write(`data: ${JSON.stringify(text)}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    console.error("Anthropic error:", err);
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API proxy running on http://localhost:${PORT}`);
});
