// DAK Hyperskills — Gemini Service
// Uses Firebase AI Logic (Gemini Developer API) — no OAuth tokens needed.
// Just uses the Firebase app's API key for auth.

import { app } from '../firebase';
import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai';

const MODEL_NAME = 'gemini-2.5-flash';

// Initialize Firebase AI Logic with Gemini Developer API backend
const ai = getAI(app, { backend: new GoogleAIBackend() });

// ============================================================
// Streaming response generator
// ============================================================

export async function* streamGeminiResponse(systemPrompt, userPrompt) {
  console.log('[Gemini] streamGeminiResponse called via Firebase AI Logic, model:', MODEL_NAME);

  const model = getGenerativeModel(ai, {
    model: MODEL_NAME,
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: {
      maxOutputTokens: 65536,
      temperature: 0.7,
    },
  });

  console.log('[Gemini] Sending to Firebase AI Logic...');

  const result = await model.generateContentStream(userPrompt);

  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) {
      yield text;
    }
  }
}

export function isGeminiAvailable() {
  // Firebase AI Logic doesn't need a separate token — always available
  return true;
}
