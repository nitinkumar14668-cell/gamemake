# Deploying to Vercel Guide

This project is fully configured and ready for 1-click deployment on [Vercel](https://vercel.com).

## 🚀 Quick Steps to Deploy

### Option 1: Via GitHub (Recommended - 2 Minutes)
1. Push this project repository to your GitHub account (`git push origin main`).
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New..."** ➜ **"Project"**.
4. Select your GitHub repository.
5. Vercel will automatically detect:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. *(Optional for AI Features)* Expand **Environment Variables**:
   - Key: `GEMINI_API_KEY`
   - Value: *(your Google Gemini API Key)*
   *(Note: Even without an API key, OpenCode smart engine will still generate Luau code reliably!)*
7. Click **"Deploy"**! 🎉

---

### Option 2: Via Vercel CLI (Terminal)
If you have Vercel CLI installed:
```bash
# 1. Install CLI if not already installed
npm install -g vercel

# 2. Deploy directly
vercel
```
Follow the prompts (accept defaults). For production, run:
```bash
vercel --prod
```

---

## ⚙️ Configuration Files Added
- `vercel.json`: Handles SPA fallback routing and redirects `/api/opencode/chat` to Vercel Serverless Function `/api/chat`.
- `api/chat.ts`: Serverless edge/node function powered by `@google/genai` (Gemini 3.8 Flash).
