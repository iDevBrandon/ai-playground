"use client"

import DesignLabSidebar from "@/components/DesignLabSidebar"
import { Bell, Camera, Globe, Menu, Save } from "lucide-react"
import Head from "next/head"
import { useState } from "react"
import { useChatStore } from "@/lib/chat-store"

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { chatHistory, setChatHistory } = useChatStore()
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
  })
  const [language, setLanguage] = useState("English (US)")
  const [shopifyConnected, setShopifyConnected] = useState(false)
  const [zohoConnected, setZohoConnected] = useState(true)

  const handleNotificationChange = (type: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
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
          bg-surface-container-lowest
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

              <div className="flex items-center gap-3 min-w-0 pr-2">
                <span
                  className="text-sm text-gray-500 truncate"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Settings
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Status indicator */}
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-2 sm:px-3 py-1.5 text-sm">
                <div className="h-2 w-2 rounded-full bg-green-500 shrink-0"></div>
                <span
                  className="hidden sm:inline text-gray-700 whitespace-nowrap"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  System Status
                </span>
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-5xl px-4 md:px-12 py-8 md:py-16">
              {/* Editorial Header */}
              <header className="mb-8 md:mb-16">
                <h1
                  className="mb-2 text-3xl md:text-5xl font-extrabold tracking-tighter text-[#171d19]"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  System Architecture
                </h1>
                <p
                  className="max-w-2xl text-base md:text-lg text-[#3d4a42]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Configure your professional workspace, manage platform
                  integrations, and maintain technical precision across your
                  enterprise profile.
                </p>
              </header>

              <div className="grid grid-cols-12 gap-8 md:gap-10">
                {/* Left Column: User Profile & Preferences */}
                <div className="col-span-12 space-y-8 md:space-y-12 lg:col-span-7">
                  {/* User Profile Section */}
                  <section>
                    <h2
                      className="mb-4 md:mb-6 flex items-center gap-2 text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#3d4a42] uppercase"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      <span className="h-2 w-2 rounded-full bg-packify-green"></span>
                      Identity & Credentials
                    </h2>
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 bg-white p-6 md:p-8 shadow-sm">
                      <div className="group relative cursor-pointer">
                        <div className="h-20 w-20 md:h-24 md:w-24 overflow-hidden rounded-lg bg-[#e9f0e9]">
                          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-packify-green to-[#006c47]">
                            <span className="text-xl md:text-2xl font-bold text-white">
                              BH
                            </span>
                          </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-[#006c47]/20 opacity-0 transition-opacity group-hover:opacity-100">
                          <Camera className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="grow space-y-4 w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label
                              className="text-[10px] font-bold text-[#6d7a71] uppercase"
                              style={{ fontFamily: "Inter, sans-serif" }}
                            >
                              Full Name
                            </label>
                            <input
                              className="w-full border-b-2 border-none border-transparent bg-[#eff5ee] py-2 font-medium text-[#171d19] focus:border-packify-green focus:ring-0"
                              style={{ fontFamily: "Inter, sans-serif" }}
                              type="text"
                              defaultValue="Brandon Ha"
                            />
                          </div>
                          <div className="space-y-1">
                            <label
                              className="text-[10px] font-bold text-[#6d7a71] uppercase"
                              style={{ fontFamily: "Inter, sans-serif" }}
                            >
                              Professional Title
                            </label>
                            <input
                              className="w-full border-b-2 border-none border-transparent bg-[#eff5ee] py-2 font-medium text-[#171d19] focus:border-packify-green focus:ring-0"
                              style={{ fontFamily: "Inter, sans-serif" }}
                              type="text"
                              defaultValue="Senior Technical Architect"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label
                            className="text-[10px] font-bold text-[#6d7a71] uppercase"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            Email Correspondence
                          </label>
                          <input
                            className="w-full border-b-2 border-none border-transparent bg-[#eff5ee] py-2 font-medium text-[#171d19] focus:border-packify-green focus:ring-0"
                            style={{ fontFamily: "Inter, sans-serif" }}
                            type="email"
                            defaultValue="brandon@packify.ai"
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Account Preferences Section */}
                  <section>
                    <h2
                      className="mb-4 md:mb-6 flex items-center gap-2 text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#3d4a42] uppercase"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      <span className="h-2 w-2 rounded-full bg-packify-green"></span>
                      Environmental Preferences
                    </h2>
                    <div className="space-y-6 md:space-y-8 bg-white p-6 md:p-8 shadow-sm">
                      {/* Language Setting */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <Globe className="h-5 w-5 shrink-0 text-[#6d7a71]" />
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
                          className="w-full sm:w-auto rounded-lg border border-[#bccabf] bg-[#eff5ee] px-4 py-2 text-sm font-medium text-[#171d19] focus:border-packify-green focus:ring-0"
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
                                onChange={() =>
                                  handleNotificationChange("email")
                                }
                                className="sr-only"
                              />
                              <div
                                className={`h-6 w-12 cursor-pointer rounded-full transition-colors ${
                                  notifications.email
                                    ? "bg-packify-green"
                                    : "bg-[#bccabf]"
                                }`}
                                onClick={() =>
                                  handleNotificationChange("email")
                                }
                              >
                                <div
                                  className={`h-5 w-5 translate-y-0.5 rounded-full bg-white transition-transform ${
                                    notifications.email
                                      ? "translate-x-6"
                                      : "translate-x-0.5"
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
                                onChange={() =>
                                  handleNotificationChange("push")
                                }
                                className="sr-only"
                              />
                              <div
                                className={`h-6 w-12 cursor-pointer rounded-full transition-colors ${
                                  notifications.push
                                    ? "bg-packify-green"
                                    : "bg-[#bccabf]"
                                }`}
                                onClick={() => handleNotificationChange("push")}
                              >
                                <div
                                  className={`h-5 w-5 translate-y-0.5 rounded-full bg-white transition-transform ${
                                    notifications.push
                                      ? "translate-x-6"
                                      : "translate-x-0.5"
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
                                onChange={() => handleNotificationChange("sms")}
                                className="sr-only"
                              />
                              <div
                                className={`h-6 w-12 cursor-pointer rounded-full transition-colors ${
                                  notifications.sms
                                    ? "bg-packify-green"
                                    : "bg-[#bccabf]"
                                }`}
                                onClick={() => handleNotificationChange("sms")}
                              >
                                <div
                                  className={`h-5 w-5 translate-y-0.5 rounded-full bg-white transition-transform ${
                                    notifications.sms
                                      ? "translate-x-6"
                                      : "translate-x-0.5"
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
                <div className="col-span-12 space-y-8 lg:col-span-5">
                  <section>
                    <h2
                      className="mb-4 md:mb-6 flex items-center gap-2 text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#3d4a42] uppercase"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      <span className="h-2 w-2 rounded-full bg-packify-green"></span>
                      Platform Integrations
                    </h2>

                    <div className="space-y-4">
                      {/* Shopify Integration */}
                      <div className="bg-white p-4 sm:p-6 shadow-sm">
                        <div className="mb-4 flex items-start sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#96bf47]">
                              <span className="font-bold text-white">S</span>
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
                            className={`h-3 w-3 shrink-0 rounded-full mt-1.5 sm:mt-0 ${
                              shopifyConnected ? "bg-packify-green" : "bg-[#ba1a1a]"
                            }`}
                          />
                        </div>
                        <button
                          className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                            shopifyConnected
                              ? "bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ffb4ab]"
                              : "bg-packify-green text-white hover:bg-[#006c47]"
                          }`}
                          style={{ fontFamily: "Inter, sans-serif" }}
                          onClick={() => setShopifyConnected(!shopifyConnected)}
                        >
                          {shopifyConnected ? "Disconnect" : "Connect Store"}
                        </button>
                      </div>

                      {/* Zoho Integration */}
                      <div className="bg-white p-4 sm:p-6 shadow-sm">
                        <div className="mb-4 flex items-start sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ff6b35]">
                              <span className="font-bold text-white">Z</span>
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
                            className={`h-3 w-3 shrink-0 rounded-full mt-1.5 sm:mt-0 ${
                              zohoConnected ? "bg-packify-green" : "bg-[#ba1a1a]"
                            }`}
                          />
                        </div>
                        <button
                          className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                            zohoConnected
                              ? "bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ffb4ab]"
                              : "bg-packify-green text-white hover:bg-[#006c47]"
                          }`}
                          style={{ fontFamily: "Inter, sans-serif" }}
                          onClick={() => setZohoConnected(!zohoConnected)}
                        >
                          {zohoConnected ? "Disconnect" : "ConnectCRM"}
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Save Button */}
                  <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#006c47] px-6 py-4 text-sm font-bold tracking-wide text-white uppercase transition-colors hover:bg-[#005235]">
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
