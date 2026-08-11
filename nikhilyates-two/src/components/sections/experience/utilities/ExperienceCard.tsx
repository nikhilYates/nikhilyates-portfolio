import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExperienceGraph } from './Chart'
import { ExperienceType } from '@/lib/definitions'

interface ExperienceCardProps {
  experience: ExperienceType
}

const ExperienceCard = ({ experience }: ExperienceCardProps) => {
  if (!experience) return null

  return (
    <Card className="flex aspect-[4/3] h-full w-full flex-col overflow-hidden rounded-2xl border-zinc-600 bg-inherit text-white transition-colors duration-500 ease-in-out hover:border-zinc-300">
      <CardHeader className="flex shrink-0 flex-col gap-2 p-4 md:flex-row md:items-start md:justify-between md:gap-2 md:p-5">
        <div className="min-w-0">
          <CardTitle className="truncate text-lg font-bold md:text-xl">
            {experience.title ?? 'Job Title'}
          </CardTitle>
          <CardDescription className="mt-0.5 truncate text-lg font-light md:text-xl">
            {experience.company ?? 'Company Name'}
          </CardDescription>
        </div>
        <Badge variant="secondary" className="shrink-0 self-start text-black">
          {experience.startDate} - {experience.endDate}
        </Badge>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-3 p-4 pt-0 md:p-5 md:pt-0">
        <div className="min-h-0 flex-1">
          <ExperienceGraph chartData={experience.chartData!} chartColor={experience.id} />
        </div>
        <div className="max-h-[28%] shrink-0 overflow-hidden">
          <div className="flex flex-wrap">
            {experience.skills.map((skill, index) => (
              <Badge key={index} className="mb-1 mr-1" variant="destructive">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ExperienceCard
