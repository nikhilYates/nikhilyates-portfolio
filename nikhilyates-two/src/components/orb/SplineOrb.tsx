'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import type { Application, SPEObject } from '@splinetool/runtime'
import { cn } from '@/lib/utils'
import { useOrbMotion, useAvatarState, type OrbPose } from './useOrbMotion'

/**
 * Renders a Spline blob and drives it from the shared orb motion state.
 *
 * Spline owns the *look*; this owns the *behaviour*. The scene's own animations
 * keep playing underneath — everything here is applied as a delta on top of the
 * transform the scene was authored with, so nothing the artist set up is lost.
 */

/** Radians of extra yaw/pitch at full cursor deflection. */
const MOUSE_YAW = 0.34
const MOUSE_PITCH = 0.24
/** Scene units of bodily drift toward the cursor. */
const MOUSE_DRIFT = 0.06
/** Scale added per unit of pulse spring (which peaks near 17 on an answer). */
const PULSE_TO_SCALE = 0.008

/** Objects that are never the blob. */
const NON_GEOMETRY = /camera|light|directional|ambient|point|spot|hemisphere/i

/**
 * Centres the scene camera on the target and sizes the frustum to fit it.
 *
 * Spline exports the camera wherever the author left it, which is frequently not
 * pointing at anything — an exported scene can easily render an empty canvas
 * even though the geometry is present, visible and correctly lit. Reframing here
 * makes the component work with whatever comes out of Spline.
 *
 * This reaches into the runtime's internals (`_scene`, `_camera`) because the
 * public API exposes no camera control beyond `setZoom`. Guarded throughout and
 * a no-op on failure, but it is the piece most likely to need attention after a
 * runtime upgrade. Fixing the camera in Spline and passing `autoFrame={false}`
 * avoids the dependency entirely.
 */
function autoFrameCamera(app: Application, targetName: string, padding: number) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const internals = app as unknown as { _scene?: any; _camera?: any }
  const scene = internals._scene
  const cam = internals._camera
  if (!scene?.traverse || !cam) return null

  let mesh: any = null
  scene.traverse((o: any) => {
    if (o?.isMesh && o.name === targetName && !mesh) mesh = o
  })
  if (!mesh?.geometry) return null

  scene.updateMatrixWorld?.(true)
  mesh.geometry.computeBoundingSphere?.()
  const bs = mesh.geometry.boundingSphere
  if (!bs) return null

  const s = Math.max(
    Math.abs(mesh.scale?.x ?? 1),
    Math.abs(mesh.scale?.y ?? 1),
    Math.abs(mesh.scale?.z ?? 1),
  )
  const radius = bs.radius * s
  const world = mesh.getWorldPosition(mesh.position.clone())

  cam.position.x = world.x
  cam.position.y = world.y

  if (cam.isOrthographicCamera) {
    // Ortho bounds are world units, so the object's radius sets them directly.
    // Widen by the canvas aspect so a non-square container doesn't squash it.
    const half = radius * padding
    const c = app.canvas
    const aspect = c && c.height > 0 ? c.width / c.height : 1
    cam.left = -half * Math.max(aspect, 1)
    cam.right = half * Math.max(aspect, 1)
    cam.top = half / Math.min(aspect, 1)
    cam.bottom = -half / Math.min(aspect, 1)
  } else if (cam.isPerspectiveCamera) {
    // Pull back far enough that the bounding sphere fits the vertical FOV.
    const dist = (radius * padding) / Math.tan(((cam.fov ?? 45) * Math.PI) / 360)
    cam.position.z = world.z + dist
  }

  cam.updateProjectionMatrix?.()
  cam.updateMatrixWorld?.(true)
  return { radius, orthographic: !!cam.isOrthographicCamera }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

/**
 * Spline stamps a "Built with Spline" watermark into the postprocessing stack
 * after load (`pipeline.setWatermark(texture)`). Passing `null` disables the
 * logo overlay pass. Same internals reach as `autoFrameCamera` — guarded, and
 * a no-op if the runtime shape changes.
 */
