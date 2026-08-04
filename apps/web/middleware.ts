import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const FORCE_PASSWORD_CHANGE_COOKIE = "fc_force_password_change";
const CHANGE_PASSWORD_PATH = "/change-password";

export function middleware(request: NextRequest) {
  const mustChangePassword = request.cookies.get(FORCE_PASSWORD_CHANGE_COOKIE)?.value === "1";
  const { pathname } = request.nextUrl;

  if (mustChangePassword && pathname !== CHANGE_PASSWORD_PATH) {
    return NextResponse.redirect(new URL(CHANGE_PASSWORD_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
