import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { env } from '@/env'

const resend = new Resend(env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    const { error } = await resend.emails.send({
      from: 'contact@nikhilyates.ca',
      to: 'nikhilyates.work@gmail.com',
      replyTo: email,
      subject: `Contact Form: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    })

    if (error) {
      console.log('error: ', error)
      return NextResponse.json(
        { error: 'Failed to send contact email' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Contact information submitted successfully' },
      { status: 200 }
    )

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
