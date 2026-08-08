'use client'

import { useEffect, useState } from 'react'
import StickyPillNav from './components/StickyPillNav'
import Image from 'next/image'
import linkedinWhite from '../../../../public/assets/svgs/linkedinWhite.svg'
import githubWhite from '../../../../public/assets/svgs/githubWhite.svg'
import landingBg from '../../../../public/assets/images/landing_bg.svg'
import mobileLandingBg from '../../../../public/assets/images/landing_bg_vertical.svg'

const LandingPage = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

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

      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          top: '50%',
          left: '50%',
          width: 'max(100vw, 100vh)',
          height: 'max(100vw, 100vh)',
          backgroundImage: `url(${isMobile ? mobileLandingBg.src : landingBg.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: `translate(-50%, -50%) rotate(${isMobile ? '90deg' : '0'})`,
        }}
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
    </div>
  )
}

export default LandingPage
