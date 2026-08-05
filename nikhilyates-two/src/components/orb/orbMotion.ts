import type { AvatarState } from '@/lib/avatar-bus'

/**
 * Motion profiles for the liquid orb.
 *
 * Same approach that drives any good procedural animation: a state is a set of
 * *parameters*, and the parameters themselves are exponentially damped. Nothing
 * is keyframed, so a state change mid-motion eases in rather than popping — and
 * the fluid never appears to restart.
 */

export const TAU = Math.PI * 2

/** Frame-rate independent exponential smoothing. `tau` is a time constant in seconds. */
export function damp(current: number, target: number, tau: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-dt / tau))
}

export type OrbProfile = {
  /** Multiplier on internal time — how fast the fluid churns. */
  churn: number
  /** Amplitude of the noise displacing the surface. Higher reads as agitated. */
  agitation: number
  /** How far the metaballs orbit from centre. Low = tight and dense. */
  spread: number
  /** Rotation rate in turns/sec. Integrated into an angle, never applied raw. */
  swirlRate: number
  /** Rim/fresnel brightness. Lifts when the orb is "attending" to something. */
  glow: number
  /** Overall radius multiplier. */
  scale: number
}

export const PROFILES: Record<AvatarState, OrbProfile> = {
  // Resting. Slow, heavy, barely-moving fluid.
  idle: {
    churn: 0.34,
    agitation: 0.55,
    spread: 0.42,
    swirlRate: 0.02,
    glow: 0.75,
    scale: 1,
  },

  // User is typing: draws inward and quickens — coiled, paying attention.
  listening: {
    churn: 1.15,
    agitation: 1.35,
    spread: 0.28,
    swirlRate: 0.16,
    glow: 1.15,
    scale: 1.04,
  },

  // Waiting on retrieval: opens out and rotates hard. Reads as "working".
  // spread is capped at 0.52 — beyond that the metaballs separate far enough
  // that a hole opens in the middle and the orb stops reading as one body.
  thinking: {
    churn: 0.8,
    agitation: 0.7,
    spread: 0.52,
    swirlRate: 0.62,
    glow: 0.95,
    scale: 0.97,
  },

  // Streaming an answer: the per-token pulse spring carries the rhythm, so the
  // ambient churn stays moderate to avoid competing with it.
  speaking: {
    churn: 0.95,
    agitation: 1.0,
    spread: 0.4,
    swirlRate: 0.1,
    glow: 1.3,
    scale: 1.02,
  },
}

/** How fast each parameter chases its target. Amplitudes react faster than tempo. */
const TAUS: Record<keyof OrbProfile, number> = {
  churn: 0.85,
  agitation: 0.4,
  spread: 0.5,
  swirlRate: 0.7,
  glow: 0.45,
  scale: 0.5,
}

const KEYS = Object.keys(TAUS) as (keyof OrbProfile)[]

export function dampProfile(current: OrbProfile, target: OrbProfile, dt: number) {
  for (const k of KEYS) {
    current[k] = damp(current[k], target[k], TAUS[k], dt)
  }
}

/**
 * Surface-tension spring. A pulse injects velocity; stiffness pulls it back
 * with a little overshoot, so a token arriving reads as a ripple through the
 * fluid rather than a step change in size.
 */
const PULSE_STIFFNESS = 150
const PULSE_DAMPING = 11

export function stepPulse(value: number, velocity: number, dt: number) {
  const accel = -PULSE_STIFFNESS * value - PULSE_DAMPING * velocity
  const v = velocity + accel * dt
  return { value: value + v * dt, velocity: v }
}
