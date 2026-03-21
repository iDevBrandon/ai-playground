'use client'

import Link from 'next/link'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'

// Dynamically import Three.js component to avoid SSR issues
const ThreeJSPackaging = dynamic(() => import('@/components/ThreeJSPackaging'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#f8fcfa] to-[#f0fff5]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#279366] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm text-[#42544e]">Loading 3D Engine...</p>
      </div>
    </div>
  )
})

function ThreeDRenderContent() {
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState('Initializing 3D render engine...')
  const [isComplete, setIsComplete] = useState(false)
  const searchParams = useSearchParams()

  // Parse URL parameters
  const width = parseInt(searchParams.get('width') || '12')
  const height = parseInt(searchParams.get('height') || '10') 
  const depth = parseInt(searchParams.get('depth') || '4')
  
  let materialSpec
  try {
    const materialParam = searchParams.get('materialSpec')
    materialSpec = materialParam ? JSON.parse(materialParam) : null
  } catch (e) {
    materialSpec = null
  }

  const stages = [
    { progress: 15, text: "Analyzing geometry and dimensions..." },
    { progress: 35, text: "Calculating material properties..." },
    { progress: 55, text: "Generating 3D mesh structure..." },
    { progress: 75, text: "Applying materials and textures..." },
    { progress: 90, text: "Rendering shadows and lighting..." },
    { progress: 100, text: "Finalizing CAD-grade visualization..." }
  ]

  useEffect(() => {
    let stageIndex = 0
    const interval = setInterval(() => {
      if (stageIndex < stages.length) {
        const currentStage = stages[stageIndex]
        setProgress(currentStage.progress)
        setStage(currentStage.text)
        stageIndex++
      } else {
        clearInterval(interval)
        setTimeout(() => {
          setIsComplete(true)
          setStage('Render completed successfully!')
        }, 500)
      }
    }, 800)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#f9fffb]" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-[#c3d6cd]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[#112d21]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  3D Render Visualization
                </h1>
                <p className="text-sm text-[#42544e] mt-1">
                  CAD-Grade Packaging Visualization
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-[#e7ffef] px-3 py-2 rounded-lg">
                <span className="block text-[10px] text-[#42544e] font-bold uppercase">Status</span>
                <span className="text-xs font-medium text-[#279366]">
                  {isComplete ? 'Complete' : 'Rendering...'}
                </span>
              </div>
              <Link
                href="/design-lab"
                className="inline-flex items-center px-4 py-2 bg-[#279366] text-white rounded-lg hover:opacity-90 transition-colors"
              >
                ← Back to Design Lab
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Render Progress Section */}
        <div className="bg-white rounded-xl shadow-sm border border-[#c3d6cd]/30 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#112d21]" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Render Progress
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#42544e]">{progress}%</span>
              {!isComplete && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-[#279366] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#279366] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-2 h-2 bg-[#279366] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-[#e7ffef] h-3 rounded-full overflow-hidden mb-4">
            <div 
              className="h-full bg-[#279366] transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <p className="text-sm text-[#42544e]">{stage}</p>
        </div>

        {/* 3D Render Viewport */}
        <div className="bg-white rounded-xl shadow-sm border border-[#c3d6cd]/30 overflow-hidden">
          <div className="bg-[#f0fff5] px-6 py-4 border-b border-[#c3d6cd]/20">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-[#112d21]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                3D Viewport - Rigid Box Visualization
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#42544e]">{width}" × {height}" × {depth}"</span>
                <span className="px-2 py-1 bg-[#279366] text-white text-xs rounded">
                  {materialSpec?.coreBoard?.weight || '1200gsm'} {materialSpec?.coreBoard?.type || 'ESKA'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Three.js Render Container */}
          <div className="relative aspect-video" style={{ minHeight: '500px' }}>
            {!isComplete ? (
              /* Loading State */
              <div className="absolute inset-0 bg-gradient-to-br from-[#f8fcfa] to-[#f0fff5] flex items-center justify-center">
                <div className="text-center">
                  <div className="relative mx-auto w-40 h-40 mb-6">
                    <div className="absolute inset-0 border-2 border-[#279366] border-dashed rounded-xl animate-pulse"></div>
                    <div className="absolute inset-4 border border-[#279366]/60 border-dotted rounded-xl animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                    <div className="absolute inset-8 border border-[#279366]/40 border-dotted rounded-xl animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                  </div>
                  <h4 className="text-lg font-medium text-[#112d21] mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Generating 3D Model
                  </h4>
                  <p className="text-sm text-[#42544e] mb-1">CAD precision rendering with material textures...</p>
                  <p className="text-xs text-[#42544e]/70">Including assembly details and structural analysis</p>
                </div>
              </div>
            ) : (
              /* Interactive Three.js Scene */
              <ThreeJSPackaging
                dimensions={{ width, height, depth }}
                materialSpec={materialSpec}
                onRotate={() => console.log('Rotate clicked')}
                onExplode={() => console.log('Explode clicked')}
              />
            )}
          </div>
          
          {/* Additional Controls Panel */}
          {isComplete && (
            <div className="bg-[#f0fff5] px-6 py-4 border-t border-[#c3d6cd]/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#c3d6cd] text-[#279366] rounded-lg text-sm hover:bg-[#e7ffef] transition-colors">
                    <span className="material-symbols-outlined text-sm">palette</span>
                    Materials
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#c3d6cd] text-[#279366] rounded-lg text-sm hover:bg-[#e7ffef] transition-colors">
                    <span className="material-symbols-outlined text-sm">download</span>
                    Export STL
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#c3d6cd] text-[#279366] rounded-lg text-sm hover:bg-[#e7ffef] transition-colors">
                    <span className="material-symbols-outlined text-sm">screenshot</span>
                    Capture View
                  </button>
                </div>
                
                <div className="text-xs text-[#42544e]">
                  Interactive Three.js • Real-time rendering
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Technical Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Specifications */}
          <div className="bg-white rounded-xl shadow-sm border border-[#c3d6cd]/30 p-6">
            <h3 className="text-lg font-semibold text-[#112d21] mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Technical Specifications
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#42544e]">Core Board</span>
                <span className="text-sm font-medium text-[#112d21]">1200gsm ESKA</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#42544e]">Liner Paper</span>
                <span className="text-sm font-medium text-[#112d21]">120gsm Art Paper</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#42544e]">Adhesive</span>
                <span className="text-sm font-medium text-[#112d21]">EVA Animal Glue</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#42544e]">Surface Finish</span>
                <span className="text-sm font-medium text-[#112d21]">Matte Premium</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#42544e]">Closure Type</span>
                <span className="text-sm font-medium text-[#112d21]">Magnetic</span>
              </div>
            </div>
          </div>
          
          {/* Render Info */}
          <div className="bg-[#26433a] text-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Render Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Render Engine</span>
                <span className="text-sm font-medium text-[#b2ffd7]">Three.js WebGL</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Polygons</span>
                <span className="text-sm font-medium text-[#b2ffd7]">Real-time</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Quality</span>
                <span className="text-sm font-medium text-[#b2ffd7]">Interactive 3D</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Features</span>
                <span className="text-sm font-medium text-[#b2ffd7]">Orbit + Explode</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Performance</span>
                <span className="text-sm font-medium text-[#b2ffd7]">60 FPS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes rotate3d {
          0%, 100% { transform: rotateX(15deg) rotateY(-15deg); }
          25% { transform: rotateX(15deg) rotateY(15deg); }
          50% { transform: rotateX(-15deg) rotateY(15deg); }
          75% { transform: rotateX(-15deg) rotateY(-15deg); }
        }
      `}</style>
    </div>
  )
}

export default function ThreeDRenderDemo() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-[#f8fcfa] to-[#f0fff5]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#279366] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm text-[#42544e]">Loading 3D Render...</p>
        </div>
      </div>
    }>
      <ThreeDRenderContent />
    </Suspense>
  )
}