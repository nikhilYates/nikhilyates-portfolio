'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { LinkedInPostType } from '@/lib/definitions'

interface ThoughtDetailProps {
  post: LinkedInPostType
  onClose: () => void
}

const topicColors: Record<string, string> = {
  AI: 'border-purple-600/50 bg-purple-800/30 text-purple-200',
  Career: 'border-amber-600/50 bg-amber-800/30 text-amber-200',
  Engineering: 'border-cyan-600/50 bg-cyan-800/30 text-cyan-200',
}

const defaultTopicColor = 'border-zinc-600 bg-zinc-800 text-zinc-200'

const ThoughtDetail = ({ post, onClose }: ThoughtDetailProps) => {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className='rounded-lg border border-zinc-700 bg-zinc-900 p-6 lg:p-8 flex flex-col gap-6 h-fit lg:sticky lg:top-8'
    >
      <div className='flex items-center justify-between'>
        <span className={`rounded-full border px-3 py-1 text-xs ${topicColors[post.topic] || defaultTopicColor}`}>
          {post.topic}
        </span>
        <button
          onClick={onClose}
          className='flex items-center justify-center w-8 h-8 rounded-full text-zinc-500 transition-colors duration-200 hover:text-white hover:bg-zinc-800'
          aria-label='Close detail panel'
        >
          &#10005;
        </button>
      </div>

      <span className='text-xs text-zinc-400'>{formattedDate}</span>

      <p className='text-sm leading-relaxed text-zinc-200 whitespace-pre-line'>
        {post.content}
      </p>

      <a
        href={post.url}
        target='_blank'
        rel='noopener noreferrer'
        className='flex items-center gap-1.5 text-sm text-zinc-400 transition-colors duration-300 hover:text-white mt-auto'
      >
        View on LinkedIn
        <span className='text-xs'>&#8599;</span>
      </a>
    </motion.div>
  )
}

export default ThoughtDetail
