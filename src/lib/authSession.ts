// Central owner of the live session (access + refresh tokens). The api layer
// (syncFetch/authedFetch) and AuthContext both go through here so refresh logic
// lives in exactly one place: callers ask for "a usable access token" and this
// module refreshes proactively when the access token is near expiry, and the api
// layer retries once on a 401.
//
// The session object is held in memory; AuthContext subscribes to changes and
// mirrors them to SecureStore so they survive relaunches.

import { API_BASE_URL } from '@/config';

export type Session = {
  accessToken: string;
  refreshToken: string;
  // Access-token expiry as epoch ms (from the API's expires_at). Refresh if the
  // current time is within REFRESH_SKEW_MS of this.
  expiresAt: number;
};

type Listener = (s: Session | null) => void;

// AuthError signals an unrecoverable session (refresh token dead/missing). The
// api layer and AuthContext treat it as "log the user out."
export class AuthError extends Error {
  constructor(message = 'session expired') {
    super(message);
    this.name = 'AuthError';
  }
}

let session: Session | null = null;
let listeners: Listener[] = [];
let inflight: Promise<Session> | null = null;

// Refresh proactively when fewer than this many ms remain on the access token,
// so a request doesn't have to eat a 401 round-trip.
const REFRESH_SKEW_MS = 60_000;

export function getSession(): Session | null {
  return session;
}

export function setSession(s: Session | null): void {
  session = s;
  for (const l of listeners) l(s);
}

export function clearSession(): void {
  setSession(null);
}

// subscribe registers a listener fired on every session change; returns an
// unsubscribe. AuthContext uses it to persist to SecureStore + drive React state.
export function subscribe(l: Listener): () => void {
  listeners.push(l);
  return () => {
    listeners = listeners.filter((x) => x !== l);
  };
}

// Shape of the register/login/refresh response — only the token fields are
// needed here (the user object is handled by AuthContext, not the session).
type TokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_at: string;
};

async function doRefresh(): Promise<Session> {
  const rt = session?.refreshToken;
  if (!rt) throw new AuthError('no refresh token');

  const res = await fetch(API_BASE_URL + '/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: rt }),
  });
  if (!res.ok) throw new AuthError('refresh failed');

  const data = (await res.json()) as TokenResponse;
  const next: Session = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: new Date(data.expires_at).getTime(),
  };
  setSession(next);
  return next;
}

// refreshNow runs a single refresh, coalescing concurrent callers onto the same
// in-flight request so a burst of 401s doesn't hammer /auth/refresh.
export function refreshNow(): Promise<Session> {
  if (inflight) return inflight;
  inflight = doRefresh().finally(() => {
    inflight = null;
  });
  return inflight;
}

// getAccessToken returns a valid access token, refreshing first if it is near or
// past expiry. Throws AuthError if there is no session or the refresh failed.
export async function getAccessToken(): Promise<string> {
  if (!session) throw new AuthError('not authenticated');
  if (Date.now() + REFRESH_SKEW_MS >= session.expiresAt) {
    const next = await refreshNow();
    return next.accessToken;
  }
  return session.accessToken;
}
