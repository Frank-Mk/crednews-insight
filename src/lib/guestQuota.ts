// Tracks guest fact-check usage per day in localStorage.
// Limits: 2 text checks + 1 link check per calendar day (local time).

export const GUEST_LIMITS = { text: 2, link: 1 } as const;

type Mode = "text" | "link";

interface QuotaState {
  date: string; // YYYY-MM-DD local
  text: number;
  link: number;
}

const KEY = "verifact:guest-quota";

const todayKey = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const read = (): QuotaState => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as QuotaState;
      if (parsed.date === todayKey()) return parsed;
    }
  } catch {
    // ignore
  }
  return { date: todayKey(), text: 0, link: 0 };
};

const write = (state: QuotaState) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
};

export const getGuestUsage = () => {
  const s = read();
  return {
    text: { used: s.text, limit: GUEST_LIMITS.text, remaining: Math.max(0, GUEST_LIMITS.text - s.text) },
    link: { used: s.link, limit: GUEST_LIMITS.link, remaining: Math.max(0, GUEST_LIMITS.link - s.link) },
  };
};

export const canGuestCheck = (mode: Mode) => getGuestUsage()[mode].remaining > 0;

export const recordGuestCheck = (mode: Mode) => {
  const s = read();
  s[mode] += 1;
  write(s);
};

export const msUntilReset = () => {
  const now = new Date();
  const reset = new Date(now);
  reset.setHours(24, 0, 0, 0);
  return reset.getTime() - now.getTime();
};

export const formatResetIn = () => {
  const ms = msUntilReset();
  const hours = Math.floor(ms / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};
