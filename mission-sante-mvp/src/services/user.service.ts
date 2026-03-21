import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, avatar: true },
  });
}

export async function authenticateUser(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) return null;

  const valid = await verifyPassword(password, user.password);
  if (!valid) return null;

  return { id: user.id, name: user.name, email: user.email, role: user.role };
}
