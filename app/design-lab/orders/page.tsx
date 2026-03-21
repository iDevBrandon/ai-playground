"use client"

import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Menu,
  MoreVertical,
  Settings,
  ShoppingCart,
  X,
} from "lucide-react"
import DesignLabSidebar from "@/src/components/DesignLabSidebar"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function OrdersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [chatHistory, setChatHistory] = useState([
    "PakFactory AI interface",
    "Packaging Design Consultation",
  ])

  const orders = [
    {
      id: "PRD-2024-X892",
      project: "Luxury Watch Case v4",
      status: "In Production",
      statusColor: "#ff9500",
      date: "Nov 2, 2024",
      total: "$6,750.00"
    },
    {
      id: "PRD-2024-S110", 
      project: "Flora Skin Serum Box",
      status: "Shipped",
      statusColor: "#006c47",
      date: "Oct 18, 2024",
      total: "$4,820.50"
    },
    {
      id: "PRD-2023-A442",
      project: "Aero Component Sleeve", 
      status: "Pending",
      statusColor: "#a03e43",
      date: "Oct 12, 2024",
      total: "$9,100.00"
    },
    {
      id: "PRD-2023-B990",
      project: "Titanium Bolt Grid 8x8",
      status: "Shipped", 
      statusColor: "#006c47",
      date: "Sep 30, 2024",
      total: "$2,140.00"
    }
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
            <div className="max-w-5xl mx-auto px-12 py-16">
              {/* Editorial Header */}
              <header className="mb-16">
                <h1 
                  className="text-5xl font-extrabold tracking-tighter text-[#171d19] mb-2"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  Manufacturing Timeline
                </h1>
                <p 
                  className="text-[#3d4a42] text-lg max-w-2xl"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Comprehensive tracking of your packaging projects, from initial specification through production delivery and quality assurance verification.
                </p>
              </header>

              {/* Order List */}
              <div className="space-y-4 mb-16">
                {orders.map((order, index) => (
                  <div 
                    key={order.id}
                    className="group bg-[#ffffff] hover:bg-[#eff5ee] transition-all p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm"
                  >
                    <div className="flex-1 min-w-[300px]">
                      <p 
                        className="text-xs font-bold text-[#3d4a42]/60 tracking-widest mb-1 uppercase"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Project
                      </p>
                      <h3 
                        className="text-xl font-bold text-[#171d19] mb-1"
                        style={{ fontFamily: "Manrope, sans-serif" }}
                      >
                        {order.project}
                      </h3>
                      <p 
                        className="text-xs font-mono text-[#3d4a42]"
                        style={{ fontFamily: "Inter, monospace" }}
                      >
                        {order.id}
                      </p>
                    </div>
                    
                    <div className="w-32">
                      <p 
                        className="text-xs font-bold text-[#3d4a42]/60 tracking-widest mb-1 uppercase"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Status
                      </p>
                      <span 
                        className="flex items-center gap-1.5 text-sm font-semibold"
                        style={{ 
                          fontFamily: "Inter, sans-serif",
                          color: order.statusColor 
                        }}
                      >
                        <span 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: order.statusColor }}
                        ></span>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="w-32">
                      <p 
                        className="text-xs font-bold text-[#3d4a42]/60 tracking-widest mb-1 uppercase"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Date
                      </p>
                      <p 
                        className="text-sm text-[#171d19] font-medium"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {order.date}
                      </p>
                    </div>
                    
                    <div className="w-32">
                      <p 
                        className="text-xs font-bold text-[#3d4a42]/60 tracking-widest mb-1 uppercase"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Total
                      </p>
                      <p 
                        className="text-lg font-bold text-[#171d19]"
                        style={{ fontFamily: "Manrope, sans-serif" }}
                      >
                        {order.total}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="p-2 text-[#3d4a42] hover:text-[#006c47] transition-colors">
                        <FileText className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-[#3d4a42] hover:text-[#006c47] transition-colors">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination / Analytics Footer */}
              <footer className="flex flex-col md:flex-row justify-between items-center border-t border-[#bccabf]/10 pt-8 gap-8">
                <div className="flex gap-12">
                  <div>
                    <p 
                      className="text-xs font-bold text-[#3d4a42] uppercase tracking-widest mb-1"
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
                      className="text-xs font-bold text-[#3d4a42] uppercase tracking-widest mb-1"
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
                  <button className="p-3 bg-[#eff5ee] text-[#3d4a42] hover:text-[#006c47] transition-all rounded-lg">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div className="flex gap-2">
                    <span 
                      className="w-10 h-10 flex items-center justify-center font-bold text-[#006c47] bg-[#006c47]/10 rounded-lg"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      1
                    </span>
                    <span 
                      className="w-10 h-10 flex items-center justify-center font-bold text-[#3d4a42] hover:bg-[#eff5ee] cursor-pointer rounded-lg transition-colors"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      2
                    </span>
                    <span 
                      className="w-10 h-10 flex items-center justify-center font-bold text-[#3d4a42] hover:bg-[#eff5ee] cursor-pointer rounded-lg transition-colors"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      3
                    </span>
                  </div>
                  <button className="p-3 bg-[#eff5ee] text-[#3d4a42] hover:text-[#006c47] transition-all rounded-lg">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </footer>
            </div>
          </div>
        </div>

        {/* Support FAB */}
        <div className="fixed bottom-8 right-8 z-40">
          <button className="group flex items-center gap-3 bg-[#006c47] text-white pl-4 pr-6 py-4 rounded-lg shadow-xl active:scale-95 transition-all hover:bg-[#005235]">
            <span className="material-symbols-outlined">support_agent</span>
            <span 
              className="font-bold tracking-tight"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Engineer Consult
            </span>
          </button>
        </div>
      </div>
    </>
  )
}