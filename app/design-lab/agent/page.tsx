"use client"

import DesignLabSidebar from "@/components/DesignLabSidebar"
import { useChatStore } from "@/lib/chat-store"
import {
  Calculator,
  Layers,
  Layout,
  PencilRuler,
  Save,
  Send,
  Sparkles,
  Zap,
  Menu,
  ChevronRight,
  Maximize2,
  Box,
} from "lucide-react"
import Head from "next/head"
import { useState } from "react"

export default function AgentDefinePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { chatHistory, setChatHistory } = useChatStore()

  const [dimensions, setDimensions] = useState({
    length: 12.5,
    width: 8.0,
    depth: 4.5,
    unit: "in",
  })

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div
        className="font-body flex h-dvh w-full items-stretch overflow-hidden bg-[#fcf9f8] text-[#1c1b1b]"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <DesignLabSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentPage="define"
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
        />

        {/* Main Content */}
        <div className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-white">
          {/* Header Section */}
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#e6e3e2]/50 bg-white px-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <span className="text-sm text-gray-500 truncate" style={{ fontFamily: "Inter, sans-serif" }}>
                  Design Definition v1.0
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
               <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100">
                  <Save className="h-4 w-4" />
                  <span className="hidden sm:inline">Save Project</span>
               </button>
               <button className="flex items-center gap-2 rounded-lg bg-[#0d9c69] px-3 py-1.5 text-sm font-bold text-white transition-colors hover:bg-[#0a8659]">
                  <Zap className="h-4 w-4 fill-current" />
                  <span>Execute Agent</span>
               </button>
            </div>
          </div>

          {/* Editor Content */}
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <div className="mx-auto max-w-7xl px-6 py-12 md:px-12">
                <header className="mb-12">
                  <h1 className="mb-2 text-3xl font-extrabold tracking-tighter text-[#171d19] md:text-5xl" style={{ fontFamily: "Manrope, sans-serif" }}>
                    Packaging Blueprint
                  </h1>
                  <p className="max-w-2xl text-base text-[#3d4a42] md:text-lg" style={{ fontFamily: "Inter, sans-serif" }}>
                    Define structural parameters and material constraints for our Assistant Agent to analyze and optimize.
                  </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                  {/* Parameter Column */}
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase">Packaging Archetype</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {["Mailer Box", "Tuck Top", "RSC", "Sleeve"].map((type) => (
                          <button key={type} className={`rounded-xl border p-4 text-left transition-all ${type === "Mailer Box" ? "border-emerald-500 bg-emerald-50" : "border-gray-100 bg-white hover:border-gray-200"}`}>
                            <Box className={`mb-3 h-6 w-6 ${type === "Mailer Box" ? "text-emerald-500" : "text-gray-300"}`} />
                            <span className={`block text-sm font-bold ${type === "Mailer Box" ? "text-emerald-900" : "text-gray-700"}`}>{type}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase">Dimensional Specs</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {/* Static inputs for now to match dummy style */}
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase">Length</label>
                          <input type="text" value={dimensions.length} readOnly className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 text-sm font-bold" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase">Width</label>
                          <input type="text" value={dimensions.width} readOnly className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 text-sm font-bold" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-gray-500 uppercase">Depth</label>
                          <input type="text" value={dimensions.depth} readOnly className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 text-sm font-bold" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                       <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase">Agent Instruction</h3>
                       <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-6">
                          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                             <Sparkles className="h-5 w-5" />
                          </div>
                          <p className="text-sm font-medium text-emerald-900">
                             "Optimize for maximum pallet efficiency while maintaining crush resistance for cross-border shipping."
                          </p>
                       </div>
                    </div>
                  </div>

                  {/* Preview Column */}
                  <div className="relative aspect-square md:aspect-auto rounded-2xl bg-gray-100 p-8 flex flex-col items-center justify-center border border-gray-200 overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#0d9c69 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                    <div className="relative text-center">
                       <PencilRuler className="h-24 w-24 mx-auto mb-6 text-gray-300 opacity-50" />
                       <h4 className="text-xl font-bold text-gray-400" style={{ fontFamily: "Manrope, sans-serif" }}>Dieline Preview</h4>
                       <p className="text-sm text-gray-400 mt-2">Visualizer module initializing...</p>
                    </div>
                    
                    <button className="absolute bottom-6 right-6 flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-bold shadow-sm border border-gray-200 text-gray-600 hover:bg-gray-50">
                       <Maximize2 className="h-4 w-4" />
                       View in 3D
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
