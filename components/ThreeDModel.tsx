"use client"

import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, Center } from '@react-three/drei'
import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

interface ThreeDModelProps {
  modelPath: string
  userTexture?: string | null
  packageColor?: string
  onLoaded?: () => void
}

function Model({ modelPath, userTexture, packageColor = "#ffffff" }: { 
  modelPath: string
  userTexture?: string | null
  packageColor: string 
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

  // Apply materials to the model
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Create new material
          const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(packageColor),
            roughness: 0.3,
            metalness: 0.1,
            envMapIntensity: 1.5,
          })

          // Apply user texture if available
          if (loadedTexture) {
            material.map = loadedTexture
            material.needsUpdate = true
          }

          child.material = material
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    }
  }, [scene, loadedTexture, packageColor])

  return (
    <Center>
      <primitive object={scene} scale={1.5} />
    </Center>
  )
}

export default function ThreeDModel({ 
  modelPath, 
  userTexture, 
  packageColor = "#ffffff",
  onLoaded 
}: ThreeDModelProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleLoad = () => {
    setIsLoading(false)
    onLoaded?.()
  }

  const handleError = (error: any) => {
    setError('Failed to load 3D model')
    setIsLoading(false)
    console.error('3D Model loading error:', error)
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading 3D model...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
          <div className="text-center text-red-500">
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <Canvas
        camera={{ position: [3, 2, 5], fov: 50 }}
        style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}
        shadows
        onCreated={() => {
          setIsLoading(false)
          onLoaded?.()
        }}
      >
        {/* Lighting setup for realistic rendering */}
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1.2} 
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <spotLight 
          position={[-5, 5, 5]} 
          intensity={0.8}
          angle={0.3}
          penumbra={0.5}
          castShadow
        />
        
        {/* Environment for realistic reflections */}
        <Environment preset="city" />
        
        {/* 3D Model */}
        <Model 
          modelPath={modelPath} 
          userTexture={userTexture}
          packageColor={packageColor}
        />
        
        {/* Ground plane for shadows */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <shadowMaterial opacity={0.2} />
        </mesh>
        
        {/* Controls for rotating the model */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={8}
          autoRotate={false}
          autoRotateSpeed={1}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  )
}

// Preload the GLB model
useGLTF.preload('/3d/plastic_bottle.glb')