"use client"

import {
  Search,
  Filter,
  Grid3X3,
  List,
  ChevronDown,
  Star,
  Info,
  Zap,
  Leaf,
  Shield,
  Menu,
  BookOpen,
  Download,
  ExternalLink,
} from "lucide-react"
import Head from "next/head"
import { useState, useMemo } from "react"
import { useChatStore } from "@/lib/chat-store"
import DesignLabSidebar from "@/components/DesignLabSidebar"

interface Material {
  id: string
  name: string
  category: "Core Boards" | "Liners" | "Adhesives" | "Finishes" | "Substrates"
  subcategory: string
  weight?: string
  thickness?: string
  color: string
  properties: {
    sustainability: number
    durability: number
    printability: number
    costEfficiency: number
  }
  specifications: {
    density?: string
    tensileStrength?: string
    bendResistance?: string
    moistureResistance?: string
    grammage?: string
    gloss?: string
    scratchResistance?: string
    chemicalResistance?: string
    edgeCrushStrength?: string
    burstStrength?: string
    moistureBarrier?: string
    oxygenBarrier?: string
  }
  applications: string[]
  certifications: string[]
  description: string
  supplier: string
  priceRange: string
  availability: "In Stock" | "Limited" | "Out of Stock"
  featured: boolean
  sustainable: boolean
}

const materialsDatabase: Material[] = [
  {
    id: "eska-1200",
    name: "ESKA Core Board",
    category: "Core Boards",
    subcategory: "High-Density Fiberboard",
    weight: "1200gsm",
    thickness: "1.2mm",
    color: "#8B4513",
    properties: {
      sustainability: 85,
      durability: 95,
      printability: 88,
      costEfficiency: 78
    },
    specifications: {
      density: "1.2 g/cm³",
      tensileStrength: "120 N⋅m/g",
      bendResistance: "8.5 mN⋅m²/g",
      moistureResistance: "High",
      grammage: "1200 g/m²"
    },
    applications: ["Luxury Boxes", "Rigid Packaging", "Premium Products"],
    certifications: ["FSC Certified", "ASTM D6400", "ISO 9001"],
    description: "Premium high-density core board designed for luxury packaging applications requiring exceptional structural integrity.",
    supplier: "International Paper",
    priceRange: "$2.45 - $3.20",
    availability: "In Stock",
    featured: true,
    sustainable: true
  },
  {
    id: "art-paper-120",
    name: "Art Paper Liner",
    category: "Liners",
    subcategory: "Coated Paper",
    weight: "120gsm",
    thickness: "0.12mm",
    color: "#F5F5DC",
    properties: {
      sustainability: 72,
      durability: 68,
      printability: 95,
      costEfficiency: 85
    },
    specifications: {
      density: "0.8 g/cm³",
      tensileStrength: "85 N⋅m/g",
      bendResistance: "4.2 mN⋅m²/g",
      moistureResistance: "Medium",
      grammage: "120 g/m²"
    },
    applications: ["Premium Labeling", "High-Quality Printing", "Luxury Finishing"],
    certifications: ["FSC Certified", "PEFC Certified"],
    description: "Superior coated liner paper engineered for exceptional print quality and premium finishing applications.",
    supplier: "UPM Specialty Papers",
    priceRange: "$0.85 - $1.20",
    availability: "In Stock",
    featured: true,
    sustainable: true
  },
  {
    id: "eva-adhesive",
    name: "EVA Animal Glue",
    category: "Adhesives",
    subcategory: "Hot-Melt Adhesive",
    weight: "N/A",
    thickness: "Variable",
    color: "#E0E0E0",
    properties: {
      sustainability: 65,
      durability: 90,
      printability: 45,
      costEfficiency: 82
    },
    specifications: {
      density: "0.95 g/cm³",
      tensileStrength: "15 MPa",
      moistureResistance: "Excellent"
    },
    applications: ["Rigid Box Assembly", "Lamination", "Structural Bonding"],
    certifications: ["FDA Approved", "REACH Compliant"],
    description: "High-performance ethylene-vinyl acetate adhesive providing superior bonding strength for packaging applications.",
    supplier: "Henkel AG",
    priceRange: "$3.20 - $4.50",
    availability: "In Stock",
    featured: false,
    sustainable: false
  },
  {
    id: "matte-premium",
    name: "Matte Premium Finish",
    category: "Finishes",
    subcategory: "Surface Treatment",
    weight: "N/A",
    thickness: "0.005mm",
    color: "#2FAB73",
    properties: {
      sustainability: 78,
      durability: 85,
      printability: 92,
      costEfficiency: 75
    },
    specifications: {
      gloss: "5-10 GU",
      scratchResistance: "Excellent",
      chemicalResistance: "Good"
    },
    applications: ["Premium Packaging", "Luxury Goods", "High-End Cosmetics"],
    certifications: ["FDA Safe", "EU Compliant"],
    description: "Premium matte finish providing elegant appearance and superior protection for high-value packaging.",
    supplier: "Actega Terra",
    priceRange: "$1.85 - $2.65",
    availability: "Limited",
    featured: true,
    sustainable: true
  },
  {
    id: "corrugated-kraft",
    name: "Corrugated Kraft Board",
    category: "Substrates",
    subcategory: "Corrugated",
    weight: "275gsm",
    thickness: "3.5mm",
    color: "#DEB887",
    properties: {
      sustainability: 95,
      durability: 75,
      printability: 65,
      costEfficiency: 90
    },
    specifications: {
      density: "0.3 g/cm³",
      edgeCrushStrength: "7.2 kN/m",
      burstStrength: "550 kPa",
      grammage: "275 g/m²"
    },
    applications: ["Shipping Boxes", "E-commerce Packaging", "Industrial Packaging"],
    certifications: ["Recyclable", "Biodegradable", "FSC Certified"],
    description: "Sustainable corrugated board optimized for shipping and e-commerce applications with excellent structural performance.",
    supplier: "WestRock",
    priceRange: "$0.45 - $0.85",
    availability: "In Stock",
    featured: false,
    sustainable: true
  },
  {
    id: "metalized-polyester",
    name: "Metalized Polyester Film",
    category: "Substrates",
    subcategory: "Flexible Film",
    weight: "50gsm",
    thickness: "0.05mm",
    color: "#C0C0C0",
    properties: {
      sustainability: 35,
      durability: 95,
      printability: 88,
      costEfficiency: 65
    },
    specifications: {
      density: "1.4 g/cm³",
      tensileStrength: "200 MPa",
      moistureBarrier: "Excellent",
      oxygenBarrier: "Excellent"
    },
    applications: ["Food Packaging", "Barrier Applications", "Flexible Pouches"],
    certifications: ["FDA Approved", "BPA Free"],
    description: "High-barrier metalized film providing exceptional protection for food and pharmaceutical packaging applications.",
    supplier: "Toray Plastics",
    priceRange: "$2.20 - $3.80",
    availability: "In Stock",
    featured: false,
    sustainable: false
  }
]

export default function MaterialsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { chatHistory, setChatHistory } = useChatStore()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [sortBy, setSortBy] = useState<string>("name")
  const [showFilters, setShowFilters] = useState(false)
  const [sustainableOnly, setSustainableOnly] = useState(false)
  const [inStockOnly, setInStockOnly] = useState(false)

  const categories = ["All", ...Array.from(new Set(materialsDatabase.map(m => m.category)))]

  const filteredMaterials = useMemo(() => {
    let filtered = materialsDatabase

    if (searchTerm) {
      filtered = filtered.filter(material =>
        material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.subcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.applications.some(app => app.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter(material => material.category === selectedCategory)
    }

    if (sustainableOnly) {
      filtered = filtered.filter(material => material.sustainable)
    }

    if (inStockOnly) {
      filtered = filtered.filter(material => material.availability === "In Stock")
    }

    // Sort materials
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "category":
          return a.category.localeCompare(b.category)
        case "sustainability":
          return b.properties.sustainability - a.properties.sustainability
        case "cost":
          return a.properties.costEfficiency - b.properties.costEfficiency
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, selectedCategory, sortBy, sustainableOnly, inStockOnly])

  const PropertyBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-[#42544e]" style={{ fontFamily: "Inter, sans-serif" }}>{label}</span>
        <span className="font-bold text-[#112d21]" style={{ fontFamily: "Inter, sans-serif" }}>{value}%</span>
      </div>
      <div className="h-2 bg-[#e6e3e2] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )

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
          currentPage="materials"
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

              <div className="flex items-center gap-3">
                <span
                  className="text-sm text-gray-500"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Material Database
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
                  Database Online
                </span>
              </div>
            </div>
          </div>

          {/* Materials Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              {/* Header */}
              <header className="mb-8">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 
                      className="text-4xl font-extrabold tracking-tighter text-[#171d19] mb-2"
                      style={{ fontFamily: "Manrope, sans-serif" }}
                    >
                      Substrate Database
                    </h1>
                    <p 
                      className="text-[#3d4a42] text-lg max-w-2xl"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Comprehensive material specifications for industrial packaging design. Access technical data, sustainability metrics, and application guidelines.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#006c47] text-white rounded-lg hover:bg-[#005235] transition-colors">
                      <Download className="h-4 w-4" />
                      Export Database
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-[#bccabf] rounded-lg hover:bg-[#eff5ee] transition-colors">
                      <BookOpen className="h-4 w-4" />
                      Technical Docs
                    </button>
                  </div>
                </div>
              </header>

              {/* Search and Filters */}
              <div className="mb-8 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#42544e]" />
                  <input
                    type="text"
                    placeholder="Search materials, applications, or specifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-[#bccabf] rounded-lg bg-white focus:ring-2 focus:ring-pakfactory-green focus:border-transparent"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  />
                </div>

                {/* Filter Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2 px-4 py-2 border border-[#bccabf] rounded-lg hover:bg-[#eff5ee] transition-colors"
                    >
                      <Filter className="h-4 w-4" />
                      Filters
                      <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </button>

                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-2 border border-[#bccabf] rounded-lg bg-white focus:ring-2 focus:ring-pakfactory-green"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-2 border border-[#bccabf] rounded-lg bg-white focus:ring-2 focus:ring-pakfactory-green"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      <option value="name">Sort by Name</option>
                      <option value="category">Sort by Category</option>
                      <option value="sustainability">Sort by Sustainability</option>
                      <option value="cost">Sort by Cost Efficiency</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[#42544e]" style={{ fontFamily: "Inter, sans-serif" }}>
                      {filteredMaterials.length} materials
                    </span>
                    <div className="flex border border-[#bccabf] rounded-lg p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded ${viewMode === 'grid' ? 'bg-pakfactory-green text-white' : 'text-[#42544e]'}`}
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded ${viewMode === 'list' ? 'bg-pakfactory-green text-white' : 'text-[#42544e]'}`}
                      >
                        <List className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Extended Filters */}
                {showFilters && (
                  <div className="bg-[#eff5ee] p-4 rounded-lg space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={sustainableOnly}
                          onChange={(e) => setSustainableOnly(e.target.checked)}
                          className="rounded border-[#bccabf] text-pakfactory-green focus:ring-pakfactory-green"
                        />
                        <span className="text-sm" style={{ fontFamily: "Inter, sans-serif" }}>Sustainable Only</span>
                        <Leaf className="h-4 w-4 text-pakfactory-green" />
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={inStockOnly}
                          onChange={(e) => setInStockOnly(e.target.checked)}
                          className="rounded border-[#bccabf] text-pakfactory-green focus:ring-pakfactory-green"
                        />
                        <span className="text-sm" style={{ fontFamily: "Inter, sans-serif" }}>In Stock Only</span>
                        <Zap className="h-4 w-4 text-[#ff9500]" />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Materials Grid/List */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMaterials.map((material) => (
                    <div
                      key={material.id}
                      className="bg-white border border-[#bccabf] rounded-xl p-6 hover:shadow-lg transition-shadow"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className="text-lg font-bold text-[#171d19]"
                              style={{ fontFamily: "Manrope, sans-serif" }}
                            >
                              {material.name}
                            </h3>
                            {material.featured && <Star className="h-4 w-4 text-[#ff9500] fill-current" />}
                            {material.sustainable && <Leaf className="h-4 w-4 text-pakfactory-green" />}
                          </div>
                          <p className="text-sm text-[#42544e]" style={{ fontFamily: "Inter, sans-serif" }}>
                            {material.category} • {material.subcategory}
                          </p>
                          {material.weight && (
                            <p className="text-xs text-[#42544e]" style={{ fontFamily: "Inter, sans-serif" }}>
                              {material.weight} • {material.thickness}
                            </p>
                          )}
                        </div>
                        <div
                          className="w-6 h-6 rounded border border-[#bccabf]"
                          style={{ backgroundColor: material.color }}
                        />
                      </div>

                      {/* Properties */}
                      <div className="space-y-3 mb-4">
                        <PropertyBar label="Sustainability" value={material.properties.sustainability} color="#36b37e" />
                        <PropertyBar label="Durability" value={material.properties.durability} color="#006c47" />
                        <PropertyBar label="Printability" value={material.properties.printability} color="#279366" />
                        <PropertyBar label="Cost Efficiency" value={material.properties.costEfficiency} color="#ff9500" />
                      </div>

                      {/* Applications */}
                      <div className="mb-4">
                        <p className="text-xs font-bold text-[#42544e] mb-2 uppercase tracking-wider">Applications</p>
                        <div className="flex flex-wrap gap-1">
                          {material.applications.slice(0, 2).map((app, index) => (
                            <span
                              key={index}
                              className="text-xs px-2 py-1 bg-[#e7ffef] text-[#006c47] rounded-full"
                              style={{ fontFamily: "Inter, sans-serif" }}
                            >
                              {app}
                            </span>
                          ))}
                          {material.applications.length > 2 && (
                            <span className="text-xs px-2 py-1 bg-[#eff5ee] text-[#42544e] rounded-full">
                              +{material.applications.length - 2}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-[#e6e3e2]">
                        <div>
                          <p className="text-sm font-bold text-[#171d19]" style={{ fontFamily: "Inter, sans-serif" }}>
                            {material.priceRange}
                          </p>
                          <p className="text-xs text-[#42544e]" style={{ fontFamily: "Inter, sans-serif" }}>
                            {material.supplier}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              material.availability === "In Stock"
                                ? "bg-[#e7ffef] text-[#006c47]"
                                : material.availability === "Limited"
                                ? "bg-[#fff3cd] text-[#ff9500]"
                                : "bg-[#ffdad6] text-[#ba1a1a]"
                            }`}
                          >
                            {material.availability}
                          </span>
                          <button className="p-1 text-[#42544e] hover:text-[#006c47] transition-colors">
                            <Info className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMaterials.map((material) => (
                    <div
                      key={material.id}
                      className="bg-white border border-[#bccabf] rounded-lg p-6 flex items-center justify-between hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center gap-6 flex-1">
                        <div
                          className="w-12 h-12 rounded-lg border border-[#bccabf] shrink-0"
                          style={{ backgroundColor: material.color }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className="text-lg font-bold text-[#171d19]"
                              style={{ fontFamily: "Manrope, sans-serif" }}
                            >
                              {material.name}
                            </h3>
                            {material.featured && <Star className="h-4 w-4 text-[#ff9500] fill-current" />}
                            {material.sustainable && <Leaf className="h-4 w-4 text-pakfactory-green" />}
                          </div>
                          <p className="text-sm text-[#42544e] mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                            {material.category} • {material.subcategory}
                            {material.weight && ` • ${material.weight}`}
                          </p>
                          <p className="text-sm text-[#42544e]" style={{ fontFamily: "Inter, sans-serif" }}>
                            {material.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <p className="text-sm font-bold text-[#171d19]" style={{ fontFamily: "Inter, sans-serif" }}>
                            {material.priceRange}
                          </p>
                          <p className="text-xs text-[#42544e]" style={{ fontFamily: "Inter, sans-serif" }}>
                            {material.supplier}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-3 py-1 rounded-full ${
                            material.availability === "In Stock"
                              ? "bg-[#e7ffef] text-[#006c47]"
                              : material.availability === "Limited"
                              ? "bg-[#fff3cd] text-[#ff9500]"
                              : "bg-[#ffdad6] text-[#ba1a1a]"
                          }`}
                        >
                          {material.availability}
                        </span>
                        <button className="p-2 text-[#42544e] hover:text-[#006c47] transition-colors">
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredMaterials.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#eff5ee] flex items-center justify-center">
                    <Search className="h-8 w-8 text-[#42544e]" />
                  </div>
                  <h3
                    className="text-lg font-semibold text-[#171d19] mb-2"
                    style={{ fontFamily: "Manrope, sans-serif" }}
                  >
                    No materials found
                  </h3>
                  <p className="text-[#42544e]" style={{ fontFamily: "Inter, sans-serif" }}>
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