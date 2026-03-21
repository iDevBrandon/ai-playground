"use client"

import DocumentList from "@/src/components/DocumentList"
import FileUpload from "@/src/components/FileUpload"
import DesignLabSidebar from "@/src/components/DesignLabSidebar"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import {
  BarChart,
  Calculator,
  CheckCircle2,
  Eye,
  Folder,
  Menu,
  Paperclip,
  Send,
  Settings,
  ShoppingCart,
  TestTube,
  X,
} from "lucide-react"
import Head from "next/head"
import { useEffect, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"

export default function DesignLabPage() {
  const [userMessage, setUserMessage] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [droppedFiles, setDroppedFiles] = useState<File[]>([])
  const [refreshDocuments, setRefreshDocuments] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // For demo purposes - generate unique ID per session
  const [userId] = useState(() => crypto.randomUUID())
  const [selectedDocumentId, setSelectedDocumentId] = useState<
    string | undefined
  >(undefined)
  const [temperature, setTemperature] = useState(0.4)
  const [tokenLimit, setTokenLimit] = useState(2048)
  const [currentFlow, setCurrentFlow] = useState<string | null>(null)
  const [flowData, setFlowData] = useState<any>(null)
  const [showPackagingSpec, setShowPackagingSpec] = useState(false)
  const [showOptionsSelection, setShowOptionsSelection] = useState(false)
  const [showOrderGeneration, setShowOrderGeneration] = useState(false)
  const [show3DRender, setShow3DRender] = useState(false)
  const [chatHistory, setChatHistory] = useState([
    "PakFactory AI interface",
    "Packaging Design Consultation",
  ])
  const [currentChatIndex, setCurrentChatIndex] = useState(0)

  // Use AI SDK for RAG chat - following the pattern in ChatInterface.tsx
  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        documentId: selectedDocumentId,
      },
    }),
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hello! I'm your AI packaging consultant. How can I help you with your project today? You can ask me about materials, sustainability, or upload your own documents for analysis.",
      },
    ],
  } as any)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])


  // Intelligent Flow Detection
  const detectUserIntent = (message: string): string | null => {
    const lowerMessage = message.toLowerCase()

    if (
      lowerMessage.includes("design") &&
      (lowerMessage.includes("box") || lowerMessage.includes("packaging"))
    ) {
      return "PACKAGING_DESIGN_REQUEST"
    }
    if (
      lowerMessage.includes("quote") ||
      lowerMessage.includes("order") ||
      lowerMessage.includes("purchase")
    ) {
      return "ORDER_REQUEST"
    }
    if (
      lowerMessage.includes("material") ||
      lowerMessage.includes("specification")
    ) {
      return "MATERIAL_ANALYSIS"
    }
    return null
  }

  // Add LLM Response to Chat
  const addLLMResponse = (content: string) => {
    if (typeof sendMessage === "function") {
      // Simulate AI response by adding directly to chat
      const aiMessage = {
        id: crypto.randomUUID(),
        role: "assistant" as const,
        content: content,
      }
      // Note: In a real implementation, this would be handled by the sendMessage callback
    }
  }

  // Simulate RAG Processing and Auto-Generate UI
  const processIntelligentFlow = async (intent: string, message: string) => {
    setCurrentFlow(intent)

    // Simulate RAG search delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    switch (intent) {
      case "PACKAGING_DESIGN_REQUEST":
        // Extract dimensions from message
        const dimensions = message.match(/(\d+)x(\d+)/i)
        const sizeInfo = dimensions
          ? { width: dimensions[1], height: dimensions[2] }
          : { width: "12", height: "10" }

        setFlowData({
          type: "rigid_box",
          dimensions: sizeInfo,
          material: "ESKA Board",
          thickness: "1200gsm",
        })
        setShowPackagingSpec(true)

        // Add LLM explanation of generated spec
        setTimeout(() => {
          if (typeof sendMessage === "function") {
            sendMessage({
              text: `Perfect! I've analyzed your request for a ${sizeInfo.width}x${sizeInfo.height} rigid box and generated a complete packaging specification based on ASTM-D6400 standards.

**Generated Specification:**
- Material: 1200gsm ESKA core board with 120gsm art paper liner
- Adhesive: EVA animal glue for premium bonding
- Estimated cost: $2.45 per unit (1000 qty)
- Setup fee: $850

The specification meets all structural requirements for rigid packaging. Would you like me to request a 3D render to visualize the final product?`,
            })
          }
        }, 500)

        // Auto-trigger 3D render request
        setTimeout(() => {
          if (typeof sendMessage === "function") {
            sendMessage({
              text: `I'm now requesting a 3D render of your ${sizeInfo.width}x${sizeInfo.height} rigid box to help you visualize the final product. The render will show the box structure, material finish, and assembly details.

**3D Render Request Submitted:**
- Dimensions: ${sizeInfo.width}" x ${sizeInfo.height}" x 4" (standard depth)
- Material finish: Matte with premium liner
- Perspective: Isometric view with assembly breakdown

The render should be ready in 5-10 minutes. In the meantime, let me show you the available customization options...`,
            })
          }
        }, 1500)

        // Auto-trigger options after spec generation
        setTimeout(() => {
          setShowOptionsSelection(true)
        }, 3000)
        break

      case "ORDER_REQUEST":
        setShowOrderGeneration(true)
        break
    }
  }

  const handleNewSpecification = () => {
    // Reset the current flow and UI state for a fresh start
    setCurrentFlow(null)
    setFlowData(null)
    setShowPackagingSpec(false)
    setShowOptionsSelection(false)
    setShowOrderGeneration(false)
    setShow3DRender(false)
    setUserMessage("")
  }


  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const file = files[0]

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/markdown",
        "text/plain",
      ]
      if (!allowedTypes.includes(file.type)) {
        alert(
          "File type not supported. Supported formats: PDF, DOC, DOCX, MD, TXT"
        )
        return
      }

      // Validate file size (1MB limit)
      if (file.size > 1024 * 1024) {
        alert("File too large. Maximum size: 1MB")
        return
      }

      // For now, just show a message that file was selected
      if (typeof sendMessage === "function") {
        sendMessage({
          text: `I've selected the file "${file.name}" for analysis. Please analyze this document.`,
        })
      }
    }

    // Reset file input
    event.target.value = ""
  }

  const handleSendMessage = () => {
    if (!userMessage.trim()) return

    // Detect user intent for intelligent flow
    const intent = detectUserIntent(userMessage)
    if (intent) {
      processIntelligentFlow(intent, userMessage)
    }

    // In this version of the SDK, we use sendMessage
    if (typeof sendMessage === "function") {
      sendMessage({ text: userMessage })
    }

    setUserMessage("")
  }

  const handleUploadComplete = (
    files: { id: string; url: string; title: string }[]
  ) => {
    setRefreshDocuments((prev) => prev + 1)
    setShowUpload(false)

    // Select the first uploaded document for context if none selected
    if (files.length > 0 && !selectedDocumentId) {
      setSelectedDocumentId(files[0].id)
    }

    if (typeof sendMessage === "function") {
      sendMessage({
        text: `I've uploaded ${files.length} document(s). Please analyze them.`,
      })
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles, rejectedFiles) => {
      // If we're already in upload mode, ignore global drops
      if (showUpload) return

      // Show warning for rejected files
      if (rejectedFiles.length > 0) {
        const rejectedFile = rejectedFiles[0].file
        const error = rejectedFiles[0].errors[0]

        if (error.code === "file-invalid-type") {
          alert(
            `File type not supported: ${rejectedFile.name}\n\nSupported formats: PDF, DOC, DOCX, MD, TXT`
          )
        } else if (error.code === "file-too-large") {
          alert(`File too large: ${rejectedFile.name}\n\nMaximum size: 1MB`)
        } else {
          alert(`Upload error: ${error.message}`)
        }
        return
      }

      if (acceptedFiles.length > 0) {
        setDroppedFiles(acceptedFiles)
        setShowUpload(true)
      }
    },
    noClick: true,
    noKeyboard: true,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/markdown": [".md"],
      "text/plain": [".txt"],
    },
  })

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <style>{`
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          }
          .rag-loader {
            display: inline-flex;
            gap: 4px;
          }
          .rag-dot {
            width: 4px;
            height: 4px;
            background-color: #279366;
            border-radius: 50%;
          }
          .ai-pulse-ring {
            position: relative;
          }
          .ai-pulse-ring::after {
            content: '';
            position: absolute;
            inset: -4px;
            border-radius: 9999px;
            border: 2px solid #36B37E;
            opacity: 0.5;
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          @keyframes pulse {
            0%, 100% {
              opacity: 0.5;
            }
            50% {
              opacity: 0.8;
            }
          }
        `}</style>
      </Head>
      <div
        className="font-body flex h-dvh w-full items-stretch overflow-hidden bg-[#fcf9f8] text-[#1c1b1b]"
        style={{
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Mobile overlay */}
        {(sidebarOpen || rightSidebarOpen) && (
          <div
            className="bg-opacity-50 fixed inset-0 z-40 bg-black lg:hidden"
            onClick={() => {
              setSidebarOpen(false)
              setRightSidebarOpen(false)
            }}
          />
        )}

        <DesignLabSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentPage="home"
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          onNewSpecification={handleNewSpecification}
          onChatSelect={setCurrentChatIndex}
          currentChatIndex={currentChatIndex}
        />

        {/* Main Content */}
        <div
          {...getRootProps()}
          className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-white"
        >
          <input
            {...getInputProps()}
            className="pointer-events-none absolute opacity-0"
          />

          {/* Dropzone Overlay */}
          {isDragActive && (
            <div className="absolute inset-0 z-100 flex animate-in items-center justify-center bg-primary/20 backdrop-blur-sm transition-all duration-300 fade-in">
              <div className="scale-110 transform rounded-2xl bg-surface-container-highest p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                  <svg
                    className="h-8 w-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <h3 className="text-on-surface mb-2 text-xl font-bold">
                  Drop to Upload
                </h3>
                <p className="text-on-surface-variant">
                  Release to analyze your document
                </p>
              </div>
            </div>
          )}

          {/* Header Section - ChatGPT Style */}
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#e6e3e2]/50 bg-[#ffffff] px-4">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-3">
                <span
                  className="text-sm text-gray-500"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {chatHistory[currentChatIndex] || "Design Lab"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Model indicator - ChatGPT style */}
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span
                  className="text-gray-700"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  System Status
                </span>
              </div>

              {/* Mobile analysis panel toggle */}
              <button
                onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
                className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:hidden"
              >
                <BarChart className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          <div className="flex min-h-0 flex-1 overflow-hidden">
            {/* Chat Area */}
            <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-[#fcf9f8]">
              {/* Messages */}
              <div className="flex-1 space-y-6 overflow-y-auto p-6 lg:space-y-8 lg:p-8">
                {/* Initial Greeting (Always Visible) */}
                <div className="flex gap-4 lg:gap-6">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0d9c69] lg:h-10 lg:w-10">
                    <span className="text-sm text-white lg:text-base">🤖</span>
                  </div>

                  <div className="flex max-w-xs flex-col gap-4 sm:max-w-md lg:max-w-2xl">
                    {/* AI Message with Border Accent */}
                    <div className="rounded-xl rounded-tl-none border-l-4 border-[#0d9c69] bg-white p-6 shadow-sm">
                      <p
                        className="text-base leading-relaxed font-medium text-[#112d21]"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Hello! I'm your AI packaging consultant. How can I help
                        you with your project today? You can ask me about
                        materials, sustainability, or upload your own documents
                        for analysis.
                      </p>

                      {/* Status Indicator */}
                      <div className="mt-4 flex items-center justify-between border-t border-[#c3d6cd]/20 pt-4">
                        <div className="flex items-center gap-3">
                          <div className="rag-loader">
                            <div className="rag-dot animate-bounce"></div>
                            <div
                              className="rag-dot animate-bounce"
                              style={{ animationDelay: "-0.15s" }}
                            ></div>
                            <div
                              className="rag-dot animate-bounce"
                              style={{ animationDelay: "-0.3s" }}
                            ></div>
                          </div>
                          <span
                            className="text-[10px] font-bold tracking-tight text-[#0d9c69] uppercase"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            Ready for Analysis
                          </span>
                        </div>
                        <span
                          className="text-[10px] font-medium text-[#42544e]"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          Source: Industrial-RAG-v4
                        </span>
                      </div>
                    </div>

                    {/* Technical Bento Cards */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {/* Quick Actions Card */}
                      <div className="rounded-xl bg-[#e7ffef] p-4">
                        <h3
                          className="mb-3 text-sm font-semibold text-[#112d21]"
                          style={{ fontFamily: "Manrope, sans-serif" }}
                        >
                          Quick Actions
                        </h3>
                        <ul className="space-y-2">
                          <li className="flex items-center justify-between text-xs">
                            <span
                              className="text-[#42544e]"
                              style={{ fontFamily: "Inter, sans-serif" }}
                            >
                              Material Analysis
                            </span>
                            <TestTube className="h-4 w-4 text-[#0d9c69]" />
                          </li>
                          <li className="flex items-center justify-between text-xs">
                            <span
                              className="text-[#42544e]"
                              style={{ fontFamily: "Inter, sans-serif" }}
                            >
                              Cost Estimation
                            </span>
                            <Calculator className="h-4 w-4 text-[#0d9c69]" />
                          </li>
                          <li className="flex items-center justify-between text-xs">
                            <span
                              className="text-[#42544e]"
                              style={{ fontFamily: "Inter, sans-serif" }}
                            >
                              Design Validation
                            </span>
                            <CheckCircle2 className="h-4 w-4 text-[#0d9c69]" />
                          </li>
                        </ul>
                      </div>

                      {/* Status Card */}
                      <div className="rounded-xl bg-[#26433a] p-4 text-white">
                        <div className="flex h-full items-center justify-center">
                          <div className="text-center">
                            <div
                              className="text-2xl font-bold text-[#b2ffd7]"
                              style={{ fontFamily: "Manrope, sans-serif" }}
                            >
                              100%
                            </div>
                            <div
                              className="text-xs text-gray-300"
                              style={{ fontFamily: "Inter, sans-serif" }}
                            >
                              Ready
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat History */}
                {messages
                  .filter((m: any) => m.id !== "welcome")
                  .map((message: any) => (
                    <div
                      key={message.id}
                      className={`flex gap-4 lg:gap-6 ${message.role === "user" ? "justify-end" : ""}`}
                    >
                      {message.role !== "user" && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0d9c69] lg:h-10 lg:w-10">
                          <span className="text-sm text-white lg:text-base">
                            🤖
                          </span>
                        </div>
                      )}

                      <div
                        className={`max-w-xs sm:max-w-md lg:max-w-2xl ${message.role === "user" ? "text-white" : "text-[#112d21]"} rounded-2xl ${message.role === "user" ? "p-4 lg:p-6" : "border-l-4 border-[#0d9c69] p-6 shadow-sm"}`}
                        style={
                          message.role === "user"
                            ? { backgroundColor: "#279366" }
                            : { backgroundColor: "white" }
                        }
                      >
                        <div className="text-base whitespace-pre-wrap lg:text-lg">
                          {(message as any).content ||
                            (message as any).text ||
                            (Array.isArray((message as any).parts)
                              ? (message as any).parts
                                  .filter((p: any) => p.type === "text")
                                  .map((p: any) => p.text)
                                  .join("")
                              : JSON.stringify(message))}
                        </div>
                      </div>

                      {message.role === "user" && (
                        <div className="h-8 w-8 shrink-0 rounded-full bg-primary lg:h-10 lg:w-10"></div>
                      )}
                    </div>
                  ))}
                <div ref={messagesEndRef} />

                {/* Intelligent Flow Components */}
                {currentFlow && (
                  <div className="mb-6 px-6 lg:px-8">
                    <div className="mx-auto max-w-5xl">
                      {/* RAG Processing Indicator */}
                      {currentFlow && !showPackagingSpec && (
                        <div className="mb-4 rounded-xl border-l-4 border-[#0d9c69] bg-white p-6 shadow-sm">
                          <div className="mb-4 flex items-center gap-3">
                            <div className="rag-loader">
                              <div className="rag-dot animate-bounce"></div>
                              <div
                                className="rag-dot animate-bounce"
                                style={{ animationDelay: "-0.15s" }}
                              ></div>
                              <div
                                className="rag-dot animate-bounce"
                                style={{ animationDelay: "-0.3s" }}
                              ></div>
                            </div>
                            <span
                              className="text-sm font-medium text-[#0d9c69]"
                              style={{ fontFamily: "Inter, sans-serif" }}
                            >
                              Analyzing rigid board standards and generating
                              specification...
                            </span>
                          </div>
                          <p
                            className="text-xs text-[#42544e]"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            Source: ASTM-D6400, Industrial Database
                          </p>
                        </div>
                      )}

                      {/* Auto-Generated Packaging Specification */}
                      {showPackagingSpec && flowData && (
                        <div className="mb-4 rounded-xl border-l-4 border-[#0d9c69] bg-white p-6 shadow-sm">
                          <div className="mb-4 flex items-center justify-between">
                            <h3
                              className="text-lg font-semibold text-[#112d21]"
                              style={{ fontFamily: "Manrope, sans-serif" }}
                            >
                              Generated Specification:{" "}
                              {flowData.dimensions.width}x
                              {flowData.dimensions.height} Rigid Box
                            </h3>
                            <button
                              onClick={() => {
                                setShow3DRender(true)
                                // Create material spec based on generated packaging data
                                const materialSpec = {
                                  coreBoard: {
                                    type: "ESKA Core Board",
                                    weight: "1200gsm",
                                    color: "#8B4513",
                                    roughness: 0.8,
                                    metalness: 0.1,
                                  },
                                  liner: {
                                    type: "Art Paper",
                                    weight: "120gsm",
                                    color: "#F5F5DC",
                                    roughness: 0.4,
                                    metalness: 0.0,
                                  },
                                  adhesive: {
                                    type: "EVA Animal Glue",
                                    color: "#E0E0E0",
                                  },
                                  finish: {
                                    type: "Matte Premium",
                                    color: "#2FAB73",
                                    roughness: 0.3,
                                    metalness: 0.1,
                                  },
                                }

                                // Pass specs via URL parameters
                                const params = new URLSearchParams({
                                  width: flowData?.dimensions?.width || "12",
                                  height: flowData?.dimensions?.height || "10",
                                  depth: "4",
                                  materialSpec: JSON.stringify(materialSpec),
                                })

                                window.open(
                                  `/3d-render?${params.toString()}`,
                                  "_blank"
                                )
                              }}
                              className="flex items-center gap-2 rounded-lg bg-[#0d9c69] px-4 py-2 text-sm text-white hover:opacity-90"
                            >
                              <span>📦</span>
                              Request 3D Render
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Technical Specs */}
                            <div className="rounded-xl bg-[#e7ffef] p-4">
                              <h4
                                className="mb-3 text-sm font-semibold text-[#112d21]"
                                style={{ fontFamily: "Manrope, sans-serif" }}
                              >
                                Material Stack
                              </h4>
                              <ul className="space-y-2">
                                <li className="flex items-center justify-between text-xs">
                                  <span
                                    className="text-[#42544e]"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                  >
                                    Core Board
                                  </span>
                                  <span
                                    className="font-bold text-[#112d21]"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                  >
                                    1200gsm ESKA
                                  </span>
                                </li>
                                <li className="flex items-center justify-between text-xs">
                                  <span
                                    className="text-[#42544e]"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                  >
                                    Liner
                                  </span>
                                  <span
                                    className="font-bold text-[#112d21]"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                  >
                                    120gsm Art Paper
                                  </span>
                                </li>
                                <li className="flex items-center justify-between text-xs">
                                  <span
                                    className="text-[#42544e]"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                  >
                                    Adhesive
                                  </span>
                                  <span
                                    className="font-bold text-[#112d21]"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                  >
                                    EVA Animal Glue
                                  </span>
                                </li>
                              </ul>
                            </div>

                            {/* Cost Analysis */}
                            <div className="rounded-xl bg-[#26433a] p-4 text-white">
                              <h4
                                className="mb-3 text-sm font-semibold"
                                style={{ fontFamily: "Manrope, sans-serif" }}
                              >
                                Cost Estimate
                              </h4>
                              <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                  <span
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                  >
                                    Unit Cost
                                  </span>
                                  <span
                                    className="text-[#b2ffd7]"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                  >
                                    $2.45
                                  </span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                  >
                                    Setup Fee
                                  </span>
                                  <span
                                    className="text-[#b2ffd7]"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                  >
                                    $850
                                  </span>
                                </div>
                                <div className="flex justify-between border-t border-white/20 pt-2 text-sm font-bold">
                                  <span
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                  >
                                    1000 units
                                  </span>
                                  <span
                                    className="text-[#b2ffd7]"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                  >
                                    $3,300
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 3D Render Card */}
                      {show3DRender && (
                        <div className="mb-4 rounded-xl border-l-4 border-[#0d9c69] bg-white p-6 shadow-sm">
                          <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-[#0d9c69] p-3">
                              <span className="text-xl text-white">📦</span>
                            </div>
                            <div className="flex-1">
                              <h3
                                className="mb-1 text-lg font-semibold text-[#112d21]"
                                style={{ fontFamily: "Manrope, sans-serif" }}
                              >
                                3D Render Generated
                              </h3>
                              <p
                                className="mb-3 text-sm text-[#42544e]"
                                style={{ fontFamily: "Inter, sans-serif" }}
                              >
                                Your 3D visualization is ready! View the
                                interactive CAD-grade render with material
                                textures and assembly details.
                              </p>
                              <div className="flex items-center gap-3">
                                <a
                                  href="/3d-render"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 rounded-lg bg-[#0d9c69] px-4 py-2 text-sm text-white transition-colors hover:opacity-90"
                                >
                                  <Eye className="h-4 w-4" />
                                  View 3D Render
                                </a>
                                <div
                                  className="text-xs text-[#42544e]"
                                  style={{ fontFamily: "Inter, sans-serif" }}
                                >
                                  ✓ Rendered in 4.2s • CAD-grade accuracy
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Auto-Generated Options Selection */}
                      {showOptionsSelection && (
                        <div className="mb-4 rounded-xl border-l-4 border-[#0d9c69] bg-white p-6 shadow-sm">
                          <h3
                            className="mb-4 text-lg font-semibold text-[#112d21]"
                            style={{ fontFamily: "Manrope, sans-serif" }}
                          >
                            Select Your Options
                          </h3>

                          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                            {/* Material Options */}
                            <div className="space-y-3">
                              <h4
                                className="text-sm font-medium text-[#42544e]"
                                style={{ fontFamily: "Inter, sans-serif" }}
                              >
                                Material Grade
                              </h4>
                              {[
                                {
                                  name: "Standard ESKA",
                                  price: "$2.45",
                                  selected: true,
                                },
                                {
                                  name: "Premium Board",
                                  price: "$3.20",
                                  selected: false,
                                },
                                {
                                  name: "Eco-Friendly",
                                  price: "$2.85",
                                  selected: false,
                                },
                              ].map((option, i) => (
                                <div
                                  key={i}
                                  className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${
                                    option.selected
                                      ? "border-[#0d9c69] bg-[#daffea]"
                                      : "border-[#c3d6cd] hover:border-[#0d9c69]"
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span
                                      className="text-sm font-medium"
                                      style={{
                                        fontFamily: "Inter, sans-serif",
                                      }}
                                    >
                                      {option.name}
                                    </span>
                                    <span
                                      className="text-sm text-[#0d9c69]"
                                      style={{
                                        fontFamily: "Inter, sans-serif",
                                      }}
                                    >
                                      {option.price}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Quantity */}
                            <div className="space-y-3">
                              <h4
                                className="text-sm font-medium text-[#42544e]"
                                style={{ fontFamily: "Inter, sans-serif" }}
                              >
                                Quantity
                              </h4>
                              {["500 units", "1000 units", "2500 units"].map(
                                (qty, i) => (
                                  <div
                                    key={i}
                                    className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${
                                      i === 1
                                        ? "border-[#0d9c69] bg-[#daffea]"
                                        : "border-[#c3d6cd] hover:border-[#0d9c69]"
                                    }`}
                                  >
                                    <span
                                      className="text-sm font-medium"
                                      style={{
                                        fontFamily: "Inter, sans-serif",
                                      }}
                                    >
                                      {qty}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>

                            {/* Finishing */}
                            <div className="space-y-3">
                              <h4
                                className="text-sm font-medium text-[#42544e]"
                                style={{ fontFamily: "Inter, sans-serif" }}
                              >
                                Finishing
                              </h4>
                              {[
                                "Matte Finish",
                                "Gloss Coating",
                                "Soft Touch",
                              ].map((finish, i) => (
                                <div
                                  key={i}
                                  className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${
                                    i === 0
                                      ? "border-[#0d9c69] bg-[#daffea]"
                                      : "border-[#c3d6cd] hover:border-[#0d9c69]"
                                  }`}
                                >
                                  <span
                                    className="text-sm font-medium"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                  >
                                    {finish}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between border-t border-[#c3d6cd]/30 pt-4">
                            <div
                              className="text-sm text-[#42544e]"
                              style={{ fontFamily: "Inter, sans-serif" }}
                            >
                              Updated Total:{" "}
                              <span className="font-bold text-[#0d9c69]">
                                $3,300
                              </span>
                            </div>
                            <button
                              onClick={() => setShowOrderGeneration(true)}
                              className="flex items-center gap-2 rounded-lg bg-[#0d9c69] px-6 py-3 font-medium text-white transition-all hover:opacity-90"
                            >
                              <ShoppingCart className="h-4 w-4" />
                              Approve & Generate Quote
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Auto-Generated Order/Quote */}
                      {showOrderGeneration && (
                        <div className="rounded-xl bg-gradient-to-r from-[#279366] to-[#36B37E] p-6 text-white shadow-lg">
                          <div className="mb-4 flex items-center gap-3">
                            <CheckCircle2 className="h-6 w-6" />
                            <div>
                              <h3
                                className="text-xl font-bold"
                                style={{ fontFamily: "Manrope, sans-serif" }}
                              >
                                Quote Generated Successfully!
                              </h3>
                              <p
                                className="text-sm opacity-90"
                                style={{ fontFamily: "Inter, sans-serif" }}
                              >
                                Quote #PF-2024-0156 • Valid for 30 days
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="rounded-lg bg-white/10 p-4">
                              <h4
                                className="mb-2 font-medium"
                                style={{ fontFamily: "Inter, sans-serif" }}
                              >
                                Next Steps
                              </h4>
                              <ul className="space-y-1 text-sm opacity-90">
                                <li style={{ fontFamily: "Inter, sans-serif" }}>
                                  ✓ Quote sent to your email
                                </li>
                                <li style={{ fontFamily: "Inter, sans-serif" }}>
                                  ✓ Shopify integration ready
                                </li>
                                <li style={{ fontFamily: "Inter, sans-serif" }}>
                                  ✓ Production slot reserved
                                </li>
                              </ul>
                            </div>

                            <div className="rounded-lg bg-white/10 p-4">
                              <h4
                                className="mb-2 font-medium"
                                style={{ fontFamily: "Inter, sans-serif" }}
                              >
                                Quick Actions
                              </h4>
                              <div className="space-y-2">
                                <button className="w-full rounded-lg bg-white py-2 text-sm font-medium text-[#0d9c69]">
                                  Add to Shopify Store
                                </button>
                                <button className="w-full rounded-lg bg-white/20 py-2 text-sm backdrop-blur">
                                  Export to Zoho CRM
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="pb-[env(safe-area-inset-bottom)]">
                {/* Upload Mode */}
                {showUpload ? (
                  <div className="bg-surface-container p-6 lg:p-8">
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="text-on-surface text-lg font-semibold">
                        Upload Document
                      </h3>
                      <button
                        onClick={() => setShowUpload(false)}
                        className="hover:text-on-surface rounded-md p-2 text-on-surface-variant hover:bg-surface-container-high"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <FileUpload
                      userId={userId}
                      onUploadComplete={handleUploadComplete}
                      maxFiles={1}
                      initialFiles={droppedFiles}
                    />
                  </div>
                ) : (
                  /* Chat Mode */
                  <div className="border-t border-[#e6e3e2]/20 bg-[#fcf9f8] p-6 lg:p-8">
                    <div className="relative mx-auto max-w-4xl">
                      <div className="flex items-end overflow-hidden rounded-xl border border-[#c3d6cd]/30 bg-white shadow-lg">
                        <div className="flex-1 p-4">
                          <input
                            type="text"
                            value={userMessage}
                            onChange={(e) => setUserMessage(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleSendMessage()
                            }
                            placeholder="Add technical constraints or ask for alternatives..."
                            className="h-12 w-full resize-none border-none bg-transparent text-sm text-[#112d21] placeholder-[#42544e]/70 focus:ring-0 focus:outline-none"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          />
                        </div>
                        <div className="flex items-center gap-2 p-3">
                          <button
                            onClick={handleFileUpload}
                            className="p-2 text-[#42544e] transition-colors hover:text-[#0d9c69]"
                            title="Upload document"
                          >
                            <Paperclip className="h-4 w-4" />
                          </button>
                          {/* Hidden file input */}
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx,.md,.txt"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                          <button
                            onClick={handleSendMessage}
                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0d9c69] text-white transition-all hover:opacity-90"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Quick Action Tags */}
                      <div className="mt-3 flex gap-4 px-1">
                        <button
                          onClick={() =>
                            setUserMessage(
                              "Suggest eco-friendly materials for my packaging"
                            )
                          }
                          className="text-[10px] font-bold tracking-tighter text-[#42544e] uppercase transition-colors hover:text-[#0d9c69]"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          #Suggest-Eco-Materials
                        </button>
                        <button
                          onClick={() =>
                            setUserMessage(
                              "Calculate unit cost for my packaging"
                            )
                          }
                          className="text-[10px] font-bold tracking-tighter text-[#42544e] uppercase transition-colors hover:text-[#0d9c69]"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          #Calculate-unit
                        </button>
                        <button
                          onClick={() =>
                            setUserMessage("Show me my order history")
                          }
                          className="text-[10px] font-bold tracking-tighter text-[#42544e] uppercase transition-colors hover:text-[#0d9c69]"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          #Order-History
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar - Technical Analysis */}
            <div
              className={`fixed inset-y-0 right-0 z-50 flex w-80 transform flex-col bg-[#f0fff5] transition-transform duration-300 ease-in-out lg:relative lg:z-auto lg:w-80 ${
                rightSidebarOpen
                  ? "translate-x-0"
                  : "translate-x-full lg:translate-x-0"
              }`}
            >
              {/* Technical Analysis */}
              <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                {/* Mobile close button */}
                <div className="mb-6 flex items-center justify-between lg:mb-0">
                  <div></div>
                  <button
                    onClick={() => setRightSidebarOpen(false)}
                    className="rounded-md p-2 text-on-surface-variant hover:bg-surface-container hover:text-primary lg:hidden"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-6 flex items-center gap-3">
                  <Settings className="h-5 w-5 text-[#0d9c69]" />
                  <h3
                    className="text-sm font-semibold text-[#42544e] lg:text-base"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    VERSION HISTORY
                  </h3>
                </div>

                {/* Version History */}
                <div className="mb-8 lg:mb-10">
                  <div className="space-y-4">
                    {/* History Item 1 */}
                    <div className="group cursor-pointer rounded-lg bg-[#e7ffef] p-4 transition-all hover:bg-[#daffea]">
                      <div className="mb-2 flex items-start justify-between">
                        <span
                          className="text-[10px] font-bold text-[#42544e]"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          V2.4 • TODAY
                        </span>
                        <span className="text-xs text-[#0d9c69]">✓</span>
                      </div>
                      <p
                        className="text-xs leading-snug font-bold text-[#112d21]"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Rigid Magnetic Closure
                      </p>
                      <p
                        className="mt-1 text-[10px] text-[#42544e]"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        12 x 10 x 4 in
                      </p>
                    </div>

                    {/* History Item 2 */}
                    <div className="group cursor-pointer bg-surface-container-high p-4 transition-all hover:bg-surface-container">
                      <div className="mb-2 flex items-start justify-between">
                        <span className="text-[10px] font-bold text-on-surface-variant">
                          V1.9 • 2 DAYS AGO
                        </span>
                      </div>
                      <p className="text-on-surface text-xs leading-snug font-bold">
                        Corrugated Shipper
                      </p>
                      <p className="mt-1 text-[10px] text-on-surface-variant">
                        24 x 24 x 24 cm
                      </p>
                    </div>

                    {/* History Item 3 */}
                    <div className="group cursor-pointer bg-surface-container-high p-4 transition-all hover:bg-surface-container">
                      <div className="mb-2 flex items-start justify-between">
                        <span className="text-[10px] font-bold text-on-surface-variant">
                          V1.2 • 1 WEEK AGO
                        </span>
                      </div>
                      <p className="text-on-surface text-xs leading-snug font-bold">
                        Luxury Slipcase
                      </p>
                      <p className="mt-1 text-[10px] text-on-surface-variant">
                        A5 Custom Fit
                      </p>
                    </div>
                  </div>
                </div>

                {/* Uploaded Documents */}
                <div className="mb-8 lg:mb-10">
                  <div className="mb-4 flex items-center gap-3">
                    <Folder className="h-5 w-5 text-[#0d9c69]" />
                    <span className="text-on-surface text-sm font-medium lg:text-base">
                      Your Documents
                    </span>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    <DocumentList
                      userId={userId}
                      refreshTrigger={refreshDocuments}
                      onDocumentSelect={(doc) => setSelectedDocumentId(doc.id)}
                    />
                  </div>
                </div>

                {/* Storage Status */}
                <div className="mt-auto rounded-xl bg-primary-container/30 p-4">
                  <p className="mb-2 text-[10px] font-bold text-primary uppercase">
                    Storage Status
                  </p>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-surface-container-high">
                    <div className="h-full w-3/4 bg-primary"></div>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <span className="text-[10px] text-on-surface-variant">
                      750 / 1000 Models
                    </span>
                    <button className="text-[10px] font-bold text-primary underline">
                      UPGRADE
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
