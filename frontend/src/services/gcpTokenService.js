// DAK Hyperskills — GCP Token Service
// Uses Google Identity Services (GIS) to obtain an OAuth access token
// with cloud-platform scope for Vertex AI (Gemini) calls.
// Follows the same pattern as hey-data-now.

let cachedToken = null;
let tokenExpiry = 0;

const CLIENT_ID = '347391727005-up3qo24398bpskrpfds79usrptbsv26m.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/cloud-platform';
const SESSION_TOKEN_KEY = 'hs-gcp-access-token';
const SESSION_TOKEN_EXPIRY_KEY = 'hs-gcp-access-token-expiry';

export function getGcpAccessToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  try {
    const sessionToken = sessionStorage.getItem(SESSION_TOKEN_KEY);
    const sessionExpiry = sessionStorage.getItem(SESSION_TOKEN_EXPIRY_KEY);
    if (sessionToken && sessionExpiry) {
      const expiry = parseInt(sessionExpiry, 10);
      if (Date.now() < expiry) {
        cachedToken = sessionToken;
        tokenExpiry = expiry;
        return cachedToken;
      }
    }
  } catch (e) {
    // Ignore storage issues
  }
  return null;
}

export function setGcpAccessToken(token, expiresInMs = 3600_000) {
  cachedToken = token;
  tokenExpiry = Date.now() + expiresInMs - 60_000; // Refresh 1 min early

  try {
    sessionStorage.setItem(SESSION_TOKEN_KEY, token);
    sessionStorage.setItem(SESSION_TOKEN_EXPIRY_KEY, tokenExpiry.toString());
  } catch (e) {
    // Ignore storage issues
  }
}

export function clearGcpAccessToken() {
  cachedToken = null;
  tokenExpiry = 0;
  try {
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_TOKEN_EXPIRY_KEY);
  } catch (e) {
    // Ignore storage issues
  }
}

/**
 * Request a GCP access token via Google Identity Services.
 * Shows a consent prompt if needed (first time), then grants silently.
 * Returns the access token string.
 */
export function requestGcpToken(emailHint) {
  return new Promise((resolve, reject) => {
    // Check cache first
    const cached = getGcpAccessToken();
    if (cached) {
      resolve(cached);
      return;
    }

    // Wait for GIS to load
    if (!window.google?.accounts?.oauth2) {
      reject(new Error('Google Identity Services not loaded yet. Try again in a moment.'));
      return;
    }

    if (!CLIENT_ID) {
      reject(new Error('Google Client ID not configured'));
      return;
    }

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (response) => {
        if (response.error) {
          console.error('[GcpToken] Token request failed:', response.error);
          reject(new Error(`OAuth error: ${response.error}`));
          return;
        }
        if (response.access_token) {
          console.log('[GcpToken] Got access token');
          setGcpAccessToken(response.access_token);
          resolve(response.access_token);
        } else {
          reject(new Error('No access token in response'));
        }
      },
      ...(emailHint ? { hint: emailHint } : {}),
    });

    tokenClient.requestAccessToken(emailHint ? { hint: emailHint } : undefined);
  });
}
