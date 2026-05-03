'use client'

import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import * as THREE from 'three'

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

export default function CinemaThreeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    // Read CSS vars
    const accentRaw = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent')
      .trim()
    const [ar, ag, ab] = accentRaw.split(' ').map((v) => parseInt(v, 10) / 255)
    const accentColor = new THREE.Color(ar, ag, ab)

    const warmRaw = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent-warm')
      .trim()
    const warmColor = warmRaw
      ? new THREE.Color(
          ...warmRaw.split(' ').map((v) => parseInt(v, 10) / 255) as [number, number, number]
        )
      : new THREE.Color(0.9, 0.6, 0.2)

    // Renderer
    const dpr = Math.min(window.devicePixelRatio, 2)
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(dpr)
    renderer.setClearColor(0x000000, 0)

    const w = canvas.clientWidth
    const h = canvas.clientHeight
    renderer.setSize(w, h, false)

    // Scene / Camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(48, w / h, 0.1, 100)
    camera.position.set(0, 0, 5)

    // Film reel — outer torus (cyan)
    const outerGeom = new THREE.TorusGeometry(1.2, 0.12, 16, 80)
    const outerMat = new THREE.MeshBasicMaterial({
      color: accentColor,
      wireframe: false,
      transparent: true,
      opacity: 0.72,
    })
    const outerRing = new THREE.Mesh(outerGeom, outerMat)

    // Inner hub torus (warm amber)
    const innerGeom = new THREE.TorusGeometry(0.45, 0.08, 16, 60)
    const innerMat = new THREE.MeshBasicMaterial({
      color: warmColor,
      transparent: true,
      opacity: 0.6,
    })
    const innerRing = new THREE.Mesh(innerGeom, innerMat)

    // Sprocket holes — small cylinders placed around the outer ring
    const reelGroup = new THREE.Group()
    reelGroup.add(outerRing)
    reelGroup.add(innerRing)

    const sprocketCount = 16
    const sprocketGeom = new THREE.CylinderGeometry(0.055, 0.055, 0.25, 10)
    const sprocketMat = new THREE.MeshBasicMaterial({
      color: accentColor,
      transparent: true,
      opacity: 0.9,
    })
    for (let i = 0; i < sprocketCount; i++) {
      const angle = (i / sprocketCount) * Math.PI * 2
      const hole = new THREE.Mesh(sprocketGeom, sprocketMat)
      hole.position.set(Math.cos(angle) * 1.2, Math.sin(angle) * 1.2, 0)
      hole.rotation.x = Math.PI / 2
      reelGroup.add(hole)
    }

    // Spokes connecting inner hub to outer ring
    const spokeCount = 6
    for (let i = 0; i < spokeCount; i++) {
      const angle = (i / spokeCount) * Math.PI * 2
      const spokeGeom = new THREE.CylinderGeometry(0.018, 0.018, 0.75, 6)
      const spokeMat = new THREE.MeshBasicMaterial({
        color: accentColor,
        transparent: true,
        opacity: 0.35,
      })
      const spoke = new THREE.Mesh(spokeGeom, spokeMat)
      spoke.position.set(Math.cos(angle) * 0.83, Math.sin(angle) * 0.83, 0)
      spoke.rotation.z = angle + Math.PI / 2
      reelGroup.add(spoke)
    }

    // Tilt the reel slightly for depth
    reelGroup.rotation.x = 0.28
    reelGroup.rotation.y = -0.18
    scene.add(reelGroup)

    // Projector beam — translucent cone pointing left-to-right
    const coneGeom = new THREE.ConeGeometry(0.6, 2.8, 32, 1, true)
    const coneMat = new THREE.MeshBasicMaterial({
      color: warmColor,
      transparent: true,
      opacity: 0.045,
      side: THREE.DoubleSide,
    })
    const cone = new THREE.Mesh(coneGeom, coneMat)
    cone.rotation.z = -Math.PI / 2
    cone.position.set(1.6, 0.3, -0.8)
    scene.add(cone)

    // Dust motes
    const particleCount = 120
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount)
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 7
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3
      velocities[i] = 0.0015 + Math.random() * 0.0025
    }
    const pGeom = new THREE.BufferGeometry()
    pGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const pMat = new THREE.PointsMaterial({
      color: warmColor,
      size: 0.028,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
    })
    const particles = new THREE.Points(pGeom, pMat)
    scene.add(particles)

    // Static frame for reduced motion
    if (prefersReducedMotion) {
      renderer.render(scene, camera)
      return
    }

    let rafId: number

    const animate = () => {
      if (document.hidden) {
        rafId = requestAnimationFrame(animate)
        return
      }

      // Slowly rotate the reel
      reelGroup.rotation.z += 0.004
      reelGroup.rotation.y += 0.0015

      // Drift dust upward, wrap
      const pos = pGeom.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < particleCount; i++) {
        pos.array[i * 3 + 1] += velocities[i]
        if (pos.array[i * 3 + 1] > 2.5) {
          pos.array[i * 3 + 1] = -2.5
        }
      }
      pos.needsUpdate = true

      renderer.render(scene, camera)
      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)

    const onResize = () => {
      const nw = canvas.clientWidth
      const nh = canvas.clientHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh, false)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      outerGeom.dispose()
      outerMat.dispose()
      innerGeom.dispose()
      innerMat.dispose()
      sprocketGeom.dispose()
      sprocketMat.dispose()
      coneGeom.dispose()
      coneMat.dispose()
      pGeom.dispose()
      pMat.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <motion.canvas
      ref={canvasRef}
      className="h-full w-full"
      style={{ display: 'block' }}
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={
        shouldReduceMotion
          ? undefined
          : { duration: 0.8, ease: EASE_OUT_EXPO }
      }
    />
  )
}
