'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Box, Plane } from '@react-three/drei'
import { useRef, useState, useEffect } from 'react'
import { Mesh, Group } from 'three'

interface MaterialSpec {
  coreBoard: {
    type: string
    weight: string
    color: string
    roughness: number
    metalness: number
  }
  liner: {
    type: string
    weight: string
    color: string
    roughness: number
    metalness: number
  }
  adhesive: {
    type: string
    color: string
  }
  finish: {
    type: string
    color: string
    roughness: number
    metalness: number
  }
}

interface PackagingBoxProps {
  dimensions: {
    width: number
    height: number 
    depth: number
  }
  materialSpec: MaterialSpec
}

function PackagingBox({ dimensions, materialSpec }: PackagingBoxProps) {
  const boxRef = useRef<Mesh>(null)
  const groupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)

  // Convert inches to Three.js units (scaled for visibility)
  const scale = 0.2
  const width = dimensions.width * scale
  const height = dimensions.height * scale
  const depth = dimensions.depth * scale

  return (
    <group ref={groupRef}>
      {/* Core Board (Main Structure) */}
      <Box
        ref={boxRef}
        args={[width, height, depth]}
        position={[0, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={hovered ? materialSpec.finish.color : materialSpec.coreBoard.color}
          roughness={materialSpec.coreBoard.roughness}
          metalness={materialSpec.coreBoard.metalness}
          transparent
          opacity={0.85}
        />
      </Box>

      {/* Liner Layer (Slightly Larger) */}
      <Box
        args={[width + 0.01, height + 0.01, depth + 0.01]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial
          color={materialSpec.liner.color}
          roughness={materialSpec.liner.roughness}
          metalness={materialSpec.liner.metalness}
          transparent
          opacity={0.4}
          wireframe
        />
      </Box>

      {/* Finish Layer (Outermost) */}
      <Box
        args={[width + 0.005, height + 0.005, depth + 0.005]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial
          color={materialSpec.finish.color}
          roughness={materialSpec.finish.roughness}
          metalness={materialSpec.finish.metalness}
          transparent
          opacity={0.2}
        />
      </Box>

      {/* Magnetic Closure Detail */}
      <Box
        args={[0.1, height * 0.6, 0.1]}
        position={[width / 2 + 0.05, 0, 0]}
      >
        <meshStandardMaterial
          color="#1a4a38"
          roughness={0.3}
          metalness={0.8}
        />
      </Box>

      {/* Adhesive Lines (showing construction) */}
      <Box
        args={[width * 0.95, 0.005, depth * 0.95]}
        position={[0, -height / 2 + 0.01, 0]}
      >
        <meshStandardMaterial
          color={materialSpec.adhesive.color}
          transparent
          opacity={0.6}
        />
      </Box>

      {/* Branding/Label Area */}
      <Plane
        args={[width * 0.6, height * 0.4]}
        position={[0, 0, depth / 2 + 0.01]}
      >
        <meshStandardMaterial
          color="white"
          transparent
          opacity={0.95}
          roughness={0.1}
          metalness={0.0}
        />
      </Plane>

      {/* Brand Logo */}
      <Box
        args={[width * 0.4, height * 0.1, 0.01]}
        position={[0, 0.1, depth / 2 + 0.02]}
      >
        <meshStandardMaterial
          color="#279366"
          transparent
          opacity={0.9}
        />
      </Box>

      {/* Material Type Indicator */}
      <Box
        args={[width * 0.3, height * 0.05, 0.01]}
        position={[0, -0.1, depth / 2 + 0.02]}
      >
        <meshStandardMaterial
          color={materialSpec.coreBoard.color}
          transparent
          opacity={0.7}
        />
      </Box>
    </group>
  )
}

interface ThreeJSPackagingProps {
  dimensions?: {
    width: number
    height: number
    depth: number
  }
  materialSpec?: MaterialSpec
  onRotate?: () => void
  onExplode?: () => void
}

export default function ThreeJSPackaging({ 
  dimensions = { width: 12, height: 10, depth: 4 },
  materialSpec,
  onRotate,
  onExplode 
}: ThreeJSPackagingProps) {
  const [exploded, setExploded] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Default material specification for ESKA rigid board
  const defaultMaterialSpec: MaterialSpec = {
    coreBoard: {
      type: "ESKA Core Board",
      weight: "1200gsm",
      color: "#8B4513", // Brown corrugated look
      roughness: 0.8,
      metalness: 0.1
    },
    liner: {
      type: "Art Paper",
      weight: "120gsm", 
      color: "#F5F5DC", // Cream paper color
      roughness: 0.4,
      metalness: 0.0
    },
    adhesive: {
      type: "EVA Animal Glue",
      color: "#DDD"
    },
    finish: {
      type: "Matte Premium",
      color: "#2FAB73", // PakFactory green
      roughness: 0.3,
      metalness: 0.1
    }
  }

  const finalMaterialSpec = materialSpec || defaultMaterialSpec

  const handleExplode = () => {
    setExploded(!exploded)
    onExplode?.()
  }

  // Mark as loaded after component mounts
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#f8fcfa] to-[#f0fff5] rounded-xl">
        <div className="text-center">
          <div className="text-red-500 mb-2 text-2xl">⚠️</div>
          <p className="text-sm text-[#42544e] mb-4">WebGL Error - Using Fallback</p>
          <div className="w-32 h-32 bg-[#279366] rounded-lg mx-auto relative shadow-lg">
            <div className="absolute inset-2 bg-white rounded border border-[#279366]/30 flex items-center justify-center">
              <div className="text-xs text-[#279366] font-bold text-center">PAKFACTORY<br/>BOX</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#f8fcfa] to-[#f0fff5] rounded-xl">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#279366] border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-sm text-[#42544e]">Loading 3D Engine...</p>
        </div>
      </div>
    )
  }

  try {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#f8fcfa] to-[#f0fff5] rounded-xl overflow-hidden relative">
        <Canvas
          camera={{ position: [4, 3, 4], fov: 50 }}
          style={{ width: '100%', height: '100%' }}
          onCreated={() => console.log('Three.js Canvas created successfully')}
        >
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-10, -10, -10]} intensity={0.3} />

          {/* Ground/Shadow Plane */}
          <Plane
            args={[10, 10]}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -dimensions.height * 0.1 - 0.1, 0]}
            receiveShadow
          >
            <meshStandardMaterial
              color="#e7ffef"
              transparent
              opacity={0.3}
            />
          </Plane>

          {/* 3D Packaging Box */}
          <group position={exploded ? [0, 0.5, 0] : [0, 0, 0]}>
            <PackagingBox
              dimensions={dimensions}
              materialSpec={finalMaterialSpec}
            />
          </group>

          {/* Exploded View Parts */}
          {exploded && (
            <>
              {/* Top Lid */}
              <Box
                args={[dimensions.width * 0.2, 0.02, dimensions.depth * 0.2]}
                position={[0, dimensions.height * 0.15, 0]}
              >
                <meshStandardMaterial
                  color="#36B37E"
                  transparent
                  opacity={0.8}
                />
              </Box>

              {/* Bottom Tray */}
              <Box
                args={[dimensions.width * 0.2, 0.02, dimensions.depth * 0.2]}
                position={[0, -dimensions.height * 0.15, 0]}
              >
                <meshStandardMaterial
                  color="#36B37E"
                  transparent
                  opacity={0.8}
                />
              </Box>
            </>
          )}

          {/* Camera Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={false}
            autoRotateSpeed={2}
          />
        </Canvas>

        {/* Overlay Controls */}
        <div className="absolute bottom-4 left-4 flex items-center gap-3">
          <button
            onClick={onRotate}
            className="flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm text-[#279366] rounded-lg text-sm hover:bg-white transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">3d_rotation</span>
            Rotate
          </button>
          <button
            onClick={handleExplode}
            className="flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm text-[#279366] rounded-lg text-sm hover:bg-white transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">unfold_more</span>
            {exploded ? 'Assemble' : 'Explode'}
          </button>
        </div>

        {/* Technical Info Overlay */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-sm max-w-48">
          <div className="text-xs text-[#42544e] space-y-1">
            <div className="font-medium text-[#112d21]">Dimensions</div>
            <div>{dimensions.width}" × {dimensions.height}" × {dimensions.depth}"</div>
            
            <div className="font-medium text-[#112d21] mt-2">Core Board</div>
            <div>{finalMaterialSpec.coreBoard.weight} {finalMaterialSpec.coreBoard.type}</div>
            
            <div className="font-medium text-[#112d21] mt-2">Liner</div>
            <div>{finalMaterialSpec.liner.weight} {finalMaterialSpec.liner.type}</div>
            
            <div className="font-medium text-[#112d21] mt-2">Adhesive</div>
            <div>{finalMaterialSpec.adhesive.type}</div>
            
            <div className="font-medium text-[#112d21] mt-2">Finish</div>
            <div>{finalMaterialSpec.finish.type}</div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Three.js Error:', error)
    setHasError(true)
    return null
  }
}