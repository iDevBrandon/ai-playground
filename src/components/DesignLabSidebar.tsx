"use client"

import {
  Edit3,
  Ellipsis,
  Layers,
  Package,
  Plus,
  Settings,
  ShoppingCart,
  Trash2,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

interface DesignLabSidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  currentPage?: "home" | "orders" | "settings" | "materials" | "schematics"
  chatHistory?: string[]
  setChatHistory?: (history: string[] | ((prev: string[]) => string[])) => void
  onNewSpecification?: () => void
  onChatSelect?: (chatIndex: number) => void
  currentChatIndex?: number
}

export default function DesignLabSidebar({
  sidebarOpen,
  setSidebarOpen,
  currentPage = "home",
  chatHistory = [],
  setChatHistory,
  onNewSpecification,
  onChatSelect,
  currentChatIndex,
}: DesignLabSidebarProps) {
  const [hoveredChat, setHoveredChat] = useState<number | null>(null)
  const [showChatMenu, setShowChatMenu] = useState<number | null>(null)
  const [renamingChat, setRenamingChat] = useState<number | null>(null)
  const [renameValue, setRenameValue] = useState("")

  // Close chat menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowChatMenu(null)
    }

    if (showChatMenu !== null) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [showChatMenu])

  const handleNewSpecification = () => {
    const newChatTitle = `New Specification ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    if (setChatHistory) {
      setChatHistory((prev: string[]) => [newChatTitle, ...prev])
    }
    
    if (onNewSpecification) {
      // If we have the callback, use it (design-lab page)
      onNewSpecification()
      if (onChatSelect) {
        onChatSelect(0) // Select the new chat in-page
      }
    } else {
      // If no callback, navigate to the new chat (other pages)
      window.location.href = `/chat/0`
    }
  }

  const handleRenameChat = (index: number) => {
    setRenamingChat(index)
    setRenameValue(chatHistory[index])
    setShowChatMenu(null)
  }

  const confirmRename = (index: number) => {
    if (setChatHistory) {
      setChatHistory((prev: string[]) =>
        prev.map((chat, i) => (i === index ? renameValue : chat))
      )
    }
    setRenamingChat(null)
    setRenameValue("")
  }

  const handleDeleteChat = (index: number) => {
    if (setChatHistory) {
      setChatHistory((prev: string[]) => prev.filter((_, i) => i !== index))
    }
    setShowChatMenu(null)
  }

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 flex w-80 transform flex-col bg-[#f6f3f2] transition-transform duration-300 ease-in-out lg:relative lg:z-auto lg:w-80 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center border-b border-[#e6e3e2] bg-[#ffffff] px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/image/logo.png"
            alt="PakFactory Logo"
            width={120}
            height={28}
            className="h-5 w-auto"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div>

          {/* Main Menu - Always show */}
          <div className="pt-2">
            <h3
              className="px-2 text-xs font-semibold tracking-wide text-gray-500 uppercase"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Main menu
            </h3>
          </div>

          <Link
            href="/design-lab/schematics"
            className={`flex w-full items-center gap-3 rounded-lg p-2 transition-colors ${
              currentPage === "schematics"
                ? "bg-[#e7ffef] text-[#0d9c69] border-l-4 border-[#0d9c69] font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            <Layers className={`h-5 w-5 ${currentPage === "schematics" ? "text-[#0d9c69]" : ""}`} />
            <span className="text-sm">Schematics</span>
          </Link>

          <Link
            href="/design-lab/materials"
            className={`flex w-full items-center gap-3 rounded-lg p-2 transition-colors ${
              currentPage === "materials"
                ? "bg-[#e7ffef] text-[#0d9c69] border-l-4 border-[#0d9c69] font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            <Package className={`h-5 w-5 ${currentPage === "materials" ? "text-[#0d9c69]" : ""}`} />
            <span className="text-sm">Materials</span>
          </Link>

          <Link
            href="/design-lab/orders"
            className={`flex w-full items-center gap-3 rounded-lg p-2 transition-colors ${
              currentPage === "orders"
                ? "bg-[#e7ffef] text-[#0d9c69] border-l-4 border-[#0d9c69] font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            <ShoppingCart className={`h-5 w-5 ${currentPage === "orders" ? "text-[#0d9c69]" : ""}`} />
            <span className="text-sm">Orders</span>
          </Link>

          <Link
            href="/design-lab/settings"
            className={`flex w-full items-center gap-3 rounded-lg p-2 transition-colors ${
              currentPage === "settings"
                ? "bg-[#e7ffef] text-[#0d9c69] border-l-4 border-[#0d9c69] font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            <Settings className={`h-5 w-5 ${currentPage === "settings" ? "text-[#0d9c69]" : ""}`} />
            <span className="text-sm">Settings</span>
          </Link>


          {/* Chat History - Show on all pages when chat history exists */}
          {chatHistory.length > 0 && (
            <>
              <div className="pt-4 pb-2">
                <h3
                  className="px-2 text-xs font-semibold tracking-wide text-gray-500 uppercase"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Your chats
                </h3>
              </div>

              {chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className="relative"
                  onMouseEnter={() => setHoveredChat(index)}
                  onMouseLeave={() => setHoveredChat(null)}
                >
                  {renamingChat === index ? (
                    <div className="flex items-center gap-2 px-2 py-2">
                      <input
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") confirmRename(index)
                          if (e.key === "Escape") setRenamingChat(null)
                        }}
                        onBlur={() => confirmRename(index)}
                        autoFocus
                        className="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      />
                    </div>
                  ) : (
                    <Link
                      href={`/chat/${index}`}
                      className={`flex w-full items-center justify-between rounded-lg p-2 transition-colors ${
                        currentChatIndex === index 
                          ? "bg-[#e7ffef] text-[#0d9c69] font-semibold" 
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      <span className="flex-1 truncate pr-2 text-left text-sm leading-tight">
                        {chat}
                      </span>
                      <div className="flex h-6 w-6 items-center justify-center">
                        {hoveredChat === index && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowChatMenu(
                                showChatMenu === index ? null : index
                              )
                            }}
                            className="rounded p-1 transition-colors hover:bg-gray-200"
                          >
                            <Ellipsis className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </Link>
                  )}

                  {/* Dropdown Menu */}
                  {showChatMenu === index && (
                    <div className="absolute top-8 right-0 z-50 w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                      <button
                        onClick={() => handleRenameChat(index)}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        <Edit3 className="h-4 w-4" />
                        Rename
                      </button>
                      <button
                        onClick={() => handleDeleteChat(index)}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-gray-200 p-4">
        {/* New Specification Button - Always show */}
        <button
            onClick={handleNewSpecification}
            className="mb-3 flex w-full items-center gap-3 rounded-lg bg-[#0d9c69] p-2.5 text-white transition-colors hover:bg-[#0a8659]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            <Plus className="h-5 w-5" />
            <span className="text-sm font-medium">
              New Specification
            </span>
          </button>


        {/* User Profile */}
        <div className="flex items-center gap-3 p-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0d9c69] text-sm font-medium text-white">
            BH
          </div>
          <div className="flex-1">
            <div
              className="text-sm font-medium text-gray-900"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Brandon Ha
            </div>
            <div
              className="text-xs text-gray-500"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Free
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
