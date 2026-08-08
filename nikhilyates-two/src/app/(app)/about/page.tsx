"use client"

import react from 'react'

const About = () => {

    const handleScroll = (link: string) => {
        const element = document.getElementById(link);
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleContact = () => {
        
    }

    return (
        <div id='about' className='bg-zinc-950 px-4 py-8 h-auto min-h-screen xl:p-16 flex flex-col justify-between'>
            <h1 className='text-4xl leading-[3rem] lead scroll-m-20 md:text-6xl font-extrabold tracking-tight xl:text-7xl text-zinc-500 md:leading-[4rem]'>
                <span className='text-white'>nikhil yates</span> is a versatile{' '}
                <span className='text-white'>product engineer</span> and{' '}
                <span className='text-white'>entrepreneur</span> based in{' '}
                <span className='text-white'>Toronto</span>. a{' '}
                <span className='text-white'>computer science</span> background, years of{' '}
                <span className='text-white'>full-stack engineering</span>, and a passion for{' '}
                <span className='text-white'>building innovative solutions</span> have helped him{' '}
                <span className='text-white'>succeed across multiple verticals</span>. his interests span{' '}
                <span className='text-white'>web3</span>,{' '}
                <span className='text-white'>AI-based data systems</span> and{' '}
                <span className='text-white'>interactivity</span>, and{' '}
                <span className='text-white'>music tech</span>
            </h1>
            <h1 className='text-4xl leading-[3rem] lead scroll-m-20 md:text-6xl font-extrabold tracking-tight xl:text-7xl text-zinc-500 md:leading-[4rem]'>
                <span className='text-white'>TLDR:</span> i like <span className='text-white'>stuff(building + designing + learning)</span>
            </h1>
            <h1 className='text-4xl leading-[3rem] lead scroll-m-20 md:text-6xl font-extrabold tracking-tight xl:text-7xl text-zinc-500 md:leading-[4rem]'>
                want to collaborate? let's <span onClick={() => handleScroll('contact')} className='underline text-white cursor-pointer'>connect</span>.
            </h1>
        </div>
    )
}

export default About;