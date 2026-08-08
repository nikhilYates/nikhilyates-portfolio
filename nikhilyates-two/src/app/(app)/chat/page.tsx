'use client'

import { ChatPanel } from '@/components/chat/ChatPanel'
import askBg from '../../../../public/assets/images/ask_bg.svg'

export default function ChatPage() {
  return (
    <section
      id="chat"
      className="relative mx-auto flex h-[100dvh] w-full flex-col overflow-hidden bg-zinc-950 px-4 py-8 lg:px-16 lg:py-12"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${askBg.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col">
        <ChatPanel className="h-full min-h-0 flex-1 pb-2" />
      </div>
    </section>
  )
}
