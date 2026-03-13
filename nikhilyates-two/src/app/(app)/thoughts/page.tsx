'use client'

import React, { useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import LinkedInPostCard from './LinkedInPostCard'
import ThoughtDetail from './ThoughtDetail'
import data from '../../../../data/linkedin-posts.json'
import { LinkedInPostType } from '@/lib/definitions'

const LinkedIn = () => {
  const posts: LinkedInPostType[] = data.toReversed();
  const [selectedPost, setSelectedPost] = useState<LinkedInPostType | null>(null)
  const detailRef = useRef<HTMLDivElement>(null)

  const scrollToDetail = useCallback(() => {
    if (window.innerWidth < 1024 && detailRef.current) {
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 150)
    }
  }, [])

  const handleSelect = (post: LinkedInPostType) => {
    const isDeselecting = selectedPost?.id === post.id
    setSelectedPost((prev) => (prev?.id === post.id ? null : post))
    if (!isDeselecting) {
      scrollToDetail()
    }
  }

  const handleClose = () => {
    setSelectedPost(null)
  }

  return (
    <div id='thoughts' className='bg-zinc-950 h-auto w-screen px-4 py-8 lg:p-16 flex flex-col gap-8'>
      <div className='w-full flex flex-col gap-3'>
        <h1 className='scroll-m-20 text-6xl font-extralight tracking-tight 2xl:text-8xl text-white/20'>thoughts</h1>
      </div>
      <LayoutGroup>
        <div className='flex flex-col lg:flex-row gap-6'>
          <motion.div
            layout
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`grid grid-cols-1 gap-6 ${
              selectedPost ? 'lg:w-[45%] lg:grid-cols-1' : 'lg:w-full lg:grid-cols-2'
            }`}
          >
            {posts.map((post) => (
              <LinkedInPostCard
                key={post.id}
                post={post}
                isSelected={selectedPost?.id === post.id}
                onSelect={handleSelect}
              />
            ))}
          </motion.div>

          <AnimatePresence mode='wait'>
            {selectedPost && (
              <motion.div
                ref={detailRef}
                key={selectedPost.id}
                layout
                className='w-full lg:w-[55%]'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ThoughtDetail post={selectedPost} onClose={handleClose} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </div>
  )
}

export default LinkedIn
