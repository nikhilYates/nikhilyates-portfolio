'use client'

import StickyPillNav from './components/StickyPillNav'
import { ChatPanel } from '@/components/chat/ChatPanel'
import { SplineOrb } from '@/components/orb/SplineOrb'
import Ferrofluid from '@/components/ferrofluid/Ferrofluid'
import Image from 'next/image'
import linkedinWhite from '../../../../public/assets/svgs/linkedinWhite.svg'
import githubWhite from '../../../../public/assets/svgs/githubWhite.svg'

const FERRO_COLORS = ['#ffffff', '#7C3AED', '#ffffff']

const LandingPage = () => {
  const handleScroll = (link: string) => {
    const element = document.getElementById(link)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div
      id="home"
      className="relative flex h-[100dvh] flex-col overflow-hidden bg-zinc-950 px-4 py-8 lg:p-16"
    >
      <StickyPillNav onNavigate={handleScroll} />

      <Ferrofluid
        className="z-0"
        colors={FERRO_COLORS}
        speed={0.1}
        scale={3}
        turbulence={1}
        fluidity={0.02}
        rimWidth={0.25}
        sharpness={2.5}
        shimmer={2}
        glow={2.2}
        flowDirection="down"
        opacity={1}
        mouseInteraction
      />

      <div className="relative z-10 flex shrink-0 justify-end">
        <div className="flex flex-row gap-4">
          <a href="https://github.com/nikhilyates" target="_blank" rel="noopener noreferrer">
            <Image
              priority
              src={githubWhite}
              alt="github logo"
              className="h-6 w-6 cursor-pointer opacity-60 transition-opacity hover:opacity-100"
            />
          </a>
          <a
            href="https://www.linkedin.com/in/nikhilyates/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              priority
              src={linkedinWhite}
              alt="linkedin logo"
              className="h-6 w-6 cursor-pointer opacity-60 transition-opacity hover:opacity-100"
            />
          </a>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col items-center">
          <div className="pointer-events-auto w-full max-w-8xl">
            <SplineOrb framePadding={1.8} objectScale={0.7} />
          </div>
        </div>

        <ChatPanel className="h-full min-h-0 flex-1 pb-2" />
      </div>
    </div>
  )
}

export default LandingPage
