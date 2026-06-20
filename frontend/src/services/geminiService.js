// DAK Hyperskills — Gemini Service
// Uses Firebase AI Logic (Vertex AI backend) — uses Cloud billing.
// No separate OAuth tokens needed, just the Firebase app config.

import { app } from '../firebase';
import { getAI, getGenerativeModel, VertexAIBackend } from 'firebase/ai';

const MODEL_NAME = 'gemini-3.5-flash';

// Initialize Firebase AI Logic with Vertex AI backend (uses Cloud billing)
const ai = getAI(app, { backend: new VertexAIBackend() });

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
