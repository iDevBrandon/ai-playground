"use client"

import DesignLabSidebar from "@/components/DesignLabSidebar"
import { useChatStore } from "@/lib/chat-store"
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Menu,
  MoreVertical,
} from "lucide-react"
import Head from "next/head"
import { useState } from "react"

export default function OrdersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { chatHistory, setChatHistory } = useChatStore()

  const orders = [
    {
      id: "PRD-2024-X892",
      project: "Luxury Watch Case v4",
      status: "In Production",
      statusColor: "#ff9500",
      date: "Nov 2, 2024",
      total: "$6,750.00",
    },
    {
      id: "PRD-2024-S110",
      project: "Flora Skin Serum Box",
      status: "Shipped",
      statusColor: "#006c47",
      date: "Oct 18, 2024",
      total: "$4,820.50",
    },
    {
      id: "PRD-2023-A442",
      project: "Aero Component Sleeve",
      status: "Pending",
      statusColor: "#a03e43",
      date: "Oct 12, 2024",
      total: "$9,100.00",
    },
    {
      id: "PRD-2023-B990",
      project: "Titanium Bolt Grid 8x8",
      status: "Shipped",
      statusColor: "#006c47",
      date: "Sep 30, 2024",
      total: "$2,140.00",
    },
  ]

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <style>{`
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          }
        `}</style>
      </Head>
      <div
        className="font-body flex h-dvh w-full items-stretch overflow-hidden bg-[#fcf9f8] text-[#1c1b1b]"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="bg-opacity-50 fixed inset-0 z-40 bg-black lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <DesignLabSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentPage="orders"
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
        />

        {/* Main Content */}
        <div className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-white">
          {/* Header Section */}
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#e6e3e2]/50 bg-white px-4">
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
                  Order History
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Status indicator */}
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span
                  className="text-gray-700"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  System Status
                </span>
              </div>
            </div>
          </div>

          {/* Orders Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-5xl px-4 md:px-12 py-8 md:py-16">
              {/* Editorial Header */}
              <header className="mb-8 md:mb-16">
                <h1
                  className="mb-2 text-3xl md:text-5xl font-extrabold tracking-tighter text-[#171d19]"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  Manufacturing Timeline
                </h1>
                <p
                  className="max-w-2xl text-base md:text-lg text-[#3d4a42]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Comprehensive tracking of your packaging projects, from
                  initial specification through production delivery and quality
                  assurance verification.
                </p>
              </header>

              {/* Order List */}
              <div className="mb-8 md:mb-16 space-y-4">
                {orders.map((order, index) => (
                  <div
                    key={order.id}
                    className="group flex flex-col items-start md:items-center justify-between gap-4 md:gap-6 bg-white p-4 md:p-6 shadow-sm transition-all hover:bg-[#eff5ee] md:flex-row"
                  >
                    <div className="w-full md:flex-1 md:min-w-0">
                      <p
                        className="mb-1 text-[10px] md:text-xs font-bold tracking-widest text-[#3d4a42]/60 uppercase"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Project
                      </p>
                      <h3
                        className="mb-1 text-lg md:text-xl font-bold text-[#171d19] truncate"
                        style={{ fontFamily: "Manrope, sans-serif" }}
                      >
                        {order.project}
                      </h3>
                      <p
                        className="font-mono text-[10px] md:text-xs text-[#3d4a42]"
                        style={{ fontFamily: "Inter, monospace" }}
                      >
                        {order.id}
                      </p>
                    </div>

                    <div className="flex flex-wrap w-full md:w-auto items-center justify-between md:justify-end gap-4 md:gap-6 mt-2 md:mt-0 pt-4 md:pt-0 border-t border-gray-100 md:border-0">
                      <div className="w-[120px] md:w-32">
                        <p
                          className="mb-1 text-[10px] md:text-xs font-bold tracking-widest text-[#3d4a42]/60 uppercase"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          Status
                        </p>
                        <span
                          className="flex items-center gap-1.5 text-xs md:text-sm font-semibold"
                          style={{
                            fontFamily: "Inter, sans-serif",
                            color: order.statusColor,
                          }}
                        >
                          <span
                            className="h-2 w-2 shrink-0 rounded-full"
                            style={{ backgroundColor: order.statusColor }}
                          ></span>
                          <span className="truncate">{order.status}</span>
                        </span>
                      </div>

                      <div className="w-[120px] md:w-32">
                        <p
                          className="mb-1 text-[10px] md:text-xs font-bold tracking-widest text-[#3d4a42]/60 uppercase"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          Date
                        </p>
                        <p
                          className="text-xs md:text-sm font-medium text-[#171d19]"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          {order.date}
                        </p>
                      </div>

                      <div className="w-[120px] md:w-32">
                        <p
                          className="mb-1 text-[10px] md:text-xs font-bold tracking-widest text-[#3d4a42]/60 uppercase"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          Total
                        </p>
                        <p
                          className="text-base md:text-lg font-bold text-[#171d19]"
                          style={{ fontFamily: "Manrope, sans-serif" }}
                        >
                          {order.total}
                        </p>
                      </div>

                      <div className="flex gap-2 w-full md:w-auto justify-end pt-2 md:pt-0">
                        <button className="p-2 text-[#3d4a42] transition-colors hover:bg-gray-100 md:hover:bg-transparent rounded-lg md:rounded-none hover:text-[#006c47]">
                          <FileText className="h-4 w-4 md:h-5 md:w-5" />
                        </button>
                        <button className="p-2 text-[#3d4a42] transition-colors hover:bg-gray-100 md:hover:bg-transparent rounded-lg md:rounded-none hover:text-[#006c47]">
                          <MoreVertical className="h-4 w-4 md:h-5 md:w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination / Analytics Footer */}
              <footer className="flex flex-col items-center justify-between gap-8 border-t border-[#bccabf]/10 pt-8 md:flex-row">
                <div className="flex gap-12">
                  <div>
                    <p
                      className="mb-1 text-xs font-bold tracking-widest text-[#3d4a42] uppercase"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Lifetime Projects
                    </p>
                    <p
                      className="text-2xl font-black text-[#171d19]"
                      style={{ fontFamily: "Manrope, sans-serif" }}
                    >
                      128
                    </p>
                  </div>
                  <div>
                    <p
                      className="mb-1 text-xs font-bold tracking-widest text-[#3d4a42] uppercase"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Total Expenditure
                    </p>
                    <p
                      className="text-2xl font-black text-[#171d19]"
                      style={{ fontFamily: "Manrope, sans-serif" }}
                    >
                      $241,084.50
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button className="rounded-lg bg-[#eff5ee] p-3 text-[#3d4a42] transition-all hover:text-[#006c47]">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div className="flex gap-2">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#006c47]/10 font-bold text-[#006c47]"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      1
                    </span>
                    <span
                      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg font-bold text-[#3d4a42] transition-colors hover:bg-[#eff5ee]"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      2
                    </span>
                    <span
                      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg font-bold text-[#3d4a42] transition-colors hover:bg-[#eff5ee]"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      3
                    </span>
                  </div>
                  <button className="rounded-lg bg-[#eff5ee] p-3 text-[#3d4a42] transition-all hover:text-[#006c47]">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
