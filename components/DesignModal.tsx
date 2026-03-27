"use client"

import { useState, useRef, useCallback, Suspense, useEffect } from 'react'
import { X, Upload, Move, RotateCw, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'
import { getProject, types } from '@theatre/core'
import studio from '@theatre/studio'

const ThreeDPreview = dynamic(() => import("@/components/ThreeDPreview"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-pulse">
          <div className="w-12 h-12 bg-gray-400 rounded mx-auto mb-2" />
        </div>
        <p className="text-xs text-gray-500">Loading 3D...</p>
      </div>
    </div>
  )
})

interface DesignElement {
  id: string
  imageUrl: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  rotation: number
}

interface DesignModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (design: DesignElement) => void
  initialDesign?: DesignElement | null
}

export default function DesignModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialDesign 
}: DesignModalProps) {
  const [designElement, setDesignElement] = useState<DesignElement | null>(
    initialDesign || null
  )
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [packageColor, setPackageColor] = useState("#ffffff")
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 })
  const [theatreProject, setTheatreProject] = useState<any>(null)
  const [theatreSheet, setTheatreSheet] = useState<any>(null)
  const [theatreObject, setTheatreObject] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  // Initialize Theatre.js
  useEffect(() => {
    if (isOpen && !theatreProject) {
      // Initialize Theatre.js studio in development
      if (process.env.NODE_ENV === 'development') {
        studio.initialize()
      }

      // Create Theatre.js project
      const project = getProject('DesignModal')
      const sheet = project.sheet('Design Animation')
      
      // Create Theatre.js object for design element
      const obj = sheet.object('DesignElement', {
        position: types.compound({
          x: types.number(designElement?.position.x || 100, { range: [0, 600] }),
          y: types.number(designElement?.position.y || 100, { range: [0, 400] })
        }),
        size: types.compound({
          width: types.number(designElement?.size.width || 150, { range: [50, 400] }),
          height: types.number(designElement?.size.height || 100, { range: [30, 300] })
        }),
        rotation: types.number(designElement?.rotation || 0, { range: [-180, 180] })
      })

      setTheatreProject(project)
      setTheatreSheet(sheet)
      setTheatreObject(obj)
    }
  }, [isOpen])

  // Sync Theatre.js values with design element
  useEffect(() => {
    if (theatreObject && designElement) {
      const unsubscribe = theatreObject.onValuesChange((values: any) => {
        setDesignElement(prev => prev ? {
          ...prev,
          position: values.position,
          size: values.size,
          rotation: values.rotation
        } : null)
      })

      return unsubscribe
    }
  }, [theatreObject, designElement])

  const packageColors = [
    "#8b5cf6", "#ffffff", "#6b7280", "#fbbf24",
    "#f59e0b", "#ef4444", "#92400e", "#059669"
  ]

  // Calculate dimensions in mm based on canvas size (assuming 1px = 0.34mm)
  const dimensionsInMM = {
    width: Math.round(canvasSize.width * 0.34),
    height: Math.round(canvasSize.height * 0.34)
  }

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setDesignElement({
          id: 'design-1',
          imageUrl,
          position: { x: 100, y: 100 },
          size: { width: 150, height: 100 },
          rotation: 0
        })
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (!designElement) return
    setIsDragging(true)
    setDragStart({
      x: e.clientX - designElement.position.x,
      y: e.clientY - designElement.position.y
    })
  }, [designElement])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!canvasRef.current || !designElement) return
    
    const canvasRect = canvasRef.current.getBoundingClientRect()
    const mouseX = e.clientX - canvasRect.left
    const mouseY = e.clientY - canvasRect.top
    
    if (isDragging) {
      const newX = Math.max(0, Math.min(mouseX - dragStart.x, canvasSize.width - designElement.size.width))
      const newY = Math.max(0, Math.min(mouseY - dragStart.y, canvasSize.height - designElement.size.height))
      
      // Update design element directly (Theatre.js will sync via onValuesChange)
      setDesignElement({
        ...designElement,
        position: { x: newX, y: newY }
      })
    } else if (isResizing) {
      const newWidth = Math.max(50, mouseX - designElement.position.x)
      const newHeight = Math.max(30, mouseY - designElement.position.y)
      
      // Update design element directly (Theatre.js will sync via onValuesChange)
      setDesignElement({
        ...designElement,
        size: { width: newWidth, height: newHeight }
      })
    }
  }, [isDragging, isResizing, designElement, dragStart, canvasSize, theatreObject, theatreSheet])

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsResizing(true)
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsResizing(false)
  }, [])

  const handleSave = useCallback(() => {
    if (designElement) {
      onSave(designElement)
      onClose()
    }
  }, [designElement, onSave, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">Upload & Design</h2>
          <div className="flex items-center space-x-3">
            <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 text-white px-6">
              Save
            </Button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-80 bg-gray-50 border-r border-gray-200 p-6 space-y-6">
            {/* Upload Section */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Upload className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Uploads</span>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 hover:bg-purple-50 transition-colors"
              >
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">JPG, PNG, SVG</p>
                <p className="text-xs text-gray-500 mt-1">Click to upload</p>
              </button>

              {/* Uploaded Design Preview */}
              {designElement && (
                <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                  <img 
                    src={designElement.imageUrl} 
                    alt="Uploaded design" 
                    className="w-full h-16 object-cover rounded mb-2"
                  />
                  <p className="text-xs text-gray-600">Design uploaded</p>
                </div>
              )}
            </div>

            {/* Elements Section */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Square className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Elements</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="aspect-square bg-white rounded-lg border-2 border-gray-200 flex items-center justify-center">
                  <div className="w-8 h-8 bg-gray-300 rounded"></div>
                </div>
                <div className="aspect-square bg-white rounded-lg border-2 border-gray-200 flex items-center justify-center">
                  <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Inspirations Section */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-5 h-5 bg-gradient-to-br from-purple-400 to-pink-400 rounded"></div>
                <span className="text-sm font-medium text-gray-700">Inspirations</span>
              </div>
              <div className="text-xs text-gray-500">
                Browse design templates and inspirations
              </div>
            </div>
          </div>

          {/* Main Canvas Area */}
          <div className="flex-1 p-8">
            <div className="h-full flex items-center justify-center">
              {/* Design Canvas */}
              <div 
                ref={canvasRef}
                className="relative border-2 border-gray-300 border-dashed rounded-lg bg-gray-50"
                style={{ width: `${canvasSize.width}px`, height: `${canvasSize.height}px` }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Canvas Dimensions */}
                <div className="absolute -top-8 left-0 text-sm text-blue-600 font-medium">
                  {dimensionsInMM.width} mm × {dimensionsInMM.height} mm
                </div>

                {/* Dimension Lines */}
                <div className="absolute -top-6 left-0 right-0 h-px bg-blue-400"></div>
                <div className="absolute -left-6 top-0 bottom-0 w-px bg-blue-400"></div>
                
                {/* Top dimension arrow */}
                <div className="absolute -top-7 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center">
                    <div className="w-2 h-px bg-blue-400"></div>
                    <div className="px-1 text-xs text-blue-600">204 mm</div>
                    <div className="w-2 h-px bg-blue-400"></div>
                  </div>
                </div>

                {/* Side dimension arrow */}
                <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 -rotate-90">
                  <div className="flex items-center">
                    <div className="w-2 h-px bg-blue-400"></div>
                    <div className="px-1 text-xs text-blue-600 rotate-90">45 mm</div>
                    <div className="w-2 h-px bg-blue-400"></div>
                  </div>
                </div>

                {/* Draggable Design Element */}
                {designElement && (
                  <div
                    className="absolute border border-purple-400 rounded cursor-move select-none"
                    style={{
                      left: `${designElement.position.x}px`,
                      top: `${designElement.position.y}px`,
                      width: `${designElement.size.width}px`,
                      height: `${designElement.size.height}px`,
                      transform: `rotate(${designElement.rotation}deg)`,
                      backgroundImage: `url(${designElement.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                    onMouseDown={handleDragStart}
                  >
                    {/* Resize Handles */}
                    <div 
                      className="absolute -top-1 -left-1 w-3 h-3 bg-purple-400 rounded-full cursor-nw-resize hover:bg-purple-500"
                      onMouseDown={handleResizeStart}
                    ></div>
                    <div 
                      className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full cursor-ne-resize hover:bg-purple-500"
                      onMouseDown={handleResizeStart}
                    ></div>
                    <div 
                      className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-400 rounded-full cursor-sw-resize hover:bg-purple-500"
                      onMouseDown={handleResizeStart}
                    ></div>
                    <div 
                      className="absolute -bottom-1 -right-1 w-3 h-3 bg-purple-400 rounded-full cursor-se-resize hover:bg-purple-500"
                      onMouseDown={handleResizeStart}
                    ></div>
                    
                    {/* Rotation Handle */}
                    <div 
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full cursor-grab hover:bg-green-600 flex items-center justify-center"
                      onMouseDown={(e) => {
                        e.stopPropagation()
                        // Handle rotation - you can implement rotation logic here
                      }}
                    >
                      <RotateCw className="w-2 h-2 text-white" />
                    </div>
                    
                    {/* Size indicator */}
                    <div className="absolute -bottom-6 left-0 text-xs text-purple-600 bg-white px-1 rounded">
                      {Math.round(designElement.size.width * 0.34)}×{Math.round(designElement.size.height * 0.34)}mm
                    </div>
                  </div>
                )}

                {/* Drop Zone Message */}
                {!designElement && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <Upload className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Drop your design here or upload from sidebar</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - 3D Preview */}
          <div className="w-80 bg-gray-50 border-l border-gray-200 p-6">
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-4 h-4 bg-gray-800 rounded text-white text-xs flex items-center justify-center">3D</div>
                <span className="text-sm font-medium text-gray-700">Package Color</span>
              </div>
              
              {/* Color Palette */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {packageColors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setPackageColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      packageColor === color 
                        ? "border-purple-500 scale-110" 
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    style={{ backgroundColor: color }}
                    title={`Color ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* 3D Preview Area */}
            <div className="bg-gray-100 rounded-lg aspect-square overflow-hidden">
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="w-16 h-20 bg-gray-400 rounded-lg mx-auto mb-2"></div>
                    <p className="text-xs">Loading 3D...</p>
                  </div>
                </div>
              }>
                <ThreeDPreview
                  modelPath="/3d/plastic_bottle.glb"
                  packageColor={packageColor}
                  autoRotate={true}
                  userTexture={designElement?.imageUrl}
                />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Theatre.js Timeline Panel */}
        {theatreObject && process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-900 border-t border-gray-700 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium text-white">Theatre.js Timeline</span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => {
                    if (theatreSheet?.sequence) {
                      theatreSheet.sequence.play({ iterationCount: Infinity })
                    }
                  }}
                  className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors"
                >
                  Play
                </button>
                <button 
                  onClick={() => {
                    if (theatreSheet?.sequence) {
                      theatreSheet.sequence.pause()
                    }
                  }}
                  className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                >
                  Pause
                </button>
                <button 
                  onClick={() => {
                    setDesignElement({
                      id: 'design-1',
                      imageUrl: designElement?.imageUrl || '',
                      position: { x: 100, y: 100 },
                      size: { width: 150, height: 100 },
                      rotation: 0
                    })
                  }}
                  className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
            
            {/* Timeline Scrubber */}
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-400">0s</span>
                <div className="flex-1 relative">
                  <div className="h-2 bg-gray-700 rounded-full">
                    <div className="h-2 bg-purple-500 rounded-full transition-all duration-200" style={{ width: '0%' }}></div>
                  </div>
                  <div className="absolute top-0 left-0 w-3 h-3 bg-white rounded-full shadow-sm transform -translate-y-0.5 cursor-pointer"></div>
                </div>
                <span className="text-xs text-gray-400">5s</span>
              </div>
              
              {/* Property Controls */}
              <div className="grid grid-cols-3 gap-4 mt-4 text-xs">
                <div>
                  <label className="text-gray-400 block mb-1">Position X</label>
                  <div className="text-white">{Math.round(designElement?.position.x || 0)}px</div>
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Position Y</label>
                  <div className="text-white">{Math.round(designElement?.position.y || 0)}px</div>
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Rotation</label>
                  <div className="text-white">{Math.round(designElement?.rotation || 0)}°</div>
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Width</label>
                  <div className="text-white">{Math.round(designElement?.size.width || 0)}px</div>
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Height</label>
                  <div className="text-white">{Math.round(designElement?.size.height || 0)}px</div>
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Scale</label>
                  <div className="text-white">100%</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}