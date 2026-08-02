export type PlanTier = "guest" | "free" | "paid";

export const MOCK_SESSION = {
  familyId: "yamada-family",
  memberId: "dad",
  role: "admin" as const,
};

export const MOCK_IS_GUEST = false;
export const MOCK_GUEST_DAYS_LEFT = 6;

export const MOCK_PLAN: { tier: PlanTier; memberLimit: number; itemLimit: number } = {
  tier: "free",
  memberLimit: 5,
  itemLimit: 50,
};

const PASSWORD_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";

export function issueInitialPassword(): string {
  let out = "";
  for (let i = 0; i < 8; i++) {
    out += PASSWORD_CHARS[Math.floor(Math.random() * PASSWORD_CHARS.length)];
  }
  return out;
}
