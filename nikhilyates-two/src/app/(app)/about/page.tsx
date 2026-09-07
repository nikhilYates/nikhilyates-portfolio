"use client"

import { ChatPanel } from '@/components/chat/ChatPanel'

const About = () => {
    const handleScroll = (link: string) => {
        const element = document.getElementById(link);
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section
            id='about'
            className='grid min-h-screen w-full grid-cols-1 bg-zinc-950 lg:grid-cols-2'
        >
            <div className='flex min-h-screen flex-col justify-between gap-12 px-4 py-8 lg:px-8 xl:p-16'>
                <h1 className='lead scroll-m-20 text-4xl font-extrabold leading-[3rem] tracking-tight text-zinc-500 md:text-5xl md:leading-[3.5rem] xl:text-6xl'>
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
                <h1 className='lead scroll-m-20 text-4xl font-extrabold leading-[3rem] tracking-tight text-zinc-500 md:text-5xl md:leading-[3.5rem] xl:text-6xl'>
                    <span className='text-white'>TLDR:</span> i like{' '}
                    <span className='text-white'>stuff(building + designing + learning)</span>
                </h1>
                <h1 className='lead scroll-m-20 text-4xl font-extrabold leading-[3rem] tracking-tight text-zinc-500 md:text-5xl md:leading-[3.5rem] xl:text-6xl'>
                    want to collaborate? let&apos;s{' '}
                    <span
                        onClick={() => handleScroll('contact')}
                        className='cursor-pointer text-white underline'
                    >
                        connect
                    </span>.
                </h1>
            </div>

            <div
                id='chat'
                className='flex h-[100dvh] min-h-0 flex-col border-t border-zinc-800 px-4 py-8 lg:sticky lg:top-0 lg:border-l lg:border-t-0 lg:px-8 xl:p-16'
            >
                <ChatPanel className='h-full min-h-0 flex-1' />
            </div>
        </section>
    )
}

export default About;