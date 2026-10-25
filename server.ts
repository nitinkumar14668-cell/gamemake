import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// OpenCode AI endpoint for Luau script generation and command parsing
app.post('/api/opencode/chat', async (req, res) => {
  const { prompt, selectedObject, systemInstruction } = req.body;
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

  if (!apiKey) {
    return res.json({
      success: false,
      isFallback: true,
      message: 'GEMINI_API_KEY not configured. Falling back to local OpenCode knowledge base.',
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const fullSystemInstruction =
      systemInstruction ||
      `You are OpenCode AI, the premier Roblox Studio Luau scripting and engineering assistant.
You specialize in writing professional, bug-free Roblox Luau scripts (TweenService, RunService, Workspace events, Touched, DataStoreService, UserInputService, PathfindingService, SoundService).
When writing code, always format inside \`\`\`lua ... \`\`\` code blocks.
Include concise comments explaining which part to place the script inside (e.g. Script inside Part, LocalScript inside StarterPlayerScripts).
If the user executes a command (e.g. /spawn, /time, /speed), explain the effect clearly.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: fullSystemInstruction,
      },
    });

    res.json({
      success: true,
      text: response.text || '',
    });
  } catch (error: any) {
    console.warn('OpenCode Gemini API error:', error?.message);
    res.json({
      success: false,
      isFallback: true,
      error: error?.message || 'Error communicating with AI service.',
    });
  }
});

async function start() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Roblox Studio with OpenCode AI listening on http://0.0.0.0:${PORT}`);
  });
}

start();
