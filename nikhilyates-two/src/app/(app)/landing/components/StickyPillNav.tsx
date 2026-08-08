'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { motion } from 'framer-motion'
import nyWhite from '../../../../../public/assets/svgs/nyWhite.svg'
import contents from '../../../../../data/contents.json'

const ICON = 53
const OPEN_THRESHOLD = 48
const MIN_OPEN_WIDTH = 336
const OPEN_VW = 0.24

type StickyPillNavProps = {
  onNavigate: (link: string) => void
}

export default function StickyPillNav({ onNavigate }: StickyPillNavProps) {
  const [atTop, setAtTop] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [openWidth, setOpenWidth] = useState(MIN_OPEN_WIDTH)
  const [mounted, setMounted] = useState(false)

  const open = atTop || hovered

  useEffect(() => {
    setMounted(true)

    const syncScroll = () => setAtTop(window.scrollY < OPEN_THRESHOLD)
    const syncWidth = () =>
      setOpenWidth(Math.max(Math.round(window.innerWidth * OPEN_VW), MIN_OPEN_WIDTH))

    syncScroll()
    syncWidth()
    window.addEventListener('scroll', syncScroll, { passive: true })
    window.addEventListener('resize', syncWidth)
    return () => {
      window.removeEventListener('scroll', syncScroll)
      window.removeEventListener('resize', syncWidth)
    }
  }, [])

  const goHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLink = (title: string, link: string) => {
    if (title.toLowerCase() === 'scorpionlabz') {
      window.open(link, '_blank', 'noopener,noreferrer')
      return
    }
    onNavigate(link)
  }

  if (!mounted) return null

  return createPortal(
    <nav
      aria-label="Primary"
      className="pointer-events-none fixed left-4 top-4 z-50 md:left-6 md:top-6"
    >
      {/* White circle → expands into the full pill. Logo stays black inside it. */}
      <motion.div
        className="pointer-events-auto flex h-[53px] items-center overflow-hidden rounded-full bg-white shadow-[0_8px_30px_rgba(0,0,0,0.18)]"
        initial={false}
        animate={{
          width: open ? openWidth : ICON,
          paddingRight: open ? 14 : 0,
        }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
      >
        <button
          type="button"
          onClick={goHome}
          aria-label="Back to top"
          className="flex h-[53px] w-[53px] shrink-0 items-center justify-center rounded-full"
        >
          <Image
            priority
            src={nyWhite}
            alt=""
            className="h-[34px] w-[34px] brightness-0"
          />
        </button>

        <ul
          className="flex min-w-0 flex-1 items-center justify-evenly gap-0.5"
          aria-hidden={!open}
        >
          {contents.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                tabIndex={open ? 0 : -1}
                onClick={() => handleLink(item.title, item.link)}
                className="whitespace-nowrap px-1.5 py-1 text-[13px] font-medium tracking-wide text-black transition-opacity hover:opacity-55"
              >
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      </motion.div>
    </nav>,
    document.body,
  )
}
