'use client'

import StickyPillNav from './components/StickyPillNav'
import Image from 'next/image'
import linkedinWhite from '../../../../public/assets/svgs/linkedinWhite.svg'
import githubWhite from '../../../../public/assets/svgs/githubWhite.svg'
import landingBg from '../../../../public/assets/images/landing_bg.png'
import footerOverlay from '../../../../public/assets/images/footer_background.svg'

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

      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${landingBg.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'top left',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.05] w-screen h-screen"
        style={{
          left: '0%',
          top: '-50%',
          height: '200%',
          backgroundImage: `url(${footerOverlay.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
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

      <div className="relative z-10 flex min-h-0 flex-1 items-center">
        <div className="flex flex-col gap-8">
          <h1 className="select-none text-[clamp(3rem,8vw,10rem)] font-normal leading-[0.95] tracking-tight text-white">
            nikhil yates
          </h1>
          <p className="text-base font-medium tracking-wide text-white md:text-lg lg:text-4xl">
            product execution, builder, entrepreneur
          </p>
          <p className="text-base font-medium tracking-wide text-white md:text-md lg:text-lg">
            yea, i like to make shit look good. what's the point otherwise
          </p>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
