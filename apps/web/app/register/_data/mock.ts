export const TAKEN_FAMILY_IDS = [
  "yamada-family",
  "smith-home",
  "tanaka",
  "family-closet",
  "demo",
];

export async function checkFamilyIdAvailability(id: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return !TAKEN_FAMILY_IDS.includes(id.toLowerCase());
}

export const MOCK_HAS_GUEST_SESSION = true;

export const MOCK_GUEST_ITEM_COUNT = 4;
