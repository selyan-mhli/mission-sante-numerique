import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import crypto from "crypto";

const SECRET = process.env.SESSION_SECRET || "docsante-dev-fallback-secret";

function sign(payload: string): string {
  const hmac = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return `${Buffer.from(payload).toString("base64")}.${hmac}`;
}

function verify(token: string): string | null {
  const [b64, signature] = token.split(".");
  if (!b64 || !signature) return null;

  const payload = Buffer.from(b64, "base64").toString();
  const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }

  return payload;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

export async function createSession(userId: string) {
  const payload = `${userId}:${Date.now()}`;
  const token = sign(payload);
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return token;
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  if (!session?.value) return null;

  try {
    const payload = verify(session.value);
    if (!payload) return null;

    const userId = payload.split(":")[0];
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, avatar: true },
    });
    return user;
  } catch {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
