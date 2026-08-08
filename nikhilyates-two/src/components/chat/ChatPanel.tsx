'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import arrowTurnDownLeft from '../../../public/assets/svgs/hero/ArrowTurnDownLeft.svg'

type Message = {
  id: string
  role: 'user' | 'assistant'
  text: string
  sources?: { title: string; url?: string }[]
}

let idCounter = 0
const nextId = () => {
  idCounter += 1
  return `m-${Date.now().toString(36)}-${idCounter}`
}

export function ChatPanel({ className }: { className?: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)

  const busyRef = useRef(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const onInputChange = useCallback((value: string) => {
    setInput(value)
  }, [])

  const submit = useCallback(async () => {
    const question = input.trim()
    if (!question || busyRef.current) return

    busyRef.current = true
    setBusy(true)
    setInput('')

    const userId = nextId()
    const replyId = nextId()
    setMessages((prev) => [
      ...prev,
      { id: userId, role: 'user', text: question },
      { id: replyId, role: 'assistant', text: '' },
    ])

    const patchReply = (fn: (m: Message) => Message) =>
      setMessages((prev) => prev.map((m) => (m.id === replyId ? fn(m) : m)))

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      })

      if (!res.ok || !res.body) {
        throw new Error(`Request failed (${res.status})`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.trim()) continue
          const chunk = JSON.parse(line)

          if (chunk.type === 'sources') {
            patchReply((m) => ({ ...m, sources: chunk.value }))
          } else if (chunk.type === 'token') {
            patchReply((m) => ({ ...m, text: m.text + chunk.value }))
          } else if (chunk.type === 'error') {
            throw new Error(chunk.value)
          }
        }
      }
    } catch (err) {
      patchReply((m) => ({
        ...m,
        text:
          m.text ||
          `Something went wrong: ${err instanceof Error ? err.message : 'unknown error'}`,
      }))
    } finally {
      busyRef.current = false
      setBusy(false)
    }
  }, [input])

  return (
    <div className={cn('flex h-full min-h-0 flex-col', className)}>
      <div className="relative min-h-0 flex-1">
        <div
          ref={scrollRef}
          className="flex h-full min-h-0 flex-col overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [mask-image:linear-gradient(to_bottom,transparent_0%,black_24%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_24%)] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex-1" aria-hidden />
          <div className="flex flex-col gap-6 pb-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  'flex',
                  m.role === 'user' ? 'justify-end text-right' : 'justify-start text-left',
                )}
              >
                <div
                  className={cn(
                    'max-w-[90%] font-extrabold tracking-tight leading-snug md:leading-tight',
                    'text-2xl md:text-4xl xl:text-5xl',
                    m.role === 'user' ? 'text-zinc-500' : 'text-white',
                  )}
                >
                  {m.text || <TypingDots />}
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5 border-t border-zinc-700/60 pt-3">
                      {m.sources.map((s) => (
                        <span
                          key={s.title}
                          className="rounded-full border border-zinc-700 px-2 py-0.5 text-[11px] font-medium tracking-normal text-zinc-500"
                        >
                          {s.title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          void submit()
        }}
        className="relative z-30 flex w-full shrink-0 items-center gap-3 pb-1 pt-3"
      >
        <Input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="ask me anything…"
          aria-label="Ask a question"
          autoComplete="off"
          className="flex-1 border border-gray-400 bg-zinc-950 text-zinc-100 placeholder:text-gray-400"
        />
        <Button
          type="submit"
          variant="secondary"
          disabled={busy || !input.trim()}
          aria-label="Send"
        >
          <b>{busy ? '…' : 'Send'}</b>
          <Image priority src={arrowTurnDownLeft} alt="" className="h-5 w-5" />
        </Button>
      </form>
    </div>
  )
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1.5 py-1" aria-label="Thinking">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="h-2 w-2 animate-bounce rounded-full bg-white/50"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  )
}
