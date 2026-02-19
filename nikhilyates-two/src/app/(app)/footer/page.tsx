"use client"
import React from 'react'
import Image from 'next/image'
import { handleScroll } from '@/app/(app)/utils/Scroll'
import contents from '../../../../data/contents.json'
import { Separator } from '@/components/ui/separator'

import nikhilYates from '../../../../public/assets/images/footer_background.svg'
import linkedinWhite from '../../../../public/assets/svgs/linkedinWhite.svg';
import githubWhite from '../../../../public/assets/svgs/githubWhite.svg';


const Footer = () => {

    return (
        <div 
            className="h-[90vh] lg:h-[70vh] w-full flex flex-col justify-between relative bg-zinc-950 px-4 py-8 lg:p-16"
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.95)), url(${nikhilYates.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'left',
            }}
        >   
            <div className='flex flex-col h-full justify-between'>
                <div className='flex flex-col w-fit gap-4 justify-start align-top'>
                    <Separator orientation={'horizontal'} />
                    <a onClick={() => handleScroll('home')} className='text-white/80 hover:text-white transition-colors text-lg cursor-pointer'>home</a>
                    {contents.map((content) => (
                        content.link && (
                            <a 
                                key={content.id}
                                onClick={() => content?.title?.toLowerCase() === 'scorpionlabz' ? window.open(content.link, '_blank') : handleScroll(content.link)}
                                className='text-white/80 hover:text-white transition-colors text-lg cursor-pointer'
                            >
                                {content.title}
                            </a>
                        )
                    ))}
                </div>
                <div className='w-full flex flex-row justify-between items-end'>
                    <div className='flex flex-row justify-start gap-4 '>
                        <a href="https://github.com/nikhilyates" target="_blank" rel="noopener noreferrer">
                            <Image priority src={githubWhite} alt='github logo' className='h-6 w-6 cursor-pointer opacity-60 hover:opacity-100 transition-opacity'/>
                        </a>
                        <a href="https://www.linkedin.com/in/nikhilyates/" target="_blank" rel="noopener noreferrer">
                            <Image priority src={linkedinWhite} alt='linkedin logo' className='h-6 w-6 cursor-pointer opacity-60 hover:opacity-100 transition-opacity'/>
                        </a>
                    </div>
                    <p className='text-zinc-600 transition-colors text-lg'>© nikhil yates 2026</p>
                </div>
            </div>
        </div>
    )

}

export default Footer