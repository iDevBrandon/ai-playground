"use client"

import {
  Center,
  Environment,
  Html,
  OrbitControls,
  useGLTF,
} from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { useCallback, useEffect, useRef, useState } from "react"
import * as THREE from "three"

interface ThreeDMapperProps {
  modelPath: string
  onSurfaceSelect?: (surface: string, uv?: THREE.Vector2) => void
  selectedSurface?: string
  userTextures?: Record<string, string>
  packageColor?: string
}

interface DesignElement {
  id: string
  imageUrl: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  rotation: number
}

function DesignMappingArea({
  designElement,
  onUpdateDesign,
}: {
  designElement: DesignElement | null
  onUpdateDesign: (design: DesignElement) => void
}) {
  if (!designElement) return null

  return (
    <Html position={[0, 0, 0.6]} transform occlude>
      <div className="relative">
        {/* Design positioning area */}
        <div
          className="rounded-lg border-2 border-dashed border-blue-400 bg-blue-50/20"
          style={{
            width: "300px",
            height: "200px",
            position: "relative",
          }}
        >
          {/* Draggable design element */}
          <div
            className="absolute cursor-move rounded border border-purple-400"
            style={{
              left: `${designElement.position.x}px`,
              top: `${designElement.position.y}px`,
              width: `${designElement.size.width}px`,
              height: `${designElement.size.height}px`,
              transform: `rotate(${designElement.rotation}deg)`,
              backgroundImage: `url(${designElement.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Resize handles */}
            <div className="absolute -top-1 -left-1 h-2 w-2 cursor-nw-resize rounded-full bg-purple-400"></div>
            <div className="absolute -top-1 -right-1 h-2 w-2 cursor-ne-resize rounded-full bg-purple-400"></div>
            <div className="absolute -bottom-1 -left-1 h-2 w-2 cursor-sw-resize rounded-full bg-purple-400"></div>
            <div className="absolute -right-1 -bottom-1 h-2 w-2 cursor-se-resize rounded-full bg-purple-400"></div>
          </div>

          {/* Dimensions overlay */}
          <div className="absolute -top-6 left-0 rounded bg-white px-1 text-xs text-blue-600">
            375mm × 107mm
          </div>
        </div>
      </div>
    </Html>
  )
}

function InteractiveModel({
  modelPath,
  onSurfaceSelect,
  selectedSurface,
  userTextures,
  packageColor,
  showAreas,
  designElement,
  onUpdateDesign,
  showDesignMapping,
}: {
  modelPath: string
  onSurfaceSelect: (surface: string) => void
  selectedSurface?: string
  userTextures?: Record<string, string>
  packageColor: string
  showAreas: boolean
  designElement: DesignElement | null
  onUpdateDesign: (design: DesignElement) => void
  showDesignMapping: boolean
}) {
  const { scene } = useGLTF(modelPath)
  const [textureLoader] = useState(() => new THREE.TextureLoader())
  const [loadedTextures, setLoadedTextures] = useState<
    Record<string, THREE.Texture>
  >({})
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef<THREE.Mesh>(null)

  // Load textures
  useEffect(() => {
    if (userTextures) {
      Object.entries(userTextures).forEach(([surface, imageUrl]) => {
        textureLoader.load(imageUrl, (texture) => {
          texture.wrapS = THREE.RepeatWrapping
          texture.wrapT = THREE.RepeatWrapping
          setLoadedTextures((prev) => ({ ...prev, [surface]: texture }))
        })
      })
    }
  }, [userTextures, textureLoader])

  // Create materials
  const normalMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(packageColor),
    roughness: 0.3,
    metalness: 0.1,
    transparent: true,
    opacity: 0.9,
  })

  const hoverMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#8b5cf6"), // Purple color like in the image
    roughness: 0.2,
    metalness: 0.2,
    transparent: true,
    opacity: 0.8,
  })

  // Apply materials and textures
  useEffect(() => {
    if (scene) {
      console.log("--- Scene Structure ---")
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          console.log(
            `Mesh found: "${child.name}"`,
            `Position Y: ${child.position.y}`
          )

          // Compute bounding box to understand mesh geometry
          child.geometry.computeBoundingBox()
          const box = child.geometry.boundingBox
          const meshCenter = box
            ? (box.max.y + box.min.y) / 2
            : child.position.y
          const meshHeight = box ? box.max.y - box.min.y : 1

          console.log(
            `Mesh "${child.name}" - Center Y: ${meshCenter}, Height: ${meshHeight}`
          )

          // Determine if this is body or cap based on position and name
          // More precise detection: only the actual cap mesh should be classified as cap
          const isBottleCap =
            child.name.toLowerCase().includes("cap") ||
            child.name.toLowerCase().includes("lid") ||
            child.name.toLowerCase().includes("top") ||
            child.position.y > 0.35 ||  // Only meshes clearly at the top
            (meshCenter > 0.35 && meshHeight > 0.01) || // Cap has more substantial height
            child.name.includes("0_4")  // Specific mesh we know is the cap

          const isBottleBody = !isBottleCap

          console.log(
            `"${child.name}" classified as: ${isBottleBody ? "BODY" : "CAP"}`
          )

          let material
          // Only highlight body when hovered, exclude bottom and very small/thin meshes
          const isMajorBodyPart = isBottleBody && meshHeight > 0.005 && child.position.y < 0.35 && child.position.y > -0.1
          
          if (isMajorBodyPart && hovered) {
            material = hoverMaterial.clone()
          } else {
            material = normalMaterial.clone()
          }

          // Apply texture only to body
          if (
            isBottleBody &&
            userTextures &&
            Object.keys(userTextures).length > 0
          ) {
            const firstTexture = Object.values(loadedTextures)[0]
            if (firstTexture) {
              material.map = firstTexture
              material.needsUpdate = true
            }
          }

          child.material = material
          child.castShadow = true
          child.receiveShadow = true

          // Mark body parts for interaction
          child.userData.isBottleBody = isBottleBody
          child.userData.isBottleCap = isBottleCap
          child.userData.isMajorBodyPart = isMajorBodyPart
        }
      })
    }
  }, [scene, loadedTextures, packageColor, hovered, userTextures])

  const handleClick = useCallback(
    (event: any) => {
      event.stopPropagation()
      // Determine what was actually clicked
      if (event.object) {
        if (event.object.userData.isBottleBody) {
          onSurfaceSelect("bottle body")
        } else if (event.object.userData.isBottleCap) {
          onSurfaceSelect("bottle cap")
        } else {
          onSurfaceSelect("unknown surface")
        }
      }
    },
    [onSurfaceSelect]
  )

  const handlePointerEnter = useCallback((event: any) => {
    // Only highlight if hovering over major bottle body parts
    if (event.object && event.object.userData.isMajorBodyPart) {
      setHovered(true)
      document.body.style.cursor = "pointer"
    }
  }, [])

  const handlePointerLeave = useCallback((event: any) => {
    // Only reset if leaving major bottle body parts
    if (event.object && event.object.userData.isMajorBodyPart) {
      setHovered(false)
      document.body.style.cursor = "auto"
    }
  }, [])

  return (
    <Center>
      <primitive
        ref={meshRef}
        object={scene}
        scale={8.0}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />

      {/* Design mapping area */}
      {showDesignMapping && (
        <DesignMappingArea
          designElement={designElement}
          onUpdateDesign={onUpdateDesign}
        />
      )}
    </Center>
  )
}

export default function ThreeDMapper({
  modelPath,
  onSurfaceSelect,
  selectedSurface,
  userTextures = {},
  packageColor = "#ffffff",
}: ThreeDMapperProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [showDesignMapping, setShowDesignMapping] = useState(false)
  const [designElement, setDesignElement] = useState<DesignElement | null>(null)

  const handleSurfaceSelect = useCallback(
    (surface: string) => {
      onSurfaceSelect?.(surface)

      // Show design mapping interface when surface is selected and there's a texture
      if (userTextures && Object.keys(userTextures).length > 0) {
        const firstTexture = Object.values(userTextures)[0]
        setDesignElement({
          id: "design-1",
          imageUrl: firstTexture,
          position: { x: 50, y: 50 },
          size: { width: 100, height: 80 },
          rotation: 0,
        })
        setShowDesignMapping(true)
      }
    },
    [onSurfaceSelect, userTextures]
  )

  const handleUpdateDesign = useCallback((design: DesignElement) => {
    setDesignElement(design)
  }, [])

  return (
    <div className="relative h-full w-full">
      {/* Surface Info */}
      {selectedSurface && (
        <div className="absolute bottom-4 left-4 z-10 rounded-lg border border-gray-300 bg-white/90 px-4 py-2 backdrop-blur-sm">
          <p className="text-sm font-medium text-gray-900">
            Selected: {selectedSurface.charAt(0).toUpperCase() + selectedSurface.slice(1)}
          </p>
          <p className="text-xs text-gray-600">
            {selectedSurface.includes('body') 
              ? 'Click "Upload Design" to apply image to this surface' 
              : 'This surface is not available for design application'}
          </p>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-gray-100">
          <div className="text-center">
            <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            <p className="text-sm text-gray-600">Loading 3D mapper...</p>
          </div>
        </div>
      )}

      <Canvas
        camera={{ position: [4, 2, 6], fov: 50 }}
        style={{
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        }}
        shadows
        onCreated={() => setIsLoading(false)}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
        <spotLight
          position={[-5, 5, 5]}
          intensity={0.8}
          angle={0.3}
          penumbra={0.5}
        />

        <Environment preset="city" />

        {/* Interactive 3D Model */}
        <InteractiveModel
          modelPath={modelPath}
          onSurfaceSelect={handleSurfaceSelect}
          selectedSurface={selectedSurface}
          userTextures={userTextures}
          packageColor={packageColor}
          showAreas={true}
          designElement={designElement}
          onUpdateDesign={handleUpdateDesign}
          showDesignMapping={showDesignMapping}
        />

        {/* Ground */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -8, 0]}
          receiveShadow
        >
          <planeGeometry args={[40, 40]} />
          <shadowMaterial opacity={0.2} />
        </mesh>

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          minDistance={0.1}
          maxDistance={35}
          maxPolarAngle={Math.PI}
        />
      </Canvas>
    </div>
  )
}

// Preload
useGLTF.preload("/3d/plastic_bottle.glb")
