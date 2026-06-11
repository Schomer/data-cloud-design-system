// DAK Hyperskills — Gemini Service
// Calls Gemini via Vertex AI (aiplatform.googleapis.com) directly from the browser.
// Uses GCP OAuth access token (cloud-platform scope) for authentication.
// Follows the same pattern as hey-data-now.

import { getGcpAccessToken, requestGcpToken } from './gcpTokenService';

const PROJECT_ID = 'malloy-data';
const LOCATION = 'us-central1';
const PRIMARY_MODEL = 'gemini-2.5-flash';
const FALLBACK_MODEL = 'gemini-2.0-flash';
let activeModel = PRIMARY_MODEL;

// ============================================================
// Token management
// ============================================================

async function getAccessToken() {
  const cached = getGcpAccessToken();
  if (cached) {
    console.log('[Gemini] Using cached access token');
    return cached;
  }

  console.log('[Gemini] No cached token, requesting via GIS...');
  try {
    const tokenPromise = requestGcpToken();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Token request timed out after 10s')), 10_000)
    );
    return await Promise.race([tokenPromise, timeoutPromise]);
  } catch (err) {
    console.error('[Gemini] Token refresh failed:', err);
    throw new Error(`Session expired: ${err.message}. Please sign out and sign back in.`);
  }
}

// ============================================================
// Streaming response generator
// ============================================================

export async function* streamGeminiResponse(systemPrompt, userPrompt) {
  console.log('[Gemini] streamGeminiResponse called, model:', activeModel);
  const token = await getAccessToken();
  console.log('[Gemini] Got access token, building request...');

  const model = activeModel;
  const url = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${model}:streamGenerateContent?alt=sse`;

  console.log(`[Gemini] POST to ${model}`);

  const generationConfig = {
    maxOutputTokens: 65536,
    temperature: 0.7,
  };
  if (model === PRIMARY_MODEL) {
    generationConfig.thinkingConfig = { thinkingBudget: 10000 };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      generationConfig,
    }),
  });

  console.log(`[Gemini] Response status: ${response.status}`);

  if (!response.ok) {
    const errText = await response.text();
    console.error('[Gemini] API error:', response.status, errText);

    // If 401 (token expired), clear and retry ONCE
    if (response.status === 401) {
      const { clearGcpAccessToken } = await import('./gcpTokenService');
      clearGcpAccessToken();
      console.warn('[Gemini] Token expired — clearing and retrying...');
      
      try {
        const freshToken = await getAccessToken();
        if (freshToken) {
          console.log('[Gemini] Got fresh token, retrying request');
          yield* streamGeminiResponse(systemPrompt, userPrompt);
          return;
        }
      } catch (retryErr) {
        console.error('[Gemini] Token refresh failed:', retryErr);
        throw new Error('Your session has expired. Please sign out and sign back in to continue.');
      }
      throw new Error('Your session has expired. Please sign out and sign back in to continue.');
    }

    // If 404 on primary model, fall back
    if (response.status === 404 && activeModel === PRIMARY_MODEL) {
      console.warn(`[Gemini] ${PRIMARY_MODEL} not available, falling back to ${FALLBACK_MODEL}`);
      activeModel = FALLBACK_MODEL;
      yield* streamGeminiResponse(systemPrompt, userPrompt);
      return;
    }

    throw new Error(`Gemini API error: ${response.status} — ${errText.slice(0, 300)}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (!data || data === '[DONE]') continue;

      try {
        const parsed = JSON.parse(data);
        const parts = parsed?.candidates?.[0]?.content?.parts;
        if (parts) {
          for (const part of parts) {
            // Skip thinking/thought parts — only yield visible text
            if (part.thought) continue;
            if (part.text) yield part.text;
          }
        }
      } catch {
        // Skip malformed SSE lines
      }
    }
  }
}

export function isGeminiAvailable() {
  return !!getGcpAccessToken();
}