function hideSplineWatermark(app: Application) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  try {
    const pipeline = (app as unknown as { _renderer?: { pipeline?: any } })
      ._renderer?.pipeline
    pipeline?.setWatermark?.(null)
  } catch {
    // Watermark stays if the runtime no longer exposes this path.
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

/**
 * Catches the easy mistake of pasting a Spline *editor* URL.
 *
 * It is a natural thing to do — it is the URL the browser shows while designing,
 * and the Share menu hands it to you — but its id is a different namespace from
 * the runtime's, so loading it just yields an opaque "Failed to fetch". Naming
 * the problem here saves a real debugging session.
 */
function editorUrlProblem(scene: string): string | null {
  if (/app\.spline\.design|\/community\/file\//i.test(scene)) {
    return 'That is the Spline editor link, which cannot be loaded at runtime. In Spline, Export the scene for code and use the resulting .splinecode file or its prod.spline.design URL.'
  }
  if (!/\.splinecode(\?|$)/i.test(scene)) {
    return 'Scene URL should point at a .splinecode file (exported from Spline), either self-hosted under /public or on prod.spline.design.'
  }
  return null
}

type Props = {
  /**
   * Where to load the scene from. Either a published Spline URL
   * (`https://prod.spline.design/<id>/scene.splinecode`) or — preferred — a path
   * to a `.splinecode` file served from `public/`, e.g.
   * `/assets/spline/blob.splinecode`. Self-hosting removes the third-party
   * runtime dependency and the scene gets your own cache headers.
   *
   * The Spline *editor* link (`app.spline.design/...`) is not loadable; its id is
   * a different namespace and returns 403 from the runtime host.
   */
  scene?: string
  /**
   * Object to drive, as named in Spline's layer list. Omit and the first
   * non-camera, non-light object is used, which is right for a single-blob scene.
   */
  objectName?: string
  /**
   * Recentre and resize the scene camera to fit the driven object. On by default
   * because a Spline export commonly ships a camera that frames nothing. Turn it
   * off once the camera is set up correctly in Spline.
   */
  autoFrame?: boolean
  /** Fraction of extra room around the object when auto-framing. Higher = smaller in frame. */
  framePadding?: number
  /** Multiplier on the object's authored scale (1 = unchanged). */
  objectScale?: number
  /** Hide the "Built with Spline" watermark overlay. On by default. */
  hideWatermark?: boolean
  className?: string
}

type Status =
  | { kind: 'loading' }
  | { kind: 'ready'; driving: string }
  | { kind: 'no-object'; available: string[] }
  | { kind: 'error'; message: string }

export function SplineOrb({
  scene = process.env.NEXT_PUBLIC_SPLINE_SCENE_URL,
  objectName,
  autoFrame = true,
  framePadding = 1.15,
  objectScale = 1,
  hideWatermark = true,
  className,
}: Props) {
  const reducedMotion = useReducedMotion() ?? false
  const state = useAvatarState()

  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const appRef = useRef<Application | null>(null)
  const targetRef = useRef<SPEObject | null>(null)
  /** The artist's authored transform. Ours is a delta on top of this. */
  const baseRef = useRef({ rx: 0, ry: 0, rz: 0, px: 0, py: 0, sx: 1, sy: 1, sz: 1 })
  /** Scene variables that actually exist, so we never set an unknown one. */
  const varsRef = useRef<Set<string>>(new Set())

  const [visible, setVisible] = useState(false)
  const [status, setStatus] = useState<Status>({ kind: 'loading' })

  // Defer the ~546KB runtime until the orb is near the viewport.
  useEffect(() => {
    const host = hostRef.current
    if (!host || !scene) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    // A zero-area element never intersects, so the observer would sit silent
    // forever — real for a collapsed panel, an inactive tab, or display:none.
    const rect = host.getBoundingClientRect()
    if (rect.width === 0 && rect.height === 0) {
      setVisible(true)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setVisible(true)
        io.disconnect()
      },
      { rootMargin: '200px' },
    )
    io.observe(host)
    return () => io.disconnect()
  }, [scene])

  useEffect(() => {
    if (!visible || !scene) return
    const canvas = canvasRef.current
    if (!canvas) return

    // Fail fast with a useful message rather than downloading 546KB of runtime
    // only to hit an unexplained fetch error.
    const problem = editorUrlProblem(scene)
    if (problem) {
      setStatus({ kind: 'error', message: problem })
      return
    }

    let cancelled = false
    let app: Application | null = null
    setStatus({ kind: 'loading' })

    import('@splinetool/runtime')
      .then(async ({ Application: App }) => {
        if (cancelled) return
        // `manual` plus an explicit requestRender per frame: the runtime cannot
        // observe us mutating transforms from outside, so `auto` drops frames,
        // and `continuous` burns GPU when reduced-motion has stopped our loop.
        app = new App(canvas, { renderMode: 'manual' })
        await app.load(scene)
        if (cancelled) {
          app.dispose()
          return
        }
        appRef.current = app

        const all = app.getAllObjects()
        const named = all.map((o) => o.name).filter(Boolean)

        const target = objectName
          ? app.findObjectByName(objectName)
          : all.find((o) => o.name && !NON_GEOMETRY.test(o.name))

        if (!target) {
          setStatus({ kind: 'no-object', available: named.slice(0, 14) })
          app.requestRender()
          return
        }

        targetRef.current = target
        baseRef.current = {
          rx: target.rotation.x,
          ry: target.rotation.y,
          rz: target.rotation.z,
          px: target.position.x,
          py: target.position.y,
          sx: target.scale.x * objectScale,
          sy: target.scale.y * objectScale,
          sz: target.scale.z * objectScale,
        }

        // Optional passthrough: if the scene declares variables by these names,
        // drive them too. Lets scene parameters be wired up in Spline later with
        // no code change, and silently does nothing when they don't exist.
        try {
          varsRef.current = new Set(Object.keys(app.getVariables() ?? {}))
        } catch {
          varsRef.current = new Set()
        }

        if (hideWatermark) hideSplineWatermark(app)

        const framed = autoFrame ? autoFrameCamera(app, target.name, framePadding) : null

        setStatus({ kind: 'ready', driving: target.name })
        app.requestRender()

        if (process.env.NODE_ENV === 'development') {
          ;(window as unknown as Record<string, unknown>).__spline = {
            app,
            target,
            objectNames: named,
            variables: [...varsRef.current],
            framed,
          }
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setStatus({
          kind: 'error',
          message: err instanceof Error ? err.message : 'Failed to load scene',
        })
      })

    return () => {
      cancelled = true
      targetRef.current = null
      appRef.current?.dispose()
      appRef.current = null
    }
  }, [visible, scene, objectName, autoFrame, framePadding, objectScale, hideWatermark])

  useOrbMotion(
    (pose: OrbPose) => {
      const target = targetRef.current
      const app = appRef.current
      if (!target || !app) return
      const b = baseRef.current

      // Slow continuous rotation carries the idle churn; the cursor adds lean.
      target.rotation.z = b.rz + pose.swirl
      target.rotation.y = b.ry + pose.mouse[0] * MOUSE_YAW
      target.rotation.x = b.rx - pose.mouse[1] * MOUSE_PITCH

      target.position.x = b.px + pose.mouse[0] * MOUSE_DRIFT
      target.position.y = b.py - pose.mouse[1] * MOUSE_DRIFT

      const s = pose.scale + pose.pulse * PULSE_TO_SCALE
      target.scale.x = b.sx * s
      target.scale.y = b.sy * s
      target.scale.z = b.sz * s

      const vars = varsRef.current
      if (vars.size) {
        if (vars.has('agitation')) app.setVariable('agitation', pose.agitation)
        if (vars.has('glow')) app.setVariable('glow', pose.glow)
        if (vars.has('pulse')) app.setVariable('pulse', pose.pulse)
        if (vars.has('state')) app.setVariable('state', state)
      }

      app.requestRender()
    },
    status.kind === 'ready' && !reducedMotion,
  )

  if (!scene) {
    return (
      <div ref={hostRef} className={cn('w-full', className)}>
        <Notice title="No Spline scene configured">
          In Spline, <strong>Export</strong> the scene for code. Then either drop the
          downloaded <code>.splinecode</code> into{' '}
          <code>public/assets/spline/</code> and point{' '}
          <code>NEXT_PUBLIC_SPLINE_SCENE_URL</code> at it, or use the hosted{' '}
          <code>prod.spline.design/…/scene.splinecode</code> URL. The editor link
          (<code>app.spline.design/…</code>) will not load at runtime.
        </Notice>
      </div>
    )
  }

  return (
    <div
      ref={hostRef}
      data-state={state}
      data-driving={status.kind === 'ready' ? status.driving : undefined}
      className={cn('relative aspect-video w-full', className)}
    >
      <canvas ref={canvasRef} className="w-full max-w-12xl" />

      {status.kind === 'loading' && (
        <div className="absolute inset-0 grid place-items-center">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            loading
          </span>
        </div>
      )}

      {status.kind === 'no-object' && (
        <div className="absolute inset-x-0 bottom-0 bg-destructive/90 p-2 text-[11px] leading-snug text-destructive-foreground">
          {objectName ? (
            <>No object named <code>{objectName}</code>.</>
          ) : (
            <>No drivable object found.</>
          )}{' '}
          Scene contains: {status.available.join(', ') || '(nothing)'}
        </div>
      )}

      {status.kind === 'error' && (
        <div className="absolute inset-0 grid place-items-center p-3">
          <p className="text-center text-[11px] text-destructive">{status.message}</p>
        </div>
      )}
    </div>
  )
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="grid aspect-square w-full place-items-center rounded-2xl border border-dashed border-border bg-muted/40 p-4">
      <div className="space-y-1.5 text-center text-[11px] leading-relaxed text-muted-foreground">
        <p className="text-xs font-medium text-foreground">{title}</p>
        <p>{children}</p>
      </div>
    </div>
  )
}
