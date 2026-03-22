"use client"

import {
  Boxes,
  CheckCircle2,
  LogOut,
  MessageSquareCode,
  MoreVertical,
  PackageSearch,
  PencilRuler,
  Plus,
  Settings,
  ShoppingCart,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { ChatItem } from "@/lib/chat-store"

interface DesignLabSidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  currentPage?:
    | "home"
    | "orders"
    | "settings"
    | "materials"
    | "schematics"
    | "define"
  chatHistory?: ChatItem[]
  setChatHistory?: (
    history: ChatItem[] | ((prev: ChatItem[]) => ChatItem[])
  ) => void
  onNewSpecification?: () => void
  onChatSelect?: (chatId: string) => void
  currentChatId?: string
}

export default function DesignLabSidebar({
  sidebarOpen,
  setSidebarOpen,
  currentPage = "home",
  chatHistory = [],
  setChatHistory,
  onNewSpecification,
  onChatSelect,
  currentChatId,
}: DesignLabSidebarProps) {
  const router = useRouter()

  // Initialize activeTab derived from currentPage to prevent flash blank
  const getInitialTab = () => {
    if (currentPage === "home" || currentPage === "schematics") return "agent"
    return currentPage as any
  }

  const [activeTab, setActiveTab] = useState<
    "chat" | "materials" | "agent" | "orders" | "define"
  >(getInitialTab())

  const [showUserMenu, setShowUserMenu] = useState(false)
  const [currentTime, setCurrentTime] = useState("2026.03.22 15:03")

  // Keep state in sync with prop for route changes
  useEffect(() => {
    const targetTab = getInitialTab()
    if (activeTab !== targetTab) {
      setActiveTab(targetTab)
    }
  }, [currentPage])

  // Chat management state (re-instated)
  const [showChatMenu, setShowChatMenu] = useState<string | null>(null)
  const [renamingChat, setRenamingChat] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState("")

  useEffect(() => {
    // Update time for the mockup look
    const now = new Date()
    const formatted = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
    setCurrentTime(formatted)
  }, [])

  const handleTabClick = (tabId: typeof activeTab, route?: string) => {
    setActiveTab(tabId)
    if (route) {
      router.push(route)
    }
  }

  const handleRenameChat = (chatId: string) => {
    const chat = chatHistory.find((c) => c.id === chatId)
    if (chat) {
      setRenamingChat(chatId)
      setRenameValue(chat.title)
      setShowChatMenu(null)
    }
  }

  const confirmRename = (chatId: string) => {
    if (setChatHistory) {
      setChatHistory((prev: ChatItem[]) =>
        prev.map((chat) =>
          chat.id === chatId ? { ...chat, title: renameValue } : chat
        )
      )
    }
    setRenamingChat(null)
    setRenameValue("")
  }

  const handleDeleteChat = (chatId: string) => {
    if (setChatHistory) {
      setChatHistory((prev: ChatItem[]) =>
        prev.filter((chat) => chat.id !== chatId)
      )
    }
    setShowChatMenu(null)
  }

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 flex w-[320px] transform flex-col bg-[#f3ece4] transition-transform duration-300 ease-in-out lg:relative lg:z-auto lg:w-[320px] ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
      style={{
        borderRight: "1px solid rgba(0,0,0,0.05)",
      }}
    >
      {/* Top Navigation Bar - Icons */}
      <div className="flex h-[72px] shrink-0 items-center justify-between px-6">
        <div className="flex w-full items-center justify-center gap-3">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-white/50 ${
              activeTab === "chat"
                ? "bg-white/80 text-[#0d9c69] shadow-sm ring-1 ring-black/5"
                : "text-gray-500"
            }`}
          >
            <MessageSquareCode className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleTabClick("materials", "/design-lab/materials")}
            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-white/50 ${
              activeTab === "materials"
                ? "bg-white/80 text-[#0d9c69] shadow-sm ring-1 ring-black/5"
                : "text-gray-500"
            }`}
          >
            <Boxes className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleTabClick("define", "/design-lab/agent")}
            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-white/50 ${
              activeTab === "define"
                ? "bg-white/80 text-[#0d9c69] shadow-sm ring-1 ring-black/5"
                : "text-gray-500"
            }`}
          >
            <PencilRuler className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleTabClick("agent", "/design-lab/schematics")}
            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-white/50 ${
              activeTab === "agent"
                ? "bg-white/80 text-[#0d9c69] shadow-sm ring-1 ring-black/5"
                : "text-gray-500"
            }`}
          >
            <PackageSearch className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleTabClick("orders", "/design-lab/orders")}
            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-white/50 ${
              activeTab === "orders"
                ? "bg-white/80 text-[#0d9c69] shadow-sm ring-1 ring-black/5"
                : "text-gray-500"
            }`}
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Dynamic Content Area */}
      {activeTab === "agent" ? (
        <>
          {/* Header Section */}
          <div className="px-8 pt-4 pb-6">
            <div className="flex items-center justify-between">
              <h1
                className="text-[22px] font-bold tracking-tight text-[#1c1b1b]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Assistant Agent
              </h1>
              <span className="text-[13px] font-medium text-gray-500/80">
                {currentTime}
              </span>
            </div>
          </div>

          {/* Progress List Section */}
          <div className="flex-1 overflow-y-auto px-8 pb-10">
            <div className="relative space-y-6">
              {/* Vertical line connecting steps */}
              <div className="absolute top-2 bottom-4 left-[9px] w-[1px] bg-gray-300/60" />

              {/* Step 1: Completed */}
              <div className="relative z-10 flex items-start gap-4">
                <div className="mt-1 flex h-[19px] w-[19px] items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5">
                  <CheckCircle2 className="h-[14px] w-[14px] fill-[#0d9c69] stroke-white text-[#0d9c69]" />
                </div>
                <span className="text-[15px] font-medium text-gray-700">
                  Initial Analysis
                </span>
              </div>

              {/* Step 2: Completed */}
              <div className="relative z-10 flex items-start gap-4">
                <div className="mt-1 flex h-[19px] w-[19px] items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5">
                  <CheckCircle2 className="h-[14px] w-[14px] fill-[#0d9c69] stroke-white text-[#0d9c69]" />
                </div>
                <span className="text-[15px] font-medium text-gray-700">
                  Material Sourcing
                </span>
              </div>

              {/* Step 3: Completed */}
              <div className="relative z-10 flex items-start gap-4">
                <div className="mt-1 flex h-[19px] w-[19px] items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5">
                  <CheckCircle2 className="h-[14px] w-[14px] fill-[#0d9c69] stroke-white text-[#0d9c69]" />
                </div>
                <span className="text-[15px] font-medium text-gray-700">
                  Cost Optimization
                </span>
              </div>

              {/* Step 4: Active Loop */}
              <div className="relative z-10 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-[19px] w-[19px] items-center justify-center">
                    <div className="h-4 w-4 rounded-full border-2 border-gray-300 bg-white ring-2 ring-emerald-500/20 ring-transparent ring-offset-2 ring-offset-emerald-100" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[15px] font-bold text-[#1c1b1b]">
                      Design Validation & Prep
                    </span>
                    <p className="text-[13px] leading-relaxed text-gray-500/90">
                      Analyzing specification against ASTM-D6400 industrial
                      standards for rigid board structural integrity.
                    </p>
                  </div>
                </div>

                {/* Sub-steps */}
                <div className="ml-9 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-50 ring-2 ring-white">
                      <CheckCircle2 className="h-[10px] w-[10px] fill-[#0d9c69] stroke-emerald-50 text-[#0d9c69]" />
                    </div>
                    <span className="text-[14px] font-medium text-gray-700">
                      Accessing Cloud Database
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full border-2 border-[#0d9c69] bg-white ring-2 ring-white" />
                    <span className="text-[14px] font-medium text-[#1c1b1b]">
                      Material Search
                    </span>
                  </div>

                  <div className="flex items-center gap-3 opacity-40">
                    <div className="h-[14px] w-[14px] rounded-full border border-gray-400" />
                    <span className="text-[14px] font-medium text-gray-700">
                      Generate Prototypes
                    </span>
                  </div>

                  <div className="flex items-center gap-3 opacity-40">
                    <div className="h-[14px] w-[14px] rounded-full border border-gray-400" />
                    <span className="text-[14px] font-medium text-gray-700">
                      Batch Exploration
                    </span>
                  </div>

                  <div className="flex items-center gap-3 opacity-40">
                    <div className="h-[14px] w-[14px] rounded-full border border-gray-400" />
                    <span className="text-[14px] font-medium text-gray-700">
                      Selection Optimization
                    </span>
                  </div>

                  <div className="flex items-center gap-3 opacity-40">
                    <div className="h-[14px] w-[14px] rounded-full border border-gray-400" />
                    <span className="text-[14px] font-medium text-gray-700">
                      Purchase Transaction
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : activeTab === "chat" ? (
        <div className="flex flex-1 flex-col overflow-hidden px-8">
          <button
            onClick={onNewSpecification}
            className="mt-6 mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0d9c69] p-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-[#0a8659] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span>New Chat</span>
          </button>
          <div className="pt-2 pb-4">
            <h2 className="text-[18px] font-bold text-[#1c1b1b]">
              Chat History
            </h2>
          </div>
          <div className="custom-scrollbar flex-1 space-y-2 overflow-y-auto pb-10">
            {chatHistory.length > 0 ? (
              chatHistory.map((chat) => (
                <div key={chat.id} className="group relative">
                  {renamingChat === chat.id ? (
                    <input
                      type="text"
                      className="w-full rounded-lg bg-white p-3 text-[14px] shadow-sm ring-1 ring-black/5 focus:ring-emerald-500/50 focus:outline-none"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={() => confirmRename(chat.id)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && confirmRename(chat.id)
                      }
                      autoFocus
                    />
                  ) : (
                    <div
                      onClick={() => onChatSelect?.(chat.id)}
                      className={`flex w-full cursor-pointer items-center justify-between rounded-lg p-3 transition-all hover:bg-white/60 ${
                        currentChatId === chat.id
                          ? "bg-white shadow-sm ring-1 ring-black/5"
                          : ""
                      }`}
                    >
                      <span className="truncate text-[14px] font-medium text-gray-700">
                        {chat.title}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowChatMenu(
                            showChatMenu === chat.id ? null : chat.id
                          )
                        }}
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <MoreVertical className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  )}

                  {showChatMenu === chat.id && (
                    <div className="absolute top-10 right-0 z-20 w-32 rounded-lg bg-white p-1 shadow-lg ring-1 ring-black/5">
                      <button
                        onClick={() => handleRenameChat(chat.id)}
                        className="w-full rounded-md px-2 py-1.5 text-left text-[12px] hover:bg-gray-50"
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => handleDeleteChat(chat.id)}
                        className="w-full rounded-md px-2 py-1.5 text-left text-[12px] text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="pt-20 text-center text-sm text-gray-500">
                No chats found.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="text-center">
            <h3 className="mb-2 text-[18px] font-bold tracking-wide text-[#1c1b1b] uppercase">
              {activeTab === "define" ? "Design Definition" : activeTab} Content
            </h3>
            <p className="text-[13px] text-gray-500">
              Module loading in progress...
            </p>
          </div>
        </div>
      )}

      {/* Bottom Profile section - similar to mockup style but keeping functional parts */}
      <div className="relative mt-auto border-t border-black/5 bg-white/20 p-6 backdrop-blur-sm">
        {/* User Menu Dropdown */}
        {showUserMenu && (
          <div className="absolute right-6 bottom-[calc(100%+8px)] left-6 z-50 animate-in rounded-2xl bg-white p-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] ring-1 ring-black/[0.03] duration-200 slide-in-from-bottom-2">
            <button
              onClick={() => {
                router.push("/design-lab/settings")
                setShowUserMenu(false)
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[14px] font-medium text-gray-700 transition-colors hover:bg-emerald-50 hover:text-[#0d9c69]"
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
            <div className="mx-2 my-1 h-[1px] bg-black/5" />
            <button
              onClick={() => {
                // Handle logout logic here
                setShowUserMenu(false)
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[14px] font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </button>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0d9c69] text-sm font-bold text-white shadow-lg shadow-emerald-500/20">
            BH
          </div>
          <div className="flex flex-1 flex-col">
            <span className="text-[14px] font-bold text-[#1c1b1b]">
              Brandon Ha
            </span>
            <span className="text-[12px] font-medium text-gray-500">
              Premium Account
            </span>
          </div>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`rounded-lg p-1.5 transition-colors ${showUserMenu ? "bg-black/5 text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
