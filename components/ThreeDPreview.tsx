"use client"

import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, Center } from '@react-three/drei'
import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { PackageOpen } from 'lucide-react'

interface ThreeDPreviewProps {
  modelPath: string
  packageColor?: string
  autoRotate?: boolean
  userTexture?: string
}

function PreviewModel({ modelPath, packageColor = "#ffffff", userTexture }: { 
  modelPath: string
  packageColor: string 
  userTexture?: string
}) {
  const { scene } = useGLTF(modelPath)
  const [textureLoader] = useState(() => new THREE.TextureLoader())
  const [loadedTexture, setLoadedTexture] = useState<THREE.Texture | null>(null)

  // Load user texture
  useEffect(() => {
    if (userTexture) {
      textureLoader.load(
        userTexture,
        (texture) => {
          texture.wrapS = THREE.RepeatWrapping
          texture.wrapT = THREE.RepeatWrapping
          setLoadedTexture(texture)
        },
        undefined,
        (error) => {
          console.error('Error loading texture:', error)
          setLoadedTexture(null)
        }
      )
    } else {
      setLoadedTexture(null)
    }
  }, [userTexture, textureLoader])

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Use the same precise detection logic as ThreeDMapper
          child.geometry.computeBoundingBox()
          const box = child.geometry.boundingBox
          const meshCenter = box ? (box.max.y + box.min.y) / 2 : child.position.y
          const meshHeight = box ? (box.max.y - box.min.y) : 1
          
          // More precise detection: only the actual cap mesh should be classified as cap
          const isBottleCap =
            child.name.toLowerCase().includes("cap") ||
            child.name.toLowerCase().includes("lid") ||
            child.name.toLowerCase().includes("top") ||
            child.position.y > 0.35 ||  // Only meshes clearly at the top
            (meshCenter > 0.35 && meshHeight > 0.01) || // Cap has more substantial height
            child.name.includes("0_4")  // Specific mesh we know is the cap
          
          const isBottleBody = !isBottleCap
          
          // Only highlight/texture the major body parts (same as main mapper)
          const isMajorBodyPart = isBottleBody && meshHeight > 0.005 && child.position.y < 0.35 && child.position.y > -0.1

          // Create material for preview
          const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(packageColor),
            roughness: 0.3,
            metalness: 0.1,
            transparent: true,
            opacity: 0.9,
          })

          // Apply texture only to major body parts (matching the highlighted area)
          if (isMajorBodyPart && loadedTexture) {
            material.map = loadedTexture
            material.needsUpdate = true
          }

          child.material = material
          child.castShadow = true
        }
      })
    }
  }, [scene, packageColor, loadedTexture])

  return (
    <Center>
      <primitive object={scene} scale={2.5} />
    </Center>
  )
}

export default function ThreeDPreview({ 
  modelPath, 
  packageColor = "#ffffff",
  autoRotate = true,
  userTexture
}: ThreeDPreviewProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className="relative w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg z-10">
          <div className="text-center">
            <div className="animate-pulse">
              <PackageOpen className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            </div>
            <p className="text-xs text-gray-500">Loading 3D...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg">
          <div className="text-center">
            <PackageOpen className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-xs text-gray-500">3D Preview</p>
          </div>
        </div>
      )}

      <Canvas
        camera={{ position: [3, 2, 4], fov: 45 }}
        style={{ 
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          borderRadius: '0.5rem'
        }}
        onCreated={() => setIsLoading(false)}
        onError={() => {
          setError(true)
          setIsLoading(false)
        }}
      >
        {/* Simple lighting for preview */}
        <ambientLight intensity={0.7} />
        <directionalLight 
          position={[3, 3, 3]} 
          intensity={0.8} 
        />
        
        {/* Subtle environment */}
        <Environment preset="apartment" />
        
        {/* 3D Model */}
        <PreviewModel 
          modelPath={modelPath} 
          packageColor={packageColor}
          userTexture={userTexture}
        />
        
        {/* Auto-rotate controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          autoRotate={autoRotate && isHovered}
          autoRotateSpeed={2}
          minDistance={2}
          maxDistance={8}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>

      {/* 3D indicator overlay */}
      <div className="absolute top-2 left-2 bg-black/20 backdrop-blur-sm rounded px-2 py-1">
        <span className="text-xs text-white font-medium">3D</span>
      </div>
    </div>
  )
}

// Preload models
useGLTF.preload('/3d/plastic_bottle.glb')