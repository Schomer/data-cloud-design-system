// DAK Hyperskills — Gemini Service
// Uses Firebase AI Logic (Gemini Developer API) as fallback,
// or direct Google AI Studio Gemini API if key is provided in .env.

import { app } from '../firebase';
import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai';

const MODEL_NAME = 'gemini-3.5-flash';

// Get the API key from Vite define variable
const apiKeyFromEnv = typeof __GEMINI_API_KEY__ !== 'undefined' ? __GEMINI_API_KEY__ : '';

// Initialize Firebase AI Logic with Gemini Developer API backend (fallback)
let ai;
try {
  ai = getAI(app, { backend: new GoogleAIBackend() });
} catch (e) {
  console.error('[Gemini] Failed to initialize Firebase AI Logic:', e);
}

// REST streaming fallback when API key is provided
async function* streamGeminiResponseRest(systemPrompt, userPrompt, apiKey) {
  console.log('[Gemini] streamGeminiResponse called via REST API, model:', MODEL_NAME);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:streamGenerateContent?alt=sse&key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }]
        }
      ],
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        maxOutputTokens: 65536,
        temperature: 0.7,
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${errorText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data:')) {
          const jsonStr = trimmed.slice(5).trim();
          if (jsonStr) {
            try {
              const chunk = JSON.parse(jsonStr);
              const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                yield text;
              }
            } catch (e) {
              console.error('Error parsing chunk:', e);
            }
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

// ============================================================
// Streaming response generator
// ============================================================

export async function* streamGeminiResponse(systemPrompt, userPrompt) {
  if (apiKeyFromEnv) {
    console.log('[Gemini] Using custom Gemini API Key from .env');
    yield* streamGeminiResponseRest(systemPrompt, userPrompt, apiKeyFromEnv);
    return;
  }

  console.log('[Gemini] streamGeminiResponse called via Firebase AI Logic, model:', MODEL_NAME);

  if (!ai) {
    throw new Error('Firebase AI Logic is not initialized.');
  }

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
  return true;
}

