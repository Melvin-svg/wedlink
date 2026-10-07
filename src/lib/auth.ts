import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "wedlink-default-fallback-secret-key-32chars!"
);

const SESSION_COOKIE_NAME = "wedlink_session";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(payload: SessionPayload): Promise<string> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });

  return token;
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.userId) return null;

  try {
    return await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, name: true, email: true, avatarUrl: true },
    });
  } catch {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// Password verification cookie helper for protected invitations
export async function setInvitationAccessCookie(invitationId: string) {
  const cookieStore = await cookies();
  const token = await new SignJWT({ invitationId, access: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  cookieStore.set(`wedlink_access_${invitationId}`, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function hasInvitationAccess(invitationId: string): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(`wedlink_access_${invitationId}`)?.value;
  if (!token) return false;
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return (verified.payload as { invitationId: string; access: boolean }).invitationId === invitationId;
  } catch {
    return false;
  }
}
