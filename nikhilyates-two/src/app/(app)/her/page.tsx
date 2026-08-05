import type { Metadata } from 'next'
import { Cormorant_Garamond } from 'next/font/google'
import { isHerAuthenticated } from '@/lib/her-auth'
import { herDays } from './days'
import PasswordGate from './PasswordGate'
import HerCalendar from './HerCalendar'

const herSerif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-her-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'her · nikhil yates',
  robots: { index: false, follow: false },
}

export default async function HerPage() {
  const authenticated = await isHerAuthenticated()

  return (
    <div
      className={`${herSerif.variable} min-h-screen bg-[#f3ebe4] text-[#2c2420]`}
    >
      {authenticated ? <HerCalendar days={herDays} /> : <PasswordGate />}
    </div>
  )
}
