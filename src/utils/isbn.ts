// Simple ISBN-10/13 validator (supports hyphens and spaces)
export function isValidIsbn(raw: string): boolean {
  if (!raw) return false;
  const s = raw.replace(/[-\s]/g, '').toUpperCase();
  if (s.length === 10) {
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      const c = s[i];
      if (c < '0' || c > '9') return false;
      sum += (10 - i) * (c.charCodeAt(0) - 48);
    }
    const last = s[9] === 'X' ? 10 : s[9] >= '0' && s[9] <= '9' ? s[9].charCodeAt(0) - 48 : NaN;
    if (Number.isNaN(last)) return false;
    sum += last;
    return sum % 11 === 0;
  }
  if (s.length === 13 && /^[0-9]{13}$/.test(s)) {
    let sum = 0;
    for (let i = 0; i < 13; i++) {
      const d = s.charCodeAt(i) - 48;
      sum += (i % 2 === 0 ? 1 : 3) * d;
    }
    return sum % 10 === 0;
  }
  return false;
}
