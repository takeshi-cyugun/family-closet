const GUEST_SESSION_KEY = "familyCloset.guestSession";

export const GUEST_TRIAL_DAYS = 10;
export const GUEST_ITEM_LIMIT = 10;

type GuestSession = { startedAt: string };

export function startGuestSession(): void {
  window.localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify({ startedAt: new Date().toISOString() }));
}

export function getGuestSession(): GuestSession | null {
  const raw = window.localStorage.getItem(GUEST_SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GuestSession;
  } catch {
    return null;
  }
}

export function getGuestDaysLeft(session: GuestSession): number {
  const elapsedDays = Math.floor((Date.now() - new Date(session.startedAt).getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, GUEST_TRIAL_DAYS - elapsedDays);
}
