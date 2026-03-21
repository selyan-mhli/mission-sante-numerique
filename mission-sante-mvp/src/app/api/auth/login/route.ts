import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { authenticateUser } from "@/services/user.service";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
  }

  const user = await authenticateUser(email, password);
  if (!user) {
    return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });
  }

  await createSession(user.id);

  return NextResponse.json({ user });
}
