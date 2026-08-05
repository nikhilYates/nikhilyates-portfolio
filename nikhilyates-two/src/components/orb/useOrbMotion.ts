'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'
import { avatarBus, type AvatarState } from '@/lib/avatar-bus'
import { PROFILES, TAU, damp, dampProfile, stepPulse, type OrbProfile } from './orbMotion'

export type OrbPose = {
  /** Internal fluid clock. Advances at a damped, state-dependent rate. */
  time: number
  agitation: number
  spread: number
  /** Accumulated rotation in radians. */
  swirl: number
  glow: number
  scale: number
  /** Transient surface-tension ripple from token pulses. */
  pulse: number
  /** Smoothed pointer position, -1..1 on each axis. */
  mouse: [number, number]
}

/**
 * One rAF loop driving the orb. Writes into a single mutable pose object handed
 * to `onFrame` — no allocation per frame and no React re-render per frame.
 *
 * `onFrame` is held in a ref so an inline arrow won't restart the loop.
 */
export function useOrbMotion(
  onFrame: (pose: OrbPose, dt: number) => void,
  enabled = true,
) {
  const cb = useRef(onFrame)
  cb.current = onFrame

  /** Raw pointer target, written by the listener, chased by the loop. */
  const mouseTarget = useRef<[number, number]>([0, 0])

  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      // Window-relative rather than element-relative: the orb is small, and
      // reacting to the cursor anywhere on the page feels far more alive.
      mouseTarget.current[0] = (e.clientX / window.innerWidth) * 2 - 1
      mouseTarget.current[1] = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onPointer, { passive: true })
    return () => window.removeEventListener('pointermove', onPointer)
  }, [])

  useEffect(() => {
    const pose: OrbPose = {
      time: 0,
      agitation: PROFILES.idle.agitation,
      spread: PROFILES.idle.spread,
      swirl: 0,
      glow: PROFILES.idle.glow,
      scale: 1,
      pulse: 0,
      mouse: [0, 0],
    }

    if (!enabled) {
      cb.current(pose, 0)
      return
    }

    const p: OrbProfile = { ...PROFILES[avatarBus.getState()] }
    let pulse = 0
    let pulseVel = 0

    let state: AvatarState = avatarBus.getState()
    const unsubscribe = avatarBus.subscribe(() => {
      state = avatarBus.getState()
    })

    let raf = 0
    let last = performance.now()

    const frame = (now: number) => {
      // Clamp dt so a backgrounded tab doesn't detonate the spring on return.
      const dt = Math.min((now - last) / 1000, 1 / 20)
      last = now

      dampProfile(p, PROFILES[state], dt)

      // Integrate rather than multiplying elapsed time by the rate — otherwise
      // every change in churn or swirl would teleport the animation.
      pose.time += dt * p.churn
      pose.swirl += dt * p.swirlRate * TAU

      const impulse = avatarBus.drainPulse()
      if (impulse !== 0) pulseVel += impulse
      const stepped = stepPulse(pulse, pulseVel, dt)
      pulse = stepped.value
      pulseVel = stepped.velocity

      pose.agitation = p.agitation
      pose.spread = p.spread
      pose.glow = p.glow
      pose.scale = p.scale
      pose.pulse = pulse

      // Pointer easing is deliberately slow — the fill should feel viscous,
      // lagging behind the cursor rather than snapping to it.
      pose.mouse[0] = damp(pose.mouse[0], mouseTarget.current[0], 0.28, dt)
      pose.mouse[1] = damp(pose.mouse[1], mouseTarget.current[1], 0.28, dt)

      cb.current(pose, dt)
      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)

    const onVisible = () => { last = performance.now() }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      cancelAnimationFrame(raf)
      unsubscribe()
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [enabled])
}

/** Subscribe to orb state for anything that genuinely needs to re-render. */
export function useAvatarState(): AvatarState {
  return useSyncExternalStore(
    avatarBus.subscribe,
    avatarBus.getState,
    () => 'idle' as const,
  )
}
