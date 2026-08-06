'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { avatarBus } from '@/lib/avatar-bus'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type Message = {
  id: string
  role: 'user' | 'assistant'
  text: string
  sources?: { title: string; url?: string }[]
}

/** How long after the last keystroke before the head settles back. */
const TYPING_IDLE_MS = 900
/** Characters of streamed text between speech bobs. Roughly a syllable group. */
const CHARS_PER_BOB = 18

let idCounter = 0
const nextId = () => {
  idCounter += 1
  // Timestamp keeps ids unique across HMR resets of the counter.
  return `m-${Date.now().toString(36)}-${idCounter}`
}

export function ChatPanel({ className }: { className?: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)

  // Guards the typing→listening transition so a keystroke mid-stream doesn't
  // yank the head out of `speaking`.
  const busyRef = useRef(false)
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  // Never leave the avatar stuck in a non-idle state if this unmounts mid-stream.
  useEffect(() => () => {
    if (typingTimer.current) clearTimeout(typingTimer.current)
    avatarBus.setState('idle')
  }, [])

  const onInputChange = useCallback((value: string) => {
    setInput(value)
    if (busyRef.current) return

    avatarBus.setState('listening')
    if (typingTimer.current) clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => {
      if (!busyRef.current) avatarBus.setState('idle')
    }, TYPING_IDLE_MS)
  }, [])

  const submit = useCallback(async () => {
    const question = input.trim()
    if (!question || busyRef.current) return

    if (typingTimer.current) clearTimeout(typingTimer.current)
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

    avatarBus.setState('thinking')

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
      let firstToken = true
      let charsSinceBob = 0

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // NDJSON: a chunk can split a line, so only consume complete ones.
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.trim()) continue
          const chunk = JSON.parse(line)

          if (chunk.type === 'sources') {
            patchReply((m) => ({ ...m, sources: chunk.value }))
          } else if (chunk.type === 'token') {
            if (firstToken) {
              firstToken = false
              avatarBus.setState('speaking')
              // The deliberate "I have an answer" nod.
              avatarBus.pulse(260)
            }

            charsSinceBob += chunk.value.length
            if (charsSinceBob >= CHARS_PER_BOB) {
              charsSinceBob = 0
              // Bigger beat at sentence boundaries.
              avatarBus.pulse(/[.!?]\s*$/.test(chunk.value) ? 95 : 38)
            }

            patchReply((m) => ({ ...m, text: m.text + chunk.value }))
          } else if (chunk.type === 'error') {
            throw new Error(chunk.value)
          }
        }
      }
    } catch (err) {
      patchReply((m) => ({
        ...m,
        text: m.text || `Something went wrong: ${err instanceof Error ? err.message : 'unknown error'}`,
      }))
    } finally {
      busyRef.current = false
      setBusy(false)
      // Brief hold so the last nod resolves before the pose settles.
      setTimeout(() => {
        if (!busyRef.current) avatarBus.setState('idle')
      }, 550)
    }
  }, [input])

  return (
    <div className={cn('flex h-full min-h-0 flex-col', className)}>
      <div
        ref={scrollRef}
        className="flex min-h-0 flex-1 flex-col overflow-y-auto pr-1 [scrollbar-gutter:stable]"
      >
        {/* Grows to fill free space so the thread sits on the input; min-h keeps orb clearance. */}
        <div className="min-h-52 flex-1" aria-hidden />
        <div className="flex flex-col gap-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              <div
                className={cn(
                  'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                  m.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground',
                )}
              >
                {m.text || <TypingDots />}
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 border-t border-border/40 pt-2">
                    {m.sources.map((s) => (
                      <span
                        key={s.title}
                        className="rounded-full bg-background/60 px-2 py-0.5 text-[11px] text-muted-foreground"
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

      <form
        onSubmit={(e) => {
          e.preventDefault()
          void submit()
        }}
        className="relative z-30 flex w-full shrink-0 items-center gap-2 pb-1 pt-3"
      >
        <Input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Ask me anything…"
          aria-label="Ask a question"
          autoComplete="off"
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={busy || !input.trim()} aria-label="Send">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1" aria-label="Thinking">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  )
}
