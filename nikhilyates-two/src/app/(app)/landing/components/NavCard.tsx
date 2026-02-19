import React from 'react'
import { NavigationContentType } from '@/lib/definitions';

interface NavCardProps {
    content: NavigationContentType,
    onNavigate: (link: string) => void;
    isMobile: boolean;
}


const NavCard = ({ content, onNavigate, isMobile }: NavCardProps) => {
  const handleClick = () => {
    if (content.title.toLowerCase() === 'scorpionlabz') {
      window.open(content.link, '_blank');
    } else {
      onNavigate(content.link);
    }
  };

  const isExternal = content.title.toLowerCase() === 'scorpionlabz';
  const index = String(content.id).padStart(2, '0');

  if (isMobile) {
    return (
      <div
        key={content.id}
        className='group flex items-center gap-4 py-5 border-b border-zinc-800 cursor-pointer active:bg-zinc-900/40 transition-colors duration-300'
        onClick={handleClick}
      >
        <span className='text-sm font-mono text-zinc-600 select-none'>{index}</span>
        <div className='flex-1 min-w-0'>
          <h3 className='text-2xl font-semibold tracking-tight text-white/90'>
            {content.title}
            {isExternal && (
              <span className='inline-block ml-2 text-zinc-600 text-sm align-middle'>&#8599;</span>
            )}
          </h3>
          <p className='text-sm text-zinc-500 mt-0.5 truncate'>{content.description}</p>
        </div>
        <svg
          className='w-4 h-4 text-zinc-600 flex-shrink-0'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
        </svg>
      </div>
    );
  }

  return (
    <div
        key={content.id}
        className='group lg:w-[10rem] lg:h-[20rem] overflow-hidden flex flex-col justify-end
        border-l border-zinc-800 cursor-pointer transition-all duration-700 hover:lg:w-[24rem] hover:bg-zinc-900/30 hover:backdrop-blur-md'
        onClick={handleClick}
    >
        <div className='flex flex-col justify-between h-full px-5 py-6'>
            <span className='text-sm font-mono text-zinc-600 select-none'>{index}</span>
            <div className='flex flex-col gap-1'>
                <h3 className='text-3xl font-semibold tracking-tight text-white/50 group-hover:text-white transition-colors duration-700 whitespace-nowrap'>
                    {content.title}
                    {isExternal && (
                        <span className='inline-block ml-2 text-zinc-600 text-sm align-middle'>&#8599;</span>
                    )}
                </h3>
                <p className='text-sm text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700 whitespace-nowrap'>
                    {content.description}
                </p>
            </div>
        </div>
    </div>
  )
}

export default NavCard