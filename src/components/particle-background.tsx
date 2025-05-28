'use client'

import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function ParticleCloud() {
  const ref = useRef<THREE.Points>(null!)
  const particlesCount = 8000
  
  const [positions, colors, sizes] = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3)
    const colors = new Float32Array(particlesCount * 3)
    const sizes = new Float32Array(particlesCount)
    
    const color = new THREE.Color()
    
    for (let i = 0; i < particlesCount; i++) {
      // Random distribution in space
      positions[i * 3] = (Math.random() - 0.5) * 50
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50
      
      // Color variations - blue to purple gradient
      const hue = 0.55 + Math.random() * 0.15 // Blue to purple range
      color.setHSL(hue, 0.7, 0.6)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
      
      sizes[i] = Math.random() * 0.8 + 0.2
    }
    
    return [positions, colors, sizes]
  }, [])
  
  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.getElapsedTime()
      
      // Gentle rotation
      ref.current.rotation.x = time * 0.02
      ref.current.rotation.y = time * 0.03
      
      // Subtle breathing effect
      const scale = 1 + Math.sin(time * 0.5) * 0.02
      ref.current.scale.setScalar(scale)
    }
  })
  
  return (
    <Points ref={ref} positions={positions} colors={colors} sizes={sizes} stride={3}>
      <PointMaterial
        vertexColors
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

function FloatingDust() {
  const ref = useRef<THREE.Points>(null!)
  const particlesCount = 2000
  
  const positions = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3)
    
    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40
    }
    
    return positions
  }, [])
  
  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.getElapsedTime()
      const geometry = ref.current.geometry
      const position = geometry.attributes.position as THREE.BufferAttribute
      
      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3
        
        // Gentle floating motion
        position.array[i3 + 1] += Math.sin(time * 0.3 + i) * 0.002
        
        // Reset particles that drift too far
        if (position.array[i3 + 1] > 20) position.array[i3 + 1] = -20
        if (position.array[i3 + 1] < -20) position.array[i3 + 1] = 20
      }
      
      position.needsUpdate = true
    }
  })
  
  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        color="#60a5fa"
        size={0.01}
        sizeAttenuation={true}
        depthWrite={false}
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#030712']} />
      <fog attach="fog" args={['#030712', 25, 60]} />
      
      {/* Subtle lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[20, 20, 20]} intensity={0.2} color="#60a5fa" />
      <pointLight position={[-20, -20, -20]} intensity={0.2} color="#a855f7" />
      
      {/* Particle systems */}
      <ParticleCloud />
      <FloatingDust />
    </>
  )
}

export function ParticleBackground() {
  return (
    <div className="particle-background-container fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 30], fov: 50 }}
        gl={{ 
          antialias: false,
          alpha: false,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}