import type { Metadata } from 'next'
import { ChatPanel } from '@/components/chat/ChatPanel'
import { SplineOrb } from '@/components/orb/SplineOrb'

export const metadata: Metadata = {
  title: 'ask nikhil',
  description: 'Ask questions about my background, experience, and work.',
}

export default function ChatPage() {
  return (
    <main className="relative mx-auto h-[100dvh] w-full max-w-2xl overflow-hidden border border-1 border-red-200">
      {/* Fixed orb layer — chat scrolls behind this and fades through the gradient. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col items-center px-6 pt-10">
        <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-96 bg-background" />
        <div
          aria-hidden
          className="absolute inset-x-0 top-96 -z-10 h-96 bg-gradient-to-b from-background to-transparent border border-1 border"
        />

        <div className="pointer-events-auto w-full border border-blue-200">
          <SplineOrb framePadding={1.8} objectScale={0.7} />
        </div>

      </div>

      <ChatPanel className="h-full px-6 pb-6" />
    </main>
  )
}
