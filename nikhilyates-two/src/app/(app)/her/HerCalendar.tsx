'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { HerDay } from './days'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

type MonthSpec = {
  year: number
  month: number // 0-indexed
  label: string
}

const MONTHS: MonthSpec[] = [
  { year: 2026, month: 7, label: 'August 2026' },
  { year: 2026, month: 8, label: 'September 2026' },
]

function toIso(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function buildMonthCells(year: number, month: number) {
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: Array<number | null> = Array(firstWeekday).fill(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

function DayCell({
  day,
  entry,
  onSelect,
}: {
  day: number | null
  entry: HerDay | undefined
  onSelect: (day: HerDay) => void
}) {
  const [imgFailed, setImgFailed] = useState(false)

  if (day === null) {
    return <div className="aspect-square" />
  }

  if (entry) {
    return (
      <button
        type="button"
        onClick={() => onSelect(entry)}
        className="group relative aspect-square overflow-hidden rounded-sm ring-1 ring-[#c48c7a]/40 transition duration-300 hover:ring-2 hover:ring-[#c48c7a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c48c7a]"
      >
        {!imgFailed ? (
          <Image
            src={entry.image}
            alt={entry.title}
            fill
            sizes="(max-width: 768px) 14vw, 80px"
            className="object-cover transition duration-500 group-hover:scale-105"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#d4a99a] to-[#8a6f64]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <span className="absolute bottom-1 left-1.5 font-[family-name:var(--font-her-serif)] text-sm text-white drop-shadow md:text-base">
          {day}
        </span>
      </button>
    )
  }

  return (
    <div className="flex aspect-square items-start justify-start rounded-sm p-1.5 text-[#9a8a82]">
      <span className="text-xs md:text-sm">{day}</span>
    </div>
  )
}

export default function HerCalendar({ days }: { days: HerDay[] }) {
  const router = useRouter()
  const [selected, setSelected] = useState<HerDay | null>(null)
  const [dialogImgFailed, setDialogImgFailed] = useState(false)

  const byDate = useMemo(
    () => Object.fromEntries(days.map((d) => [d.date, d])) as Record<string, HerDay>,
    [days]
  )

  const logout = async () => {
    await fetch('/api/her/auth', { method: 'DELETE' })
    router.refresh()
  }

  return (
    <div className="her-page relative min-h-screen px-4 py-10 md:px-10 md:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 70% 45% at 10% 0%, rgba(196, 140, 122, 0.22), transparent), radial-gradient(ellipse 50% 40% at 100% 100%, rgba(90, 110, 100, 0.14), transparent)',
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col gap-10">
        <header className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <p className="font-[family-name:var(--font-her-serif)] text-sm tracking-[0.2em] uppercase text-[#8a6f64]">
              our calendar
            </p>
            <h1 className="font-[family-name:var(--font-her-serif)] text-4xl font-light tracking-tight text-[#2c2420] md:text-5xl">
              August → September
            </h1>
            <p className="max-w-md text-sm text-[#6e5c54] md:text-base">
              Aug 24 – Sep 6 is marked. Tap a day for what&apos;s planned.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={logout}
            className="shrink-0 text-[#8a6f64] hover:bg-transparent hover:text-[#2c2420]"
          >
            lock
          </Button>
        </header>

        <div className="flex flex-col gap-12">
          {MONTHS.map((month) => {
            const cells = buildMonthCells(month.year, month.month)
            return (
              <section key={month.label} className="flex flex-col gap-4">
                <h2 className="font-[family-name:var(--font-her-serif)] text-2xl font-light text-[#2c2420]">
                  {month.label}
                </h2>
                <div className="grid grid-cols-7 gap-1.5 md:gap-2">
                  {WEEKDAYS.map((label) => (
                    <div
                      key={`${month.label}-${label}`}
                      className="pb-1 text-center text-[10px] uppercase tracking-wider text-[#a89086] md:text-xs"
                    >
                      {label}
                    </div>
                  ))}
                  {cells.map((day, index) => {
                    const iso =
                      day === null
                        ? null
                        : toIso(month.year, month.month, day)
                    return (
                      <DayCell
                        key={`${month.label}-${index}`}
                        day={day}
                        entry={iso ? byDate[iso] : undefined}
                        onSelect={(entry) => {
                          setDialogImgFailed(false)
                          setSelected(entry)
                        }}
                      />
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      </div>

      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
      >
        <DialogContent className="max-w-md overflow-hidden border-[#e2d5cd] bg-[#f7f1ec] p-0 text-[#2c2420] sm:rounded-lg">
          {selected && (
            <>
              <div className="relative h-48 w-full sm:h-56">
                {!dialogImgFailed ? (
                  <Image
                    src={selected.image}
                    alt={selected.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 512px) 100vw, 448px"
                    onError={() => setDialogImgFailed(true)}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#d4a99a] to-[#8a6f64]" />
                )}
              </div>
              <div className="flex flex-col gap-3 p-6">
                <DialogHeader className="space-y-2 text-left">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#8a6f64]">
                    {new Date(selected.date + 'T12:00:00').toLocaleDateString(
                      'en-US',
                      {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </p>
                  <DialogTitle className="font-[family-name:var(--font-her-serif)] text-2xl font-light tracking-tight">
                    {selected.title}
                  </DialogTitle>
                  <DialogDescription className="text-base leading-relaxed text-[#5c4d46]">
                    {selected.description}
                  </DialogDescription>
                </DialogHeader>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
