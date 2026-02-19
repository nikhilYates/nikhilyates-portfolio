import React from 'react'
import { ExperienceType } from '@/lib/definitions'
import ExperienceCardLarge from './utilities/ExperienceCardLarge'
import ExperienceCardSmall from './utilities/ExperienceCardSmall'
import ExperienceCard from './utilities/ExperienceCard'
import data from '../../../../data/experience.json'



const Experience = () => {
  return (
    <div id='experience' className='bg-zinc-950 h-auto w-screen px-4 py-8 lg:p-16 flex flex-col gap-8'>
      <div className='w-full flex flex-col gap-3'>
        <h1 className='scroll-m-20 text-6xl font-extralight tracking-tight 2xl:text-8xl text-white/20'>experience</h1>
      </div>
      <ExperienceCardLarge experience={data[0]} />
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Top Left */}
        
        {/* Top Right */}
        <ExperienceCard experience={data[1]} />
        
        {/* Bottom Left */}
        <ExperienceCard experience={data[2]} />
        
        {/* Bottom Right - Two small cards */}
        {/* <div className='flex flex-col 2xl:flex-row gap-8 border border-red-500'> */}
        <ExperienceCard experience={data[3]} />
        <ExperienceCard experience={data[4]} />
        <ExperienceCardSmall experience={data[5]} />
        {/* </div> */}
      </div>
    </div>
  )
}

export default Experience