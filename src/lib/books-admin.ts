import 'server-only';
import crypto from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'books_admin';
const SESSION_LABEL = 'books-admin-session-v1';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/** Session token derived from the admin password — changing the password invalidates old sessions. */
function expectedToken(): string | null {
  const password = process.env.BOOKS_ADMIN_PASSWORD;
  if (!password) return null;
  return crypto.createHmac('sha256', password).update(SESSION_LABEL).digest('hex');
}

export function adminConfigured(): boolean {
  return Boolean(process.env.BOOKS_ADMIN_PASSWORD);
}

export function verifyPassword(input: string): boolean {
  const password = process.env.BOOKS_ADMIN_PASSWORD;
  if (!password || !input) return false;
  return safeEqual(input, password);
}

export function isAdmin(): boolean {
  const token = expectedToken();
  if (!token) return false;
  const current = cookies().get(COOKIE_NAME)?.value;
  return Boolean(current) && safeEqual(current as string, token);
}

/** Must be called from a Server Action or Route Handler. */
export function startAdminSession(): void {
  const token = expectedToken();
  if (!token) return;
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export function endAdminSession(): void {
  cookies().delete(COOKIE_NAME);
}
