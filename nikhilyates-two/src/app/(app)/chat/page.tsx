import { ChatPanel } from '@/components/chat/ChatPanel'
import { SplineOrb } from '@/components/orb/SplineOrb'

export default function ChatPage() {
  return (
    <main className="relative mx-auto h-[100vh] w-full overflow-hidden bg-zinc-950 flex flex-col justify-start items-center">
      {/* Fixed orb layer — chat scrolls behind this and fades through the gradient. */}
      <div className="pointer-events-none max-w-10xl inset-x-0 top-0 left-[25%] z-20 flex flex-col items-center px-6 ">
        <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-64 bg-zinc-950" />
        <div
          aria-hidden
          className="absolute inset-x-0 top-64 -z-10 h-96 bg-gradient-to-b from-zinc-950 to-transparent"
        />

        <div className="pointer-events-auto absolute top-0 max-w-12xl">
          <SplineOrb framePadding={1.8} objectScale={0.7} />
        </div>

      </div>

      <ChatPanel className="h-full w-full max-w-4xl px-6 pb-6" />
    </main>
  )
}
