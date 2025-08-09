import { setHeaders, resetHeaders } from './fetcher';

const TOKEN_KEY = 'app.auth.token';
const AUTH_EVENT = 'auth:changed';

export const getToken = (): string | null => {
  try {
    const raw = sessionStorage.getItem(TOKEN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const isLoggedIn = (): boolean => !!getToken();

export const login = (token: string) => {
  sessionStorage.setItem(TOKEN_KEY, JSON.stringify(token));
  setHeaders(token);
  window.dispatchEvent(new Event(AUTH_EVENT));
};

export const logout = () => {
  // Remove token from all possible places to avoid mismatches
  try { sessionStorage.removeItem("app.auth.token"); } catch {}
  try { localStorage.removeItem("app.auth.token"); } catch {}

  resetHeaders();
  window.dispatchEvent(new Event(AUTH_EVENT));
};

export const subscribe = (cb: () => void) => {
  const handler = () => cb();
  window.addEventListener(AUTH_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(AUTH_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
};
