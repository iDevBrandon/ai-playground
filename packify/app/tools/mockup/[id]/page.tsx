"use client"

import { Button } from "@/components/ui/button"
import { PackageOpen, Upload, Download, RotateCcw, Palette, Layers, ArrowLeft, Share2 } from "lucide-react"
import Link from "next/link"
import { useState, useRef, useCallback, Suspense } from "react"
import { useParams } from "next/navigation"
import dynamic from "next/dynamic"
import DesignModal from "@/components/DesignModal"

const ThreeDMapper = dynamic(() => import("@/components/ThreeDMapper"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-sm text-gray-600">Loading 3D viewer...</p>
      </div>
    </div>
  )
})

const mockupData: Record<string, { title: string; category: string }> = {
  "1": { title: "Software Box Mockup", category: "Boxes" },
  "2": { title: "Cosmetic Bottle", category: "Bottles" },
  "3": { title: "Product Box", category: "Boxes" },
  "4": { title: "Shopping Bag", category: "Bags" },
  "5": { title: "Glass Bottle", category: "Bottles" },
  "6": { title: "Paper Bag", category: "Bags" },
  "7": { title: "Cardboard Box", category: "Boxes" },
  "8": { title: "Clear Pouch", category: "Pouches" },
  "9": { title: "Coffee Package", category: "Pouches" },
  "10": { title: "Wine Bottle", category: "Bottles" },
  "11": { title: "Gift Box", category: "Boxes" },
  "12": { title: "Tube Packaging", category: "Tubes" },
  "13": { title: "Cylinder Plastic Jar", category: "Bottles" }
}

const packageColors = [
  { name: "White", color: "#ffffff", border: true },
  { name: "Black", color: "#000000" },
  { name: "Brown", color: "#8b4513" },
  { name: "Gray", color: "#6b7280" },
  { name: "Blue", color: "#3b82f6" },
  { name: "Red", color: "#ef4444" },
  { name: "Green", color: "#10b981" },
  { name: "Purple", color: "#8b5cf6" }
]

