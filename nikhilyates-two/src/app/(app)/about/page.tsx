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
                <span className='text-white'>nikhil yates</span> is a <span className='text-white'>
                versatile full-stack engineer and entrepreneur</span> based in <span className='text-white'>Toronto</span>. 
                With a <span className='text-white'>solid foundation in computer science</span> and passion for 
                <span className='text-white'> building innovative solutions</span>, his interests span 
                <span className='text-white'> Web3, generative AI, data interactivity, robotics, and user experience design</span>.
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