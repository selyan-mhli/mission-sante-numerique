import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import crypto from "crypto";

const SECRET = process.env.SESSION_SECRET || "docsante-dev-fallback-secret";

const PUBLIC_PATHS = ["/login", "/register", "/api/auth/login", "/api/auth/logout", "/api/auth/register"];

function verifyToken(token: string): boolean {
  const [b64, signature] = token.split(".");
  if (!b64 || !signature) return false;

  try {
    const payload = Buffer.from(b64, "base64").toString();
    const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/_next") || pathname.startsWith("/uploads") || pathname.includes(".")) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    return NextResponse.next();
  }

  const session = request.cookies.get("session")?.value;
  if (!session || !verifyToken(session)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
