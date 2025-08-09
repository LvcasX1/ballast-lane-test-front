import { setHeaders, resetHeaders } from './fetcher';

const TOKEN_KEY = 'app.auth.token';
const ROLE_KEY = 'app.auth.role';
const AUTH_EVENT = 'auth:changed';

export const getToken = (): string | null => {
  try {
    const raw = sessionStorage.getItem(TOKEN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export type UserRole = 'librarian' | 'member';

export const getRole = (): UserRole | null => {
  try {
    const token = getToken();
    if (!token) {
      try { sessionStorage.removeItem(ROLE_KEY); } catch {}
      return null;
    }
    const raw = sessionStorage.getItem(ROLE_KEY);
    return raw ? (JSON.parse(raw) as UserRole) : null;
  } catch {
    return null;
  }
};

export const isLoggedIn = (): boolean => !!getToken();
export const isLibrarian = (): boolean => !!getToken() && getRole() === 'librarian';

export const setRole = (role: UserRole) => {
  sessionStorage.setItem(ROLE_KEY, JSON.stringify(role));
  window.dispatchEvent(new Event(AUTH_EVENT));
};

export const login = (token: string, role?: UserRole) => {
  sessionStorage.setItem(TOKEN_KEY, JSON.stringify(token));
  if (role) sessionStorage.setItem(ROLE_KEY, JSON.stringify(role));
  setHeaders(token);
  window.dispatchEvent(new Event(AUTH_EVENT));
};

export const logout = () => {
  try { sessionStorage.removeItem(TOKEN_KEY); } catch {}
  try { localStorage.removeItem(TOKEN_KEY); } catch {}
  try { sessionStorage.removeItem(ROLE_KEY); } catch {}
  try { localStorage.removeItem(ROLE_KEY); } catch {}

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

try {
  const hasToken = !!sessionStorage.getItem(TOKEN_KEY);
  if (!hasToken) {
    sessionStorage.removeItem(ROLE_KEY);
  }
} catch {}
