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
        className='w-full opacity-70 rounded-2xl md:max-w-full lg:w-[10rem] lg:h-[20rem] h-[6rem] overflow-hidden flex flex-col items-start justify-end
        border-[0.25rem] border-gray-400 cursor-pointer transition-all duration-1000 md:hover:w-[24rem] md:hover:opacity-100'
        style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${content.photoUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'left'
        }}
        onClick={handleClick}
    >
        <div className='transform whitespace-nowrap p-0 text-left lg:p-4'>
            <h3 className={`text-4xl md:text-6xl font-semibold tracking-tight text-white/30 lg:text-white/40`}>{content.title}</h3>
        </div>
        <div className='inset-0 p-4 text-white text-center w-full h-full hidden md:hover:block'>
            {content.description}
        </div>
    </div>
  )
}

export default NavCard