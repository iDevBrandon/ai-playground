"use client"

import DesignLabSidebar from "@/components/DesignLabSidebar"
import { useChatStore } from "@/lib/chat-store"
import {
  ChevronDown,
  Download,
  Edit,
  Eye,
  Filter,
  Grid3X3,
  Layers,
  List,
  Menu,
  Plus,
  Search,
  Star,
} from "lucide-react"
import Head from "next/head"
import { useMemo, useState } from "react"

interface SchematicTemplate {
  id: string
  name: string
  category:
    | "Rigid Boxes"
    | "Flexible Packaging"
    | "Corrugated"
    | "Displays"
    | "Specialty"
  dimensions: {
    length: number
    width: number
    height: number
    unit: string
  }
  complexity: "Simple" | "Intermediate" | "Advanced"
  thumbnail: string
  description: string
  features: string[]
  applications: string[]
  lastModified: string
  author: string
  downloads: number
  rating: number
  premium: boolean
}

const schematicTemplates: SchematicTemplate[] = [
  {
    id: "rigid-box-magnetic",
    name: "Magnetic Closure Rigid Box",
    category: "Rigid Boxes",
    dimensions: { length: 12, width: 10, height: 4, unit: "inches" },
    complexity: "Intermediate",
    thumbnail: "/schematics/magnetic-box.svg",
    description:
      "Premium rigid box with magnetic closure system, ideal for luxury products and gift packaging.",
    features: [
      "Magnetic closure",
      "Premium finish",
      "Structural integrity",
      "Custom branding area",
    ],
    applications: ["Luxury goods", "Electronics", "Jewelry", "Gift boxes"],
    lastModified: "2024-01-15",
    author: "Design Team",
    downloads: 234,
    rating: 4.8,
    premium: true,
  },
  {
    id: "corrugated-shipper",
    name: "E-commerce Shipper Box",
    category: "Corrugated",
    dimensions: { length: 16, width: 12, height: 8, unit: "inches" },
    complexity: "Simple",
    thumbnail: "/schematics/shipper-box.svg",
    description:
      "Standard corrugated shipping box optimized for e-commerce fulfillment and protection.",
    features: [
      "Easy assembly",
      "Cost-effective",
      "Stackable design",
      "Tear strips",
    ],
    applications: ["E-commerce", "Shipping", "Fulfillment", "Retail"],
    lastModified: "2024-01-10",
    author: "Logistics Team",
    downloads: 512,
    rating: 4.5,
    premium: false,
  },
  {
    id: "display-stand",
    name: "Counter Display Stand",
    category: "Displays",
    dimensions: { length: 8, width: 6, height: 12, unit: "inches" },
    complexity: "Advanced",
    thumbnail: "/schematics/display-stand.svg",
    description:
      "Multi-tier counter display with adjustable shelving for retail point-of-sale positioning.",
    features: [
      "Adjustable tiers",
      "Assembly instructions",
      "Branding panels",
      "Stability features",
    ],
    applications: [
      "Retail displays",
      "Point of sale",
      "Product showcase",
      "Trade shows",
    ],
    lastModified: "2024-01-08",
    author: "Retail Team",
    downloads: 189,
    rating: 4.7,
    premium: true,
  },
  {
    id: "flexible-pouch",
    name: "Stand-up Pouch",
    category: "Flexible Packaging",
    dimensions: { length: 6, width: 4, height: 8, unit: "inches" },
    complexity: "Simple",
    thumbnail: "/schematics/standup-pouch.svg",
    description:
      "Flexible stand-up pouch with resealable zipper closure for food and consumer products.",
    features: [
      "Resealable closure",
      "Barrier protection",
      "Stand-up base",
      "Print-ready surface",
    ],
    applications: ["Food packaging", "Pet food", "Coffee", "Snacks"],
    lastModified: "2024-01-12",
    author: "Flexible Team",
    downloads: 387,
    rating: 4.6,
    premium: false,
  },
  {
    id: "bottle-carrier",
    name: "6-Pack Bottle Carrier",
    category: "Specialty",
    dimensions: { length: 10, width: 7, height: 5, unit: "inches" },
    complexity: "Intermediate",
    thumbnail: "/schematics/bottle-carrier.svg",
    description:
      "Specialized carrier designed for 6 standard bottles with integrated handle and dividers.",
    features: [
      "Integrated handle",
      "Bottle dividers",
      "Reinforced base",
      "Tear-away top",
    ],
    applications: ["Beverages", "Beer packaging", "Gift sets", "Promotions"],
    lastModified: "2024-01-05",
    author: "Beverage Team",
    downloads: 156,
    rating: 4.4,
    premium: true,
  },
]

export default function SchematicsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { chatHistory, setChatHistory } = useChatStore()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [selectedComplexity, setSelectedComplexity] = useState<string>("All")
  const [showFilters, setShowFilters] = useState(false)
  const [premiumOnly, setPremiumOnly] = useState(false)

  const categories = [
    "All",
    ...Array.from(new Set(schematicTemplates.map((s) => s.category))),
  ]
  const complexities = ["All", "Simple", "Intermediate", "Advanced"]

  const filteredSchematics = useMemo(() => {
    let filtered = schematicTemplates

    if (searchTerm) {
      filtered = filtered.filter(
        (schematic) =>
          schematic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          schematic.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          schematic.applications.some((app) =>
            app.toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (schematic) => schematic.category === selectedCategory
      )
    }

    if (selectedComplexity !== "All") {
      filtered = filtered.filter(
        (schematic) => schematic.complexity === selectedComplexity
      )
    }

    if (premiumOnly) {
      filtered = filtered.filter((schematic) => schematic.premium)
    }

    return filtered.sort((a, b) => b.downloads - a.downloads)
  }, [searchTerm, selectedCategory, selectedComplexity, premiumOnly])

  const ComplexityBadge = ({ complexity }: { complexity: string }) => {
    const colors = {
      Simple: "bg-[#e7ffef] text-[#006c47]",
      Intermediate: "bg-[#fff3cd] text-[#ff9500]",
      Advanced: "bg-[#ffdad6] text-[#ba1a1a]",
    }
    return (
      <span
        className={`rounded-full px-2 py-1 text-xs ${colors[complexity as keyof typeof colors]}`}
      >
        {complexity}
      </span>
    )
  }

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
            className="bg-opacity-50 fixed inset-0 z-40 bg-black lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <DesignLabSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentPage="schematics"
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
                <span
                  className="text-sm text-gray-500 truncate"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Design Schematics
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
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

          {/* Schematics Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-7xl px-6 py-8">
              {/* Header */}
              <header className="mb-8">
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
                  <div>
                    <h1
                      className="mb-2 text-4xl font-extrabold tracking-tighter text-[#1c1b1b]"
                      style={{ fontFamily: "Manrope, sans-serif" }}
                    >
                      Design Schematics
                    </h1>
                    <p
                      className="max-w-2xl text-lg text-[#42544e]"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Professional packaging templates and technical drawings.
                      Download CAD-ready schematics for rapid prototyping and
                      production.
                    </p>
                  </div>
                  <div className="flex w-full items-center gap-2 sm:gap-3 md:w-auto">
                    <button className="flex w-full flex-1 items-center justify-center gap-1 rounded-lg bg-[#0d9c69] px-2 py-2 text-xs whitespace-nowrap text-white transition-colors hover:bg-[#0a8659] sm:w-[160px] sm:flex-none sm:gap-2 sm:px-4 sm:text-sm">
                      <Plus className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                      <span>New Template</span>
                    </button>
                    <button className="flex w-full flex-1 items-center justify-center gap-1 rounded-lg border border-[#bccabf] px-2 py-2 text-xs whitespace-nowrap transition-colors hover:bg-[#eff5ee] sm:w-[160px] sm:flex-none sm:gap-2 sm:px-4 sm:text-sm">
                      <Download className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                      <span>Bulk Export</span>
                    </button>
                  </div>
                </div>
              </header>

              {/* Search and Filters */}
              <div className="mb-8 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-[#42544e]" />
                  <input
                    type="text"
                    placeholder="Search templates by name, category, or application..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-[#bccabf] bg-white py-3 pr-4 pl-12 focus:border-transparent focus:ring-2 focus:ring-[#0d9c69]"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  />
                </div>

                {/* Filter Bar */}
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                  <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center lg:w-auto">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#bccabf] px-4 py-2 whitespace-nowrap transition-colors hover:bg-[#eff5ee] sm:w-auto"
                    >
                      <Filter className="h-4 w-4" />
                      Filters
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
                      />
                    </button>

                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full rounded-lg border border-[#bccabf] bg-white px-4 py-2 focus:ring-2 focus:ring-[#0d9c69] sm:w-auto"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>

                    <select
                      value={selectedComplexity}
                      onChange={(e) => setSelectedComplexity(e.target.value)}
                      className="w-full rounded-lg border border-[#bccabf] bg-white px-4 py-2 focus:ring-2 focus:ring-[#0d9c69] sm:w-auto"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {complexities.map((comp) => (
                        <option key={comp} value={comp}>
                          {comp === "All" ? "All Complexities" : comp}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex w-full items-center justify-between gap-3 border-t border-[#bccabf]/30 pt-4 lg:w-auto lg:justify-end lg:border-t-0 lg:pt-0">
                    <span
                      className="text-sm text-[#42544e]"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {filteredSchematics.length} templates
                    </span>
                    <div className="flex rounded-lg border border-[#bccabf] p-1">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`rounded p-2 ${viewMode === "grid" ? "bg-[#0d9c69] text-white" : "text-[#42544e]"}`}
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`rounded p-2 ${viewMode === "list" ? "bg-[#0d9c69] text-white" : "text-[#42544e]"}`}
                      >
                        <List className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Extended Filters */}
                {showFilters && (
                  <div className="space-y-3 rounded-lg bg-[#eff5ee] p-4">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={premiumOnly}
                          onChange={(e) => setPremiumOnly(e.target.checked)}
                          className="rounded border-[#bccabf] text-[#0d9c69] focus:ring-[#0d9c69]"
                        />
                        <span
                          className="text-sm"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          Premium Only
                        </span>
                        <Star className="h-4 w-4 text-[#ff9500]" />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Templates Grid */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredSchematics.map((template) => (
                    <div
                      key={template.id}
                      className="rounded-xl border border-[#bccabf] bg-white p-6 transition-shadow hover:shadow-lg"
                    >
                      {/* Header */}
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <h3
                              className="text-lg font-bold text-[#1c1b1b]"
                              style={{ fontFamily: "Manrope, sans-serif" }}
                            >
                              {template.name}
                            </h3>
                            {template.premium && (
                              <Star className="h-4 w-4 fill-current text-[#ff9500]" />
                            )}
                          </div>
                          <p
                            className="mb-2 text-sm text-[#42544e]"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            {template.category}
                          </p>
                          <div className="flex items-center gap-2">
                            <ComplexityBadge complexity={template.complexity} />
                            <span className="text-xs text-[#42544e]">
                              {template.dimensions.length}" ×{" "}
                              {template.dimensions.width}" ×{" "}
                              {template.dimensions.height}"
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Thumbnail */}
                      <div className="mb-4 flex h-32 items-center justify-center rounded-lg bg-[#f6f3f2]">
                        <Layers className="h-8 w-8 text-[#42544e]" />
                      </div>

                      {/* Description */}
                      <p
                        className="mb-4 line-clamp-2 text-sm text-[#42544e]"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {template.description}
                      </p>

                      {/* Features */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {template.features
                            .slice(0, 2)
                            .map((feature, index) => (
                              <span
                                key={index}
                                className="rounded-full bg-[#e7ffef] px-2 py-1 text-xs text-[#006c47]"
                                style={{ fontFamily: "Inter, sans-serif" }}
                              >
                                {feature}
                              </span>
                            ))}
                          {template.features.length > 2 && (
                            <span className="rounded-full bg-[#eff5ee] px-2 py-1 text-xs text-[#42544e]">
                              +{template.features.length - 2}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between border-t border-[#e6e3e2] pt-3">
                        <div className="flex items-center gap-3">
                          <span
                            className="text-xs text-[#42544e]"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            {template.downloads} downloads
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current text-[#ff9500]" />
                            <span className="text-xs text-[#42544e]">
                              {template.rating}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-1 text-[#42544e] transition-colors hover:text-[#0d9c69]">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-[#42544e] transition-colors hover:text-[#0d9c69]">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSchematics.map((template) => (
                    <div
                      key={template.id}
                      className="flex flex-col items-center justify-between gap-6 rounded-lg border border-[#bccabf] bg-white p-6 transition-shadow hover:shadow-lg lg:flex-row"
                    >
                      <div className="flex w-full flex-1 flex-col items-center gap-6 sm:flex-row sm:items-start lg:w-auto lg:items-center">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[#f6f3f2]">
                          <Layers className="h-8 w-8 text-[#42544e]" />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                          <div className="mb-1 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                            <h3
                              className="text-lg font-bold text-[#1c1b1b]"
                              style={{ fontFamily: "Manrope, sans-serif" }}
                            >
                              {template.name}
                            </h3>
                            {template.premium && (
                              <Star className="h-4 w-4 fill-current text-[#ff9500]" />
                            )}
                            <ComplexityBadge complexity={template.complexity} />
                          </div>
                          <p
                            className="mb-2 text-sm text-[#42544e]"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            {template.category} • {template.dimensions.length}"
                            × {template.dimensions.width}" ×{" "}
                            {template.dimensions.height}"
                          </p>
                          <p
                            className="text-sm text-[#42544e]"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            {template.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex w-full items-center justify-between gap-8 border-t border-[#bccabf]/30 pt-4 sm:justify-end lg:w-auto lg:border-t-0 lg:pt-0">
                        <div className="text-center">
                          <p
                            className="text-sm font-bold text-[#1c1b1b]"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            {template.downloads}
                          </p>
                          <p
                            className="text-xs text-[#42544e]"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            Downloads
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-[#42544e] transition-colors hover:text-[#0d9c69]">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-[#42544e] transition-colors hover:text-[#0d9c69]">
                            <Download className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-[#42544e] transition-colors hover:text-[#0d9c69]">
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredSchematics.length === 0 && (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#eff5ee]">
                    <Search className="h-8 w-8 text-[#42544e]" />
                  </div>
                  <h3
                    className="mb-2 text-lg font-semibold text-[#1c1b1b]"
                    style={{ fontFamily: "Manrope, sans-serif" }}
                  >
                    No templates found
                  </h3>
                  <p
                    className="text-[#42544e]"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Try adjusting your search terms or filters
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
