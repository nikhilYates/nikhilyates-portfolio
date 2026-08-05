import { NextRequest, NextResponse } from 'next/server'
import {
  HER_SESSION_COOKIE,
  createHerSessionCookieValue,
  herSessionCookieOptions,
  verifyHerPassword,
} from '@/lib/her-auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const password = typeof body?.password === 'string' ? body.password : ''

    if (!verifyHerPassword(password)) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
    }

    const response = NextResponse.json({ ok: true }, { status: 200 })
    response.cookies.set(
      HER_SESSION_COOKIE,
      createHerSessionCookieValue(),
      herSessionCookieOptions()
    )
    return response
  } catch {
    return NextResponse.json({ error: 'Unable to sign in' }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true }, { status: 200 })
  response.cookies.set(HER_SESSION_COOKIE, '', {
    ...herSessionCookieOptions(0),
    maxAge: 0,
  })
  return response
}
