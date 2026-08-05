import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'
import { env } from '@/env'

export const HER_SESSION_COOKIE = 'her_session'

function getSessionToken(): string {
  const password = env.HER_PAGE_PASSWORD
  if (!password) {
    throw new Error('HER_PAGE_PASSWORD is not configured')
  }
  return createHmac('sha256', password)
    .update('nikhilyates-her-session-v1')
    .digest('hex')
}

export function verifyHerPassword(input: string): boolean {
  const password = env.HER_PAGE_PASSWORD
  if (!password) return false

  const inputBuf = Buffer.from(input)
  const passwordBuf = Buffer.from(password)

  if (inputBuf.length !== passwordBuf.length) {
    // Constant-time-ish dead compare so length alone isn't a cheap oracle
    timingSafeEqual(passwordBuf, passwordBuf)
    return false
  }

  return timingSafeEqual(inputBuf, passwordBuf)
}

export function createHerSessionCookieValue(): string {
  return getSessionToken()
}

export function isValidHerSession(cookieValue: string | undefined): boolean {
  if (!cookieValue || !env.HER_PAGE_PASSWORD) return false

  try {
    const expected = Buffer.from(getSessionToken())
    const actual = Buffer.from(cookieValue)
    if (expected.length !== actual.length) return false
    return timingSafeEqual(expected, actual)
  } catch {
    return false
  }
}

export async function isHerAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  return isValidHerSession(cookieStore.get(HER_SESSION_COOKIE)?.value)
}

export function herSessionCookieOptions(maxAgeSeconds = 60 * 60 * 24 * 30) {
  return {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeSeconds,
  }
}
