'use client'

import { ExperienceType } from '@/lib/definitions'
import ExperienceCard from './utilities/ExperienceCard'
import data from '../../../../data/experience.json'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

const experiences = data as ExperienceType[]

const Experience = () => {
  return (
    <div
      id="experience"
      className="flex w-full max-w-[100vw] flex-col gap-8 bg-zinc-950 py-8 lg:py-16"
    >
      <div className="ml-4 lg:ml-16">
        <h1 className="scroll-m-20 text-6xl font-extralight tracking-tight text-white/20 2xl:text-8xl">
          experience
        </h1>
      </div>

      <Carousel
        opts={{
          align: 'start',
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {experiences.map((experience) => (
            <CarouselItem
              key={experience.id}
              className="basis-[25vw] px-2 first:pl-4 last:pr-0 lg:first:pl-16"
            >
              <ExperienceCard
                experience={experience}
                isPast={experience.endDate !== 'Present'}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 border-zinc-600 bg-zinc-950 text-white hover:bg-zinc-800 hover:text-white disabled:opacity-30 md:left-4" />
        <CarouselNext className="right-2 border-zinc-600 bg-zinc-950 text-white hover:bg-zinc-800 hover:text-white disabled:opacity-30" />
      </Carousel>
    </div>
  )
}

export default Experience
