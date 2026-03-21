"use client"

import DesignLabSidebar from "@/components/DesignLabSidebar"
import DocumentList from "@/components/DocumentList"
import FileUpload from "@/components/FileUpload"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import {
  BarChart,
  Calculator,
  CheckCircle2,
  Menu,
  Paperclip,
  Send,
  Settings,
  TestTube,
  X,
} from "lucide-react"
import Head from "next/head"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"
import { useChatStore } from "@/lib/chat-store"

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const chatId = params.id as string
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
  // Generate predictable chat data based on the chatId
  const generateChatTitle = (id: string): string => {
    // Use a simple hash to generate consistent titles
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const titles = [
      "PakFactory AI Interface",
      "Packaging Design Consultation", 
      "Material Specification Review",
      "Cost Analysis Discussion",
      "3D Render Generation",
      "Sustainability Assessment",
      "Quality Assurance Planning",
      "Production Timeline Review"
    ]
    return titles[hash % titles.length]
  }

  const { chatHistory, setChatHistory, setCurrentChatId } = useChatStore()

  useEffect(() => {
    setCurrentChatId(chatId)
    if (chatId) {
      setChatHistory((prev) => {
        if (prev.some((chat) => chat.id === chatId)) return prev
        return [
          {
            id: chatId,
            title: generateChatTitle(chatId),
            createdAt: new Date(),
          },
          ...prev,
        ]
      })
    }
  }, [chatId, setCurrentChatId, setChatHistory])

  const _currentChat = chatHistory.find((c) => c.id === chatId)
  const chatTitle = _currentChat ? _currentChat.title : generateChatTitle(chatId)

  // Use AI SDK for RAG chat - following the pattern from design-lab page
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

  const handleNewSpecification = () => {
    setUserMessage("")
  }

  const handleChatSelect = (chatId: string) => {
    router.push(`/chat/${chatId}`)
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

      if (file.size > 1024 * 1024) {
        alert("File too large. Maximum size: 1MB")
        return
      }

      if (typeof sendMessage === "function") {
        sendMessage({
          text: `I've selected the file "${file.name}" for analysis. Please analyze this document.`,
        })
      }
    }

    event.target.value = ""
  }

  const handleSendMessage = () => {
    if (!userMessage.trim()) return

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
      if (showUpload) return

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
          onChatSelect={handleChatSelect}
          currentChatId={chatId}
        />

        {/* Main Content - Same layout as design-lab page */}
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

          {/* Header Section */}
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#e6e3e2]/50 bg-white px-4">
            <div className="flex items-center gap-3">
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
                  {chatTitle}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span
                  className="text-gray-700"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  System Status
                </span>
              </div>

              <button
                onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
                className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:hidden"
              >
                <BarChart className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Chat Content - Same as design-lab page */}
          <div className="flex min-h-0 flex-1 overflow-hidden">
            {/* Chat Area */}
            <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-[#fcf9f8]">
              {/* Messages */}
              <div className="flex-1 space-y-6 overflow-y-auto p-6 lg:space-y-8 lg:p-8">
                {/* Initial Greeting */}
                <div className="flex gap-4 lg:gap-6">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0d9c69] lg:h-10 lg:w-10">
                    <span className="text-sm text-white lg:text-base">🤖</span>
                  </div>

                  <div className="flex max-w-xs flex-col gap-4 sm:max-w-md lg:max-w-2xl">
                    <div className="rounded-xl rounded-tl-none border-l-4 border-[#0d9c69] bg-white p-6 shadow-sm">
                      <p
                        className="text-base leading-relaxed font-medium text-[#112d21]"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Welcome back to {chatTitle}! How can I help you continue
                        with your packaging project?
                      </p>

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
              </div>

              {/* Input Area */}
              <div className="pb-[env(safe-area-inset-bottom)]">
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
                            placeholder="Continue your conversation..."
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

            {/* Right Sidebar */}
            <div
              className={`fixed inset-y-0 right-0 z-50 flex w-80 transform flex-col bg-[#f0fff5] transition-transform duration-300 ease-in-out lg:relative lg:z-auto lg:w-80 ${
                rightSidebarOpen
                  ? "translate-x-0"
                  : "translate-x-full lg:translate-x-0"
              }`}
            >
              <div className="flex-1 overflow-y-auto p-6 lg:p-8">
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
                    CHAT CONTEXT
                  </h3>
                </div>

                <div className="mb-8 lg:mb-10">
                  <div className="max-h-60 overflow-y-auto">
                    <DocumentList
                      userId={userId}
                      refreshTrigger={refreshDocuments}
                      onDocumentSelect={(doc) => setSelectedDocumentId(doc.id)}
                    />
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
