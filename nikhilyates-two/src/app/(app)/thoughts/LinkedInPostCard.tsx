'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { LinkedInPostType } from '@/lib/definitions'

const topicColors: Record<string, string> = {
  AI: 'border-purple-700/50 bg-purple-900/30 text-purple-300',
  Career: 'border-amber-700/50 bg-amber-900/30 text-amber-300',
  Engineering: 'border-cyan-700/50 bg-cyan-900/30 text-cyan-300',
}

const defaultTopicColor = 'border-zinc-800 bg-zinc-900/50 text-zinc-400'

interface LinkedInPostCardProps {
  post: LinkedInPostType
  isSelected: boolean
  onSelect: (post: LinkedInPostType) => void
}

const LinkedInPostCard = ({ post, isSelected, onSelect }: LinkedInPostCardProps) => {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <motion.div
      layout
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={() => onSelect(post)}
      className={`flex flex-col justify-between gap-4 rounded-lg border p-6 cursor-pointer transition-colors duration-300 ${
        isSelected
          ? 'border-zinc-600 bg-zinc-900'
          : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
      }`}
    >
      <div className='flex flex-col gap-3'>
        <div className='flex items-center justify-between'>
          <span className={`rounded-full border px-3 py-1 text-xs ${topicColors[post.topic] || defaultTopicColor}`}>
            {post.topic}
          </span>
          <span className='text-xs text-zinc-600'>{formattedDate}</span>
        </div>
        <p className='text-sm leading-relaxed text-zinc-300 line-clamp-5'>
          {post.content.slice(0, 150) + '...'}
        </p>
      </div>
      <a
        href={post.url}
        target='_blank'
        rel='noopener noreferrer'
        onClick={(e) => e.stopPropagation()}
        className='flex items-center gap-1.5 text-sm text-zinc-500 transition-colors duration-300 hover:text-white'
      >
        View on LinkedIn
        <span className='text-xs'>&#8599;</span>
      </a>
    </motion.div>
  )
}

export default LinkedInPostCard
