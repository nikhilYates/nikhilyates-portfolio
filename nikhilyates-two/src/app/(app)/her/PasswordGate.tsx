'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function PasswordGate() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/her/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        setError(data?.error ?? 'Incorrect password')
        setLoading(false)
        return
      }

      router.refresh()
    } catch {
      setError('Something went wrong. Try again.')
      setLoading(false)
    }
  }

  return (
    <div className="her-page relative flex min-h-screen items-center justify-center px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 20% 20%, rgba(196, 140, 122, 0.25), transparent), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(90, 110, 100, 0.18), transparent)',
        }}
      />
      <form
        onSubmit={onSubmit}
        className="relative z-10 flex w-full max-w-sm flex-col gap-5"
      >
        <div className="flex flex-col gap-2 text-center">
          <p className="font-[family-name:var(--font-her-serif)] text-sm tracking-[0.2em] uppercase text-[#8a6f64]">
            for you
          </p>
          <h1 className="font-[family-name:var(--font-her-serif)] text-4xl font-light tracking-tight text-[#2c2420]">
            enter gently
          </h1>
        </div>
        <Input
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-12 border-[#d4c4bb] bg-white/50 text-center text-base text-[#2c2420] placeholder:text-[#a89086] focus-visible:ring-[#c48c7a]"
          disabled={loading}
          required
        />
        {error && (
          <p className="text-center text-sm text-[#a14d3a]" role="alert">
            {error}
          </p>
        )}
        <Button
          type="submit"
          disabled={loading || !password}
          className="h-12 bg-[#2c2420] text-[#f7f1ec] hover:bg-[#3d332e]"
        >
          {loading ? '…' : 'open'}
        </Button>
      </form>
    </div>
  )
}
