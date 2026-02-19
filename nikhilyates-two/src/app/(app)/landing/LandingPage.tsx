'use client'

import React, { useState, useEffect } from 'react'
import contents from '../../../../data/contents.json';
import NavCard from './components/NavCard';
import Image from 'next/image';
import linkedinWhite from '../../../../public/assets/svgs/linkedinWhite.svg';
import githubWhite from '../../../../public/assets/svgs/githubWhite.svg';
import nyWhite from '../../../../public/assets/svgs/nyWhite.svg';
import landingBg from '../../../../public/assets/images/landing_bg.svg';
import mobileLandingBg from '../../../../public/assets/images/landing_bg_vertical.svg';

const LandingPage = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // Using 768px as the breakpoint for mobile
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleScroll = (link: string) => {
    const element = document.getElementById(link);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div 
      id='home' 
      className='bg-zinc-950 min-h-screen h-auto px-4 py-8 lg:p-16 relative'
      style={{
        backgroundImage: `url(${isMobile ? mobileLandingBg.src : landingBg.src})`,
        backgroundSize: `${isMobile ? 'cover' : 'contain'}`,
        backgroundPosition: 'top left',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className='w-full h-full flex flex-col gap-4 lg:gap-0'>
        <div className='h-full w-full flex flex-col justify-top'>
          <div className='flex flex-row justify-between'>
            <Image priority src={nyWhite} alt='linkedin logo' className='h-16 w-16'/>
            <div className="w-1/3">
            </div>
            <div className='flex flex-row justify-end gap-4 '>
              <a href="https://github.com/nikhilyates" target="_blank" rel="noopener noreferrer">
                <Image priority src={githubWhite} alt='github logo' className='h-5 w-5 cursor-pointer opacity-60 hover:opacity-100 transition-opacity'/>
              </a>
              <a href="https://www.linkedin.com/in/nikhilyates/" target="_blank" rel="noopener noreferrer">
                <Image priority src={linkedinWhite} alt='linkedin logo' className='h-5 w-5 cursor-pointer opacity-60 hover:opacity-100 transition-opacity'/>
              </a>
            </div>
          </div>
        </div>
        {/* smart navigation divs */}
        {isMobile ? (
          <div className='mt-12 flex flex-col'>
            <p className='text-xs font-mono uppercase tracking-widest text-zinc-600 mb-4'>navigate</p>
            <div className='border-t border-zinc-800'>
              {contents.map((content) => (
                <NavCard
                  key={content.id}
                  content={content}
                  onNavigate={handleScroll}
                  isMobile={isMobile}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className='lg:absolute lg:top-1/2 lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-auto flex flex-col justify-center'>
            <div className='flex flex-col justify-center'>
              <div className='flex w-full flex-col md:flex-row justify-center gap-1'>
                {contents.map((content) => (
                  <NavCard
                    key={content.id}
                    content={content}
                    onNavigate={handleScroll}
                    isMobile={isMobile}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LandingPage