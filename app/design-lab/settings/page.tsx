"use client"

import {
  Bell,
  Globe,
  Menu,
  Settings,
  ShoppingCart,
  User,
  X,
  Camera,
  Save,
} from "lucide-react"
import DesignLabSidebar from "@/src/components/DesignLabSidebar"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [chatHistory, setChatHistory] = useState([
    "PakFactory AI interface",
    "Packaging Design Consultation",
  ])
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
  })
  const [language, setLanguage] = useState("English (US)")
  const [shopifyConnected, setShopifyConnected] = useState(false)
  const [zohoConnected, setZohoConnected] = useState(true)

  const handleNotificationChange = (type: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

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
          currentPage="settings"
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
                  Settings
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

          {/* Settings Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto px-12 py-16">
              {/* Editorial Header */}
              <header className="mb-16">
                <h1 
                  className="text-5xl font-extrabold tracking-tighter text-[#171d19] mb-2"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  System Architecture
                </h1>
                <p 
                  className="text-[#3d4a42] text-lg max-w-2xl"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Configure your professional workspace, manage platform integrations, and maintain technical precision across your enterprise profile.
                </p>
              </header>

              <div className="grid grid-cols-12 gap-10">
                {/* Left Column: User Profile & Preferences */}
                <div className="col-span-12 lg:col-span-7 space-y-12">
                  {/* User Profile Section */}
                  <section>
                    <h2 
                      className="text-xs font-bold uppercase tracking-[0.2em] text-[#3d4a42] mb-6 flex items-center gap-2"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      <span className="w-2 h-2 bg-[#36b37e] rounded-full"></span>
                      Identity & Credentials
                    </h2>
                    <div className="bg-[#ffffff] p-8 flex items-start gap-8 shadow-sm">
                      <div className="relative group cursor-pointer">
                        <div className="w-24 h-24 bg-[#e9f0e9] overflow-hidden rounded-lg">
                          <div className="w-full h-full bg-gradient-to-br from-[#36b37e] to-[#006c47] flex items-center justify-center">
                            <span className="text-2xl text-white font-bold">BH</span>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-[#006c47]/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                          <Camera className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-grow space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label 
                              className="text-[10px] uppercase font-bold text-[#6d7a71]"
                              style={{ fontFamily: "Inter, sans-serif" }}
                            >
                              Full Name
                            </label>
                            <input 
                              className="w-full bg-[#eff5ee] border-none focus:ring-0 border-b-2 border-transparent focus:border-[#36b37e] py-2 font-medium text-[#171d19]"
                              style={{ fontFamily: "Inter, sans-serif" }}
                              type="text" 
                              defaultValue="Brandon Ha"
                            />
                          </div>
                          <div className="space-y-1">
                            <label 
                              className="text-[10px] uppercase font-bold text-[#6d7a71]"
                              style={{ fontFamily: "Inter, sans-serif" }}
                            >
                              Professional Title
                            </label>
                            <input 
                              className="w-full bg-[#eff5ee] border-none focus:ring-0 border-b-2 border-transparent focus:border-[#36b37e] py-2 font-medium text-[#171d19]"
                              style={{ fontFamily: "Inter, sans-serif" }}
                              type="text" 
                              defaultValue="Senior Technical Architect"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label 
                            className="text-[10px] uppercase font-bold text-[#6d7a71]"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            Email Correspondence
                          </label>
                          <input 
                            className="w-full bg-[#eff5ee] border-none focus:ring-0 border-b-2 border-transparent focus:border-[#36b37e] py-2 font-medium text-[#171d19]"
                            style={{ fontFamily: "Inter, sans-serif" }}
                            type="email" 
                            defaultValue="brandon@pakfactory.ai"
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Account Preferences Section */}
                  <section>
                    <h2 
                      className="text-xs font-bold uppercase tracking-[0.2em] text-[#3d4a42] mb-6 flex items-center gap-2"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      <span className="w-2 h-2 bg-[#36b37e] rounded-full"></span>
                      Environmental Preferences
                    </h2>
                    <div className="bg-[#ffffff] p-8 space-y-8 shadow-sm">
                      {/* Language Setting */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Globe className="h-5 w-5 text-[#6d7a71]" />
                          <div>
                            <p 
                              className="font-bold text-[#171d19]"
                              style={{ fontFamily: "Inter, sans-serif" }}
                            >
                              Interface Language
                            </p>
                            <p 
                              className="text-xs text-[#3d4a42]"
                              style={{ fontFamily: "Inter, sans-serif" }}
                            >
                              Default technical terminology and units
                            </p>
                          </div>
                        </div>
                        <select 
                          className="bg-[#eff5ee] border border-[#bccabf] rounded-lg px-4 py-2 text-sm font-medium text-[#171d19] focus:border-[#36b37e] focus:ring-0"
                          style={{ fontFamily: "Inter, sans-serif" }}
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                        >
                          <option>English (US)</option>
                          <option>English (UK)</option>
                          <option>Spanish</option>
                          <option>French</option>
                        </select>
                      </div>

                      {/* Notifications */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Bell className="h-5 w-5 text-[#6d7a71]" />
                          <div>
                            <p 
                              className="font-bold text-[#171d19]"
                              style={{ fontFamily: "Inter, sans-serif" }}
                            >
                              Notification Preferences
                            </p>
                            <p 
                              className="text-xs text-[#3d4a42]"
                              style={{ fontFamily: "Inter, sans-serif" }}
                            >
                              Configure how you receive alerts and updates
                            </p>
                          </div>
                        </div>

                        <div className="ml-9 space-y-3">
                          <label className="flex items-center justify-between">
                            <span 
                              className="text-sm text-[#171d19]"
                              style={{ fontFamily: "Inter, sans-serif" }}
                            >
                              Email Notifications
                            </span>
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={notifications.email}
                                onChange={() => handleNotificationChange('email')}
                                className="sr-only"
                              />
                              <div 
                                className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                                  notifications.email ? 'bg-[#36b37e]' : 'bg-[#bccabf]'
                                }`}
                                onClick={() => handleNotificationChange('email')}
                              >
                                <div 
                                  className={`w-5 h-5 bg-white rounded-full transition-transform translate-y-0.5 ${
                                    notifications.email ? 'translate-x-6' : 'translate-x-0.5'
                                  }`}
                                />
                              </div>
                            </div>
                          </label>

                          <label className="flex items-center justify-between">
                            <span 
                              className="text-sm text-[#171d19]"
                              style={{ fontFamily: "Inter, sans-serif" }}
                            >
                              Push Notifications
                            </span>
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={notifications.push}
                                onChange={() => handleNotificationChange('push')}
                                className="sr-only"
                              />
                              <div 
                                className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                                  notifications.push ? 'bg-[#36b37e]' : 'bg-[#bccabf]'
                                }`}
                                onClick={() => handleNotificationChange('push')}
                              >
                                <div 
                                  className={`w-5 h-5 bg-white rounded-full transition-transform translate-y-0.5 ${
                                    notifications.push ? 'translate-x-6' : 'translate-x-0.5'
                                  }`}
                                />
                              </div>
                            </div>
                          </label>

                          <label className="flex items-center justify-between">
                            <span 
                              className="text-sm text-[#171d19]"
                              style={{ fontFamily: "Inter, sans-serif" }}
                            >
                              SMS Alerts
                            </span>
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={notifications.sms}
                                onChange={() => handleNotificationChange('sms')}
                                className="sr-only"
                              />
                              <div 
                                className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                                  notifications.sms ? 'bg-[#36b37e]' : 'bg-[#bccabf]'
                                }`}
                                onClick={() => handleNotificationChange('sms')}
                              >
                                <div 
                                  className={`w-5 h-5 bg-white rounded-full transition-transform translate-y-0.5 ${
                                    notifications.sms ? 'translate-x-6' : 'translate-x-0.5'
                                  }`}
                                />
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Right Column: Integration Settings */}
                <div className="col-span-12 lg:col-span-5 space-y-8">
                  <section>
                    <h2 
                      className="text-xs font-bold uppercase tracking-[0.2em] text-[#3d4a42] mb-6 flex items-center gap-2"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      <span className="w-2 h-2 bg-[#36b37e] rounded-full"></span>
                      Platform Integrations
                    </h2>
                    
                    <div className="space-y-4">
                      {/* Shopify Integration */}
                      <div className="bg-[#ffffff] p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#96bf47] rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold">S</span>
                            </div>
                            <div>
                              <p 
                                className="font-bold text-[#171d19]"
                                style={{ fontFamily: "Inter, sans-serif" }}
                              >
                                Shopify Store
                              </p>
                              <p 
                                className="text-xs text-[#3d4a42]"
                                style={{ fontFamily: "Inter, sans-serif" }}
                              >
                                E-commerce integration for product listings
                              </p>
                            </div>
                          </div>
                          <div 
                            className={`w-3 h-3 rounded-full ${
                              shopifyConnected ? 'bg-[#36b37e]' : 'bg-[#ba1a1a]'
                            }`}
                          />
                        </div>
                        <button 
                          className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                            shopifyConnected
                              ? 'bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ffb4ab]'
                              : 'bg-[#36b37e] text-white hover:bg-[#006c47]'
                          }`}
                          style={{ fontFamily: "Inter, sans-serif" }}
                          onClick={() => setShopifyConnected(!shopifyConnected)}
                        >
                          {shopifyConnected ? 'Disconnect' : 'Connect Store'}
                        </button>
                      </div>

                      {/* Zoho Integration */}
                      <div className="bg-[#ffffff] p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#ff6b35] rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold">Z</span>
                            </div>
                            <div>
                              <p 
                                className="font-bold text-[#171d19]"
                                style={{ fontFamily: "Inter, sans-serif" }}
                              >
                                Zoho CRM
                              </p>
                              <p 
                                className="text-xs text-[#3d4a42]"
                                style={{ fontFamily: "Inter, sans-serif" }}
                              >
                                Customer relationship management sync
                              </p>
                            </div>
                          </div>
                          <div 
                            className={`w-3 h-3 rounded-full ${
                              zohoConnected ? 'bg-[#36b37e]' : 'bg-[#ba1a1a]'
                            }`}
                          />
                        </div>
                        <button 
                          className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                            zohoConnected
                              ? 'bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ffb4ab]'
                              : 'bg-[#36b37e] text-white hover:bg-[#006c47]'
                          }`}
                          style={{ fontFamily: "Inter, sans-serif" }}
                          onClick={() => setZohoConnected(!zohoConnected)}
                        >
                          {zohoConnected ? 'Disconnect' : 'Connect CRM'}
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Save Button */}
                  <button className="w-full bg-[#006c47] text-white py-4 px-6 rounded-lg font-bold text-sm uppercase tracking-wide hover:bg-[#005235] transition-colors flex items-center justify-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Configuration
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}