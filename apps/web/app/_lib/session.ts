const GUEST_SESSION_KEY = "familyCloset.guestSession";

export const GUEST_ITEM_LIMIT = 10;

export function startGuestSession(): void {
  window.localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify({ startedAt: new Date().toISOString() }));
}
