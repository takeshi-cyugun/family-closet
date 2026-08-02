type MockAccount = {
  familyId: string;
  memberId: string;
  password: string;
  firstLogin: boolean;
};

const MOCK_ACCOUNTS: MockAccount[] = [
  { familyId: "yamada-family", memberId: "dad", password: "Password123", firstLogin: false },
  { familyId: "yamada-family", memberId: "mom", password: "TempPass99", firstLogin: true },
];

export type LoginResult = { ok: true; firstLogin: boolean } | { ok: false };

export async function mockLogin(familyId: string, memberId: string, password: string): Promise<LoginResult> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const account = MOCK_ACCOUNTS.find(
    (a) => a.familyId === familyId && a.memberId === memberId && a.password === password
  );

  if (!account) return { ok: false };
  return { ok: true, firstLogin: account.firstLogin };
}
