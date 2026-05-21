<img width="961" height="838" alt="AI content Generator" src="https://github.com/user-attachments/assets/e0e30e3a-8fa0-4c5c-8cc4-2a6a8c45e36c" />

 
 AI Content Generator by ZApier 



## Features

- **6 content types** — Blog Post, Social Media, Product Description, Email, Ad Copy, Landing Page
- **6 tone presets** — Professional, Casual, Witty, Persuasive, Inspirational, Formal
- **3 length targets** — Short (150–250w), Medium (400–600w), Long (900–1200w)
- **Live streaming** — Token-by-token output via SSE with a blinking cursor
- **Stop / Regenerate / Copy** action controls
- **Rendered Markdown** output with a Raw toggle
- **Secure backend proxy** — API key never exposed to the browser

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, CSS custom properties   |
| Rendering | `react-markdown` + `remark-gfm`   |
| Icons     | `lucide-react`                    |
| Backend   | Node.js + Express (SSE proxy)     |
| AI        | Anthropic Claude API (streaming)  |

---

## Project Structure

```
ai-content-generator/
├── public/
│   └── index.html              # Root HTML (Google Fonts loaded here)
├── src/
│   ├── components/
│   │   ├── ContentTypeSelector.js / .css
│   │   ├── ToneSelector.js     / .css
│   │   ├── LengthSelector.js   / .css
│   │   ├── TopicInput.js       / .css
│   │   ├── GenerateButton.js   / .css
│   │   └── OutputPanel.js      / .css
│   ├── hooks/
│   │   └── useContentGenerator.js   # Streaming fetch + abort logic
│   ├── utils/
│   │   └── constants.js             # Content types, tones, lengths
│   ├── App.js                        # Layout + state wiring
│   ├── App.css                       # Shell, grid, header, background
│   └── index.css                     # Reset + CSS variables
├── server.js                         # Express SSE proxy for Anthropic API
├── .env.example                      # Environment variable template
├── package.json
└── README.md
```

---

## Quick Start

### Prerequisites

- Node.js ≥ 18
- An [Anthropic API key](https://console.anthropic.com/)

### 1 — Clone & install

```bash
git clone https://github.com/your-username/ai-content-generator.git
cd ai-content-generator

# Install React dependencies
npm install

# Install server dependencies
npm install express cors @anthropic-ai/sdk
```

### 2 — Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### 3 — Run both servers

**Terminal 1 — API proxy (port 3001):**

```bash
node server.js
```

**Terminal 2 — React dev server (port 3000):**

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000).

> The React app proxies `/api/generate` to `localhost:3001` via the `"proxy"` field in `package.json`.

---

## How It Works

### Streaming Architecture

```
Browser                    Express (3001)            Anthropic API
  │                             │                         │
  │  POST /api/generate         │                         │
  │ ─────────────────────────► │                         │
  │                             │  messages.stream()      │
  │                             │ ───────────────────────►│
  │                             │                         │
  │  SSE: data: "Hello"\n\n     │  ◄── token chunks ──── │
  │ ◄─────────────────────────  │                         │
  │  SSE: data: " world"\n\n    │                         │
  │ ◄─────────────────────────  │                         │
  │  SSE: data: [DONE]\n\n      │                         │
  │ ◄─────────────────────────  │                         │
```

1. The React app sends a `POST` with `{ contentType, tone, length, topic, instructions }`.
2. `server.js` builds a system + user prompt and opens a streaming connection to Claude.
3. Each `content_block_delta` chunk is forwarded as an SSE event: `data: "<text>"\n\n`.
4. The React `useContentGenerator` hook reads the `ReadableStream`, parses SSE lines, and appends each token to state.
5. When the server writes `data: [DONE]\n\n`, streaming ends.

### Prompt Engineering

The system prompt instructs Claude to act as an expert copywriter and always output clean Markdown. The user prompt injects all five parameters:

```
Create a {contentType} about: "{topic}"

Tone: {tone}
Target length: {wordTarget} words
Additional instructions: {instructions}

Write the complete {contentType} now.
```

Word targets per length:

| Setting | Target      |
|---------|-------------|
| Short   | 150–250 w   |
| Medium  | 400–600 w   |
| Long    | 900–1200 w  |

### Abort / Stop

The `useContentGenerator` hook holds an `AbortController` ref. Calling `stop()` aborts the `fetch`, which also closes the SSE stream. Re-generating replaces the controller and starts a fresh request.

---

## Component Reference

### `useContentGenerator` hook

```js
const { output, isStreaming, error, generate, stop, clear } = useContentGenerator();
```

| Return        | Type       | Description                          |
|---------------|------------|--------------------------------------|
| `output`      | `string`   | Accumulated streamed text            |
| `isStreaming` | `boolean`  | True while tokens are arriving       |
| `error`       | `string?`  | Error message, or null               |
| `generate`    | `fn(params)` | Start generation; aborts any in-flight request |
| `stop`        | `fn()`     | Abort current stream                 |
| `clear`       | `fn()`     | Reset output + error                 |

### `OutputPanel` props

| Prop           | Type      | Description                        |
|----------------|-----------|------------------------------------|
| `output`       | `string`  | Markdown text to render            |
| `isStreaming`  | `boolean` | Shows "Writing…" badge + cursor    |
| `error`        | `string?` | Shown in error banner              |
| `onStop`       | `fn`      | Stop button handler                |
| `onRegenerate` | `fn`      | Regenerate button handler          |

---

## Production Build

```bash
npm run build
```

Serve `build/` with any static host. For the API proxy, deploy `server.js` to a Node.js host (Railway, Render, Fly.io, etc.) and update the `REACT_APP_API_URL` environment variable if you change the proxy URL.

---

## Customisation

### Adding a new content type

In `src/utils/constants.js`:

```js
export const CONTENT_TYPES = [
  // ...existing types
  { id: "Press Release", icon: "📰", desc: "Announce news" },
];
```

### Adding a new tone

```js
export const TONES = [
  // ...existing tones
  { id: "Empathetic", color: "#4db6ac" },
];
```

### Changing the model

In `server.js`, update:

```js
model: "claude-sonnet-4-20250514",
```

to any available Claude model string.

---

## Environment Variables

| Variable           | Required | Description                     |
|--------------------|----------|---------------------------------|
| `ANTHROPIC_API_KEY`| ✅       | Your Anthropic API key          |
| `PORT`             | ❌       | Express port (default: `3001`)  |

---

## License

MIT © 2025 — built with the [Anthropic Claude API](https://anthropic.com).
