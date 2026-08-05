export type HerDay = {
  /** ISO date YYYY-MM-DD */
  date: string
  title: string
  description: string
  /** Drop images at public/assets/images/her/<filename> */
  image: string
}

/**
 * Emphasized window: Aug 24 – Sep 6, 2026.
 * Replace titles/descriptions and drop matching image files in
 * public/assets/images/her/
 */
export const herDays: HerDay[] = [
  {
    date: '2026-08-24',
    title: 'Take off',
    description: '7:45 PM and we are in the air',
    image: '/assets/images/her/2026-08-24.jpg',
  },
  {
    date: '2026-08-25',
    title: 'Land in Barcelona',
    description: "Check in @ 3pm. We'll have time to stop on our drive from the airport to the hotel.",
    image: '/assets/images/her/2026-08-25.jpg',
  },
  {
    date: '2026-08-26',
    title: 'Day three',
    description: 'Add the details for August 26 here.',
    image: '/assets/images/her/2026-08-26.jpg',
  },
  {
    date: '2026-08-27',
    title: 'Day four',
    description: 'Add the details for August 27 here.',
    image: '/assets/images/her/2026-08-27.jpg',
  },
  {
    date: '2026-08-28',
    title: 'Day five',
    description: 'Add the details for August 28 here.',
    image: '/assets/images/her/2026-08-28.jpg',
  },
  {
    date: '2026-08-29',
    title: 'Day six',
    description: 'Add the details for August 29 here.',
    image: '/assets/images/her/2026-08-29.jpg',
  },
  {
    date: '2026-08-30',
    title: 'Day seven',
    description: 'Add the details for August 30 here.',
    image: '/assets/images/her/2026-08-30.jpg',
  },
  {
    date: '2026-08-31',
    title: 'Day eight',
    description: 'Add the details for August 31 here.',
    image: '/assets/images/her/2026-08-31.jpg',
  },
  {
    date: '2026-09-01',
    title: 'Day nine',
    description: 'Add the details for September 1 here.',
    image: '/assets/images/her/2026-09-01.jpg',
  },
  {
    date: '2026-09-02',
    title: 'Day ten',
    description: 'Add the details for September 2 here.',
    image: '/assets/images/her/2026-09-02.jpg',
  },
  {
    date: '2026-09-03',
    title: 'Day eleven',
    description: 'Add the details for September 3 here.',
    image: '/assets/images/her/2026-09-03.jpg',
  },
  {
    date: '2026-09-04',
    title: 'Day twelve',
    description: 'Add the details for September 4 here.',
    image: '/assets/images/her/2026-09-04.jpg',
  },
  {
    date: '2026-09-05',
    title: 'Day thirteen',
    description: 'Add the details for September 5 here.',
    image: '/assets/images/her/2026-09-05.jpg',
  },
  {
    date: '2026-09-06',
    title: 'Day fourteen',
    description: 'Add the details for September 6 here.',
    image: '/assets/images/her/2026-09-06.jpg',
  },
]

export const herDaysByDate = Object.fromEntries(
  herDays.map((day) => [day.date, day])
) as Record<string, HerDay>
