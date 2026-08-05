import { NextRequest } from 'next/server'

/**
 * MOCK RAG ENDPOINT — replace the body of `answer()` with real retrieval.
 *
 * The wire format is newline-delimited JSON so the real implementation can
 * interleave citations with tokens without a breaking change:
 *
 *   {"type":"sources","value":[{"title":"...","url":"..."}]}
 *   {"type":"token","value":"Nikhil "}
 *   {"type":"done"}
 *
 * The client only cares about `type`, so swapping the generator out leaves the
 * avatar wiring and the UI untouched.
 */

export const runtime = 'nodejs'

type Chunk =
  | { type: 'token'; value: string }
  | { type: 'sources'; value: { title: string; url?: string }[] }
  | { type: 'error'; value: string }
  | { type: 'done' }

const CANNED: { match: RegExp; sources: string[]; text: string }[] = [
  {
    match: /experience|work|job|role|career/i,
    sources: ['resume.md', 'linkedin-positions.json'],
    text:
      "I've spent my career at the intersection of venture building and applied AI. " +
      'Most recently I have been working on company creation — taking early market signals ' +
      'through structured opportunity gates and into funded ventures. Before that my focus was ' +
      'more squarely on engineering: building data platforms and the systems around them.',
  },
  {
    match: /stack|tech|tools|build|engineer/i,
    sources: ['projects.md', 'github-repos.json'],
    text:
      'Day to day I reach for TypeScript and Next.js on the front end, Python for anything ' +
      'data or model shaped, and Postgres as a default. This site is Next.js on the App Router ' +
      'with Tailwind and Supabase behind it.',
  },
  {
    match: /who|about|yourself|you/i,
    sources: ['about.md'],
    text:
      "I'm Nikhil Yates. I build companies and the software underneath them. " +
      'I care a lot about the gap between a promising signal and a thing that actually ships, ' +
      'which is most of what I work on now.',
  },
]

const FALLBACK = {
  sources: ['about.md'],
  text:
    "That one isn't in what I've indexed yet. Ask me about my experience, the things I've built, " +
    'or what I am working on now and I will have a much better answer for you.',
}

function answer(question: string) {
  const hit = CANNED.find((c) => c.match.test(question))
  return hit ?? FALLBACK
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function POST(request: NextRequest) {
  let question = ''
  try {
    const body = await request.json()
    question = typeof body?.question === 'string' ? body.question : ''
  } catch {
    return new Response('Invalid JSON body', { status: 400 })
  }

  if (!question.trim()) {
    return new Response('Missing question', { status: 400 })
  }

  const { sources, text } = answer(question)
  const encoder = new TextEncoder()

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (chunk: Chunk) =>
        controller.enqueue(encoder.encode(JSON.stringify(chunk) + '\n'))

      try {
        // Stand-in for embedding + vector search latency. This is what makes the
        // avatar's `thinking` state visible, so keep some delay here even once
        // real retrieval lands.
        await sleep(650)
        send({ type: 'sources', value: sources.map((title) => ({ title })) })

        // Emit word by word so the client sees a realistic token cadence.
        for (const word of text.split(/(?<=\s)/)) {
          send({ type: 'token', value: word })
          await sleep(18 + Math.random() * 42)
        }

        send({ type: 'done' })
      } catch (err) {
        send({ type: 'error', value: err instanceof Error ? err.message : 'Stream failed' })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
