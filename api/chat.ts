import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  // Set CORS headers for Vercel serverless function
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt, systemInstruction } = req.body || {};
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

  if (!apiKey) {
    return res.status(200).json({
      success: false,
      isFallback: true,
      message: 'GEMINI_API_KEY is not configured in Vercel environment variables. Using OpenCode smart fallback.',
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const fullSystemInstruction =
      systemInstruction ||
      `You are OpenCode AI, the premier Roblox Studio Luau scripting and engineering assistant.
You specialize in writing professional, bug-free Roblox Luau scripts (TweenService, RunService, Workspace events, Touched, DataStoreService, UserInputService).
Format all code blocks using \`\`\`lua ... \`\`\`.
Include concise inline comments explaining how to use and where to place the script.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: fullSystemInstruction,
      },
    });

    return res.status(200).json({
      success: true,
      text: response.text || '',
    });
  } catch (error: any) {
    console.error('Vercel API error:', error);
    return res.status(200).json({
      success: false,
      isFallback: true,
      error: error?.message || 'Error communicating with AI service.',
    });
  }
}