export default function MockupDetailPage() {
  const params = useParams()
  const mockupId = params.id as string
  const mockup = mockupData[mockupId] || { title: "Unknown Mockup", category: "Packages" }
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState("#8b4513")
  const [renderProgress, setRenderProgress] = useState(0)
  const [isRendering, setIsRendering] = useState(false)
  const [selectedSurface, setSelectedSurface] = useState<string>("")
  const [userTextures, setUserTextures] = useState<Record<string, string>>({})
  const [isDesignModalOpen, setIsDesignModalOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  interface DesignElement {
    id: string
    imageUrl: string
    position: { x: number; y: number }
    size: { width: number; height: number }
    rotation: number
  }

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setUploadedImage(imageUrl)
        
        // If a surface is selected, apply the texture to that surface
        if (selectedSurface) {
          setUserTextures(prev => ({
            ...prev,
            [selectedSurface]: imageUrl
          }))
        }
      }
      reader.readAsDataURL(file)
    }
  }, [selectedSurface])

  const handleGeneratePreview = useCallback(() => {
    setIsRendering(true)
    setRenderProgress(0)
    
    const interval = setInterval(() => {
      setRenderProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsRendering(false)
          return 100
        }
        return prev + 5
      })
    }, 100)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setUploadedImage(imageUrl)
        
        // If a surface is selected, apply the texture to that surface
        if (selectedSurface) {
          setUserTextures(prev => ({
            ...prev,
            [selectedSurface]: imageUrl
          }))
        }
      }
      reader.readAsDataURL(file)
    }
  }, [selectedSurface])

  const handleSurfaceSelect = useCallback((surface: string) => {
    setSelectedSurface(surface)
  }, [])

  const handleDesignSave = useCallback((design: DesignElement) => {
    // Apply the design to the selected surface or default to body
    setUserTextures(prev => ({
      ...prev,
      [selectedSurface || 'body']: design.imageUrl
    }))
    setUploadedImage(design.imageUrl)
    setIsDesignModalOpen(false)
  }, [selectedSurface])

  const handleModalClose = useCallback(() => {
    setIsDesignModalOpen(false)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/tools/mockup" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Mockups</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <Link href="/" className="flex items-center space-x-3">
                <PackageOpen className="h-8 w-8 text-primary" />
                <span className="text-xl font-semibold text-gray-900">Packify</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="flex items-center space-x-2">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
              <Button className="bg-primary text-white hover:bg-primary/90 flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Download</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Upload Section */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Upload Design
              </h3>
              
              <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => setIsDesignModalOpen(true)}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
              >
                {uploadedImage ? (
                  <div className="space-y-2">
                    <img src={uploadedImage} alt="Uploaded" className="w-16 h-16 object-cover rounded mx-auto" />
                    <p className="text-sm text-gray-600">Click to change image</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-600">Drop your design here or click to upload</p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              {uploadedImage && (
                <Button 
                  onClick={() => setUploadedImage(null)}
                  variant="outline" 
                  className="w-full mt-3"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Remove Image
                </Button>
              )}
            </div>

            {/* Package Color */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Package Color
              </h3>
              
              <div className="grid grid-cols-4 gap-3">
                {packageColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.color)}
                    className={`w-12 h-12 rounded-lg border-2 transition-all ${
                      selectedColor === color.color 
                        ? "border-primary scale-110" 
                        : color.border 
                          ? "border-gray-300 hover:border-gray-400" 
                          : "border-transparent hover:border-gray-300"
                    }`}
                    style={{ backgroundColor: color.color }}
                    title={color.name}
                  />
                ))}
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Color
                </label>
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full h-10 rounded border border-gray-300"
                />
              </div>
            </div>

            {/* 3D Surface Selection (for 3D models only) */}
            {(mockupId === "2" || mockupId === "5" || mockupId === "10" || mockupId === "13") && (
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Layers className="h-5 w-5 mr-2" />
                  Surface Selection
                </h3>
                
                <div className="space-y-3">
                  {selectedSurface ? (
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-primary">
                          Selected: {selectedSurface ? selectedSurface.charAt(0).toUpperCase() + selectedSurface.slice(1) : 'Surface'}
                        </span>
                        {userTextures[selectedSurface] && (
                          <img 
                            src={userTextures[selectedSurface]} 
                            alt="Applied texture" 
                            className="w-8 h-8 object-cover rounded border border-primary/30"
                          />
                        )}
                      </div>
                      <p className="text-xs text-primary/80 mt-1">
                        Upload an image to apply to the bottle body
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-gray-50 text-center">
                      <p className="text-sm text-gray-600">
                        Hover over the bottle body to highlight, then click to select
                      </p>
                    </div>
                  )}
                  
                  {/* Applied Design Preview */}
                  {Object.keys(userTextures).length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Applied Design:</p>
                      <div className="p-2 rounded bg-gray-50">
                        <img 
                          src={Object.values(userTextures)[0]} 
                          alt="Applied design" 
                          className="w-full h-20 object-cover rounded" 
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Layers Panel (for non-3D models) */}
            {!(mockupId === "2" || mockupId === "5" || mockupId === "10" || mockupId === "13") && (
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Layers className="h-5 w-5 mr-2" />
                  Layers
                </h3>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                    <span className="text-sm text-gray-600">Generate image...</span>
                    <PackageOpen className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            )}

            {/* Generate Button */}
            <Button 
              onClick={handleGeneratePreview}
              disabled={!uploadedImage || isRendering}
              className="w-full bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {isRendering ? "Generating..." : "Generate Preview"}
            </Button>
          </div>

          {/* Main Content - Mockup Preview */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">{mockup.title}</h1>
                <p className="text-gray-600">{mockup.category} • Realistic 3D mockup</p>
              </div>

              {/* Mockup Canvas */}
              <div className="aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 relative overflow-hidden">
                {/* 3D Mockup Visualization */}
                <div className="absolute inset-0">
                  {(mockupId === "2" || mockupId === "5" || mockupId === "10" || mockupId === "13") ? (
                    // 3D Bottle Rendering
                    <Suspense fallback={
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                          <p className="text-sm text-gray-600">Loading 3D model...</p>
                        </div>
                      </div>
                    }>
                      <ThreeDMapper
                        modelPath="/3d/plastic_bottle.glb"
                        onSurfaceSelect={handleSurfaceSelect}
                        selectedSurface={selectedSurface}
                        userTextures={userTextures}
                        packageColor={selectedColor}
                      />
                    </Suspense>
                  ) : mockupId === "7" ? (
                    // Cardboard Box Template (based on Image #2)
                    <div className="relative w-full h-full max-w-4xl max-h-96 p-8">
                      <svg 
                        viewBox="0 0 1200 600" 
                        className="w-full h-full"
                        style={{ filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.1))' }}
                      >
                        {/* Box Template Outline */}
                        <g stroke="#8b4513" strokeWidth="2" fill="none" strokeDasharray="4,4">
                          {/* Main faces */}
                          <rect x="100" y="100" width="200" height="150" />
                          <rect x="300" y="100" width="300" height="150" />
                          <rect x="600" y="100" width="200" height="150" />
                          <rect x="300" y="50" width="300" height="50" />
                          <rect x="300" y="250" width="300" height="150" />
                          
                          {/* Flaps and tabs */}
                          <polygon points="50,100 100,100 100,200 80,220 50,200" />
                          <polygon points="800,100 850,100 850,200 830,220 800,200" />
                          <polygon points="300,250 350,300 550,300 600,250" />
                        </g>
                        
                        {/* Main panel background */}
                        <rect x="300" y="100" width="300" height="150" fill={selectedColor} opacity="0.8" />
                        
                        {/* Dimension lines */}
                        <g stroke="#8b4513" strokeWidth="1" opacity="0.6">
                          <line x1="620" y1="80" x2="720" y2="80" markerEnd="url(#arrowhead)" />
                          <line x1="720" y1="80" x2="620" y2="80" markerStart="url(#arrowhead)" />
                          <text x="670" y="75" textAnchor="middle" fontSize="12" fill="#8b4513">60.6 mm</text>
                          
                          <line x1="750" y1="100" x2="750" y2="250" markerEnd="url(#arrowhead)" />
                          <line x1="750" y1="250" x2="750" y2="100" markerStart="url(#arrowhead)" />
                          <text x="760" y="175" fontSize="12" fill="#8b4513">161.6 mm</text>
                          
                          <line x1="280" y1="280" x2="620" y2="280" markerEnd="url(#arrowhead)" />
                          <line x1="620" y1="280" x2="280" y2="280" markerStart="url(#arrowhead)" />
                          <text x="450" y="295" textAnchor="middle" fontSize="12" fill="#8b4513">120.6 mm</text>
                        </g>
                        
                        {/* Arrow markers */}
                        <defs>
                          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#8b4513" />
                          </marker>
                        </defs>
                        
                        {/* User's uploaded image */}
                        {uploadedImage && (
                          <image 
                            x="320" y="120" 
                            width="260" 
                            height="110" 
                            href={uploadedImage}
                            opacity="0.9"
                            preserveAspectRatio="xMidYMid meet"
                          />
                        )}
                      </svg>
                    </div>
                  ) : (
                    // Generic 2D Package (fallback)
                    <div className="relative w-full h-full flex items-center justify-center">
                      {/* Background Pattern */}
                      <div 
                        className="absolute inset-0 opacity-10"
                        style={{
                          backgroundImage: `radial-gradient(circle at 2px 2px, ${selectedColor} 1px, transparent 0)`,
                          backgroundSize: "24px 24px"
                        }}
                      />
                      
                      <div className="relative">
                        <div 
                          className="w-64 h-64 rounded-lg shadow-2xl transform rotate-12 flex items-center justify-center"
                          style={{ backgroundColor: selectedColor }}
                        >
                          {uploadedImage ? (
                            <img 
                              src={uploadedImage} 
                              alt="Your design" 
                              className="w-48 h-48 object-contain rounded"
                            />
                          ) : (
                            <div className="text-white/50 text-center">
                              <PackageOpen className="h-16 w-16 mx-auto mb-2" />
                              <p className="text-sm">Your design here</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Rendering Progress Overlay */}
                {isRendering && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white rounded-lg p-6 max-w-xs w-full mx-4">
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        {renderProgress}% Rendering preview...
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-100"
                          style={{ width: `${renderProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Optimizing structural integrity for corrugated fiberboard...
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Button className="bg-primary text-white hover:bg-primary/90">
                  <Download className="h-4 w-4 mr-2" />
                  Download High-Res
                </Button>
                <Button variant="outline">
                  Generate Variations
                </Button>
                <Button variant="outline">
                  Save to Project
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Design Modal */}
      <DesignModal
        isOpen={isDesignModalOpen}
        onClose={handleModalClose}
        onSave={handleDesignSave}
      />
    </div>
  )
}