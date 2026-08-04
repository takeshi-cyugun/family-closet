export type PlanTier = "guest" | "free" | "paid";

export const PLAN_LIMITS: Record<PlanTier, { memberLimit: number; itemLimit: number }> = {
  guest: { memberLimit: 1, itemLimit: 10 },
  free: { memberLimit: 5, itemLimit: 50 },
  paid: { memberLimit: Infinity, itemLimit: Infinity },
};

export function mapPlanTypeToTier(planType: string): PlanTier {
  if (planType === 'chest') return 'free';
  if (planType === 'walk_in') return 'paid';
  return 'guest';
}

const PASSWORD_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";

export function issueInitialPassword(): string {
  let out = "";
  for (let i = 0; i < 8; i++) {
    out += PASSWORD_CHARS[Math.floor(Math.random() * PASSWORD_CHARS.length)];
  }
  return out;
}
