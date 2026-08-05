/**
 * Decouples the chat UI from the avatar's animation loop.
 *
 * Two channels on purpose:
 *  - `state` goes through React (changes a few times per conversation)
 *  - `pulse` does not (fires per streamed token chunk, read straight from rAF)
 *
 * Routing pulses through React state would re-render the tree at 60fps for no
 * reason, so the animation loop drains them imperatively instead.
 */

export type AvatarState = 'idle' | 'listening' | 'thinking' | 'speaking'

type Listener = () => void

let state: AvatarState = 'idle'
let pendingPulse = 0
const listeners = new Set<Listener>()

export const avatarBus = {
  getState: () => state,

  setState(next: AvatarState) {
    if (next === state) return
    state = next
    listeners.forEach((l) => l())
  },

  subscribe(listener: Listener) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },

  /**
   * Nudge the head. `amount` is an angular impulse in deg/sec fed into the nod
   * spring — small values (~40) read as a speech bob, large (~260) as a
   * deliberate "I have an answer" nod.
   */
  pulse(amount: number) {
    pendingPulse += amount
  },

  /** Drained once per animation frame. */
  drainPulse() {
    const p = pendingPulse
    pendingPulse = 0
    return p
  },
}
