"use client"

import DesignLabSidebar from "@/components/DesignLabSidebar"
import { useChatStore } from "@/lib/chat-store"
import {
  BookOpen,
  ChevronDown,
  Download,
  ExternalLink,
  Filter,
  Grid3X3,
  Info,
  Leaf,
  List,
  Menu,
  Search,
  Star,
  Zap,
} from "lucide-react"
import Head from "next/head"
import Image from "next/image"
import { useMemo, useState } from "react"

interface Material {
  id: string
  name: string
  category:
    | "Paperboard"
    | "Corrugated"
    | "Rigid"
    | "Plastic"
    | "Foam"
    | "Specialty"
  subcategory: string
  weight?: string
  thickness?: string
  color: string
  image?: string
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
  // ── PAPERBOARD ──
  {
    id: "kraft-paperboard",
    name: "Natural Brown Kraft",
    category: "Paperboard",
    subcategory: "Kraft Paperboard",
    weight: "300gsm",
    thickness: "0.4mm",
    color: "#C4914A",
    image: "/materials/kraft-paperboard.jpg",
    properties: {
      sustainability: 92,
      durability: 80,
      printability: 72,
      costEfficiency: 88,
    },
    specifications: {
      grammage: "300 g/m²",
      tensileStrength: "90 N⋅m/g",
      bendResistance: "5.5 mN⋅m²/g",
      moistureResistance: "Medium",
    },
    applications: ["Folding Cartons", "Food Packaging", "Retail Boxes"],
    certifications: ["FSC Certified", "Recyclable", "Biodegradable"],
    description:
      "Natural brown kraft paperboard made from unbleached wood pulp. Eco-friendly with excellent printability for logos and text.",
    supplier: "Clearwater Paper",
    priceRange: "$0.55 - $0.90",
    availability: "In Stock",
    featured: true,
    sustainable: true,
  },
  {
    id: "chipboard-white",
    name: "White Chipboard",
    category: "Paperboard",
    subcategory: "Solid Bleached Board",
    weight: "400gsm",
    thickness: "0.6mm",
    color: "#F2F2F2",
    image: "/materials/rigid-chipboard.jpg",
    properties: {
      sustainability: 75,
      durability: 85,
      printability: 97,
      costEfficiency: 80,
    },
    specifications: {
      grammage: "400 g/m²",
      tensileStrength: "110 N⋅m/g",
      bendResistance: "7.0 mN⋅m²/g",
      moistureResistance: "Medium",
    },
    applications: ["Premium Folding Cartons", "Cosmetic Packaging", "Pharma"],
    certifications: ["FSC Certified", "FDA Food-Safe", "ISO 9001"],
    description:
      "Bright white solid bleached board offering excellent surface smoothness for high-end offset and digital print quality.",
    supplier: "Iggesund Paperboard",
    priceRange: "$0.80 - $1.30",
    availability: "In Stock",
    featured: true,
    sustainable: true,
  },
  // ── CORRUGATED ──
  {
    id: "corrugated-kraft",
    name: "Natural Kraft Liner",
    category: "Corrugated",
    subcategory: "B-Flute Corrugated",
    weight: "275gsm",
    thickness: "3mm",
    color: "#B8834A",
    image: "/materials/corrugated-kraft.jpg",
    properties: {
      sustainability: 95,
      durability: 78,
      printability: 65,
      costEfficiency: 92,
    },
    specifications: {
      grammage: "275 g/m²",
      edgeCrushStrength: "7.2 kN/m",
      burstStrength: "550 kPa",
      density: "0.30 g/cm³",
    },
    applications: ["Shipping Boxes", "E-commerce", "Mailer Boxes"],
    certifications: ["Recyclable", "Biodegradable", "FSC Certified"],
    description:
      "High-strength natural kraft corrugated board ideal for shipping and e-commerce packaging with outstanding stacking strength.",
    supplier: "WestRock",
    priceRange: "$0.45 - $0.85",
    availability: "In Stock",
    featured: false,
    sustainable: true,
  },
  {
    id: "corrugated-oyster",
    name: "Oyster White Liner",
    category: "Corrugated",
    subcategory: "E-Flute Corrugated",
    weight: "200gsm",
    thickness: "1.5mm",
    color: "#E8E4D0",
    image: "/materials/corrugated-oyster.jpg",
    properties: {
      sustainability: 90,
      durability: 72,
      printability: 80,
      costEfficiency: 85,
    },
    specifications: {
      grammage: "200 g/m²",
      edgeCrushStrength: "5.8 kN/m",
      burstStrength: "430 kPa",
      density: "0.28 g/cm³",
    },
    applications: ["Retail Display Boxes", "Gift Packaging", "Cosmetic Boxes"],
    certifications: ["Recyclable", "FSC Certified"],
    description:
      "Smooth oyster-white corrugated surface ideal for printed retail packaging with a clean, premium appearance.",
    supplier: "Smurfit Kappa",
    priceRange: "$0.60 - $1.00",
    availability: "In Stock",
    featured: false,
    sustainable: true,
  },
  {
    id: "corrugated-white",
    name: "Bleached White Liner",
    category: "Corrugated",
    subcategory: "White Top Liner",
    weight: "200gsm",
    thickness: "3mm",
    color: "#FFFFFF",
    image: "/materials/corrugated-white.jpg",
    properties: {
      sustainability: 88,
      durability: 76,
      printability: 88,
      costEfficiency: 82,
    },
    specifications: {
      grammage: "200 g/m²",
      edgeCrushStrength: "6.4 kN/m",
      burstStrength: "490 kPa",
      density: "0.31 g/cm³",
    },
    applications: ["Food Packaging", "FMCG Boxes", "Subscription Boxes"],
    certifications: ["Recyclable", "FSC Certified", "FDA Compliant"],
    description:
      "Bright white top corrugated liner combining sustainable corrugated structure with a clean printable surface.",
    supplier: "International Paper",
    priceRange: "$0.65 - $1.10",
    availability: "In Stock",
    featured: true,
    sustainable: true,
  },
  // ── RIGID ──
  {
    id: "rigid-chipboard-heavy",
    name: "Heavy Chipboard",
    category: "Rigid",
    subcategory: "Grey Board",
    weight: "1800gsm",
    thickness: "2.0mm",
    color: "#8B8B7A",
    image: "/materials/rigid-chipboard.jpg",
    properties: {
      sustainability: 80,
      durability: 98,
      printability: 60,
      costEfficiency: 70,
    },
    specifications: {
      grammage: "1800 g/m²",
      density: "0.90 g/cm³",
      tensileStrength: "130 N⋅m/g",
      bendResistance: "12 mN⋅m²/g",
    },
    applications: [
      "Luxury Gift Boxes",
      "Rigid Set-Up Boxes",
      "Jewelry Packaging",
    ],
    certifications: ["FSC Certified", "ISO 9001"],
    description:
      "Dense grey board providing the structural backbone for luxury rigid boxes. Wrapped with premium paper or fabric for a high-end finish.",
    supplier: "Corenso",
    priceRange: "$1.80 - $2.90",
    availability: "In Stock",
    featured: true,
    sustainable: true,
  },
  // ── PLASTIC ──
  {
    id: "plastic-pet",
    name: "PET (Polyethylene Terephthalate)",
    category: "Plastic",
    subcategory: "Thermoform Plastic",
    weight: "50gsm",
    thickness: "0.25mm",
    color: "#D4EBF8",
    image: "/materials/plastic-pet.jpg",
    properties: {
      sustainability: 55,
      durability: 90,
      printability: 82,
      costEfficiency: 75,
    },
    specifications: {
      density: "1.38 g/cm³",
      tensileStrength: "55 MPa",
      moistureBarrier: "High",
      oxygenBarrier: "Excellent",
    },
    applications: ["Clamshells", "Blister Packs", "Food Trays"],
    certifications: ["FDA Approved", "BPA Free", "PETG Recyclable"],
    description:
      "Clear, strong PET plastic widely used in food-safe packaging. Excellent transparency and barrier properties with recyclability.",
    supplier: "Toray Plastics",
    priceRange: "$1.50 - $2.80",
    availability: "In Stock",
    featured: true,
    sustainable: false,
  },
  {
    id: "plastic-hdpe",
    name: "HDPE (High-Density Polyethylene)",
    category: "Plastic",
    subcategory: "Rigid Plastic",
    weight: "N/A",
    thickness: "1.0mm",
    color: "#EAF4EA",
    image: "/materials/plastic-hdpe.jpg",
    properties: {
      sustainability: 60,
      durability: 92,
      printability: 70,
      costEfficiency: 88,
    },
    specifications: {
      density: "0.95 g/cm³",
      tensileStrength: "30 MPa",
      moistureBarrier: "Excellent",
      moistureResistance: "Excellent",
    },
    applications: ["Bottles", "Rigid Containers", "Industrial Packaging"],
    certifications: ["FDA Approved", "BPA Free", "Recyclable #2"],
    description:
      "Tough, chemical-resistant HDPE plastic ideal for bottles and rigid containers. The most recycled plastic type globally.",
    supplier: "LyondellBasell",
    priceRange: "$0.90 - $1.60",
    availability: "In Stock",
    featured: false,
    sustainable: false,
  },
  {
    id: "plastic-pp",
    name: "PP (Polypropylene)",
    category: "Plastic",
    subcategory: "Flexible / Rigid Plastic",
    weight: "N/A",
    thickness: "0.5mm",
    color: "#F5EFE6",
    image: "/materials/plastic-pp.jpg",
    properties: {
      sustainability: 62,
      durability: 88,
      printability: 76,
      costEfficiency: 90,
    },
    specifications: {
      density: "0.91 g/cm³",
      tensileStrength: "35 MPa",
      moistureResistance: "Excellent",
      chemicalResistance: "Good",
    },
    applications: ["Woven Bags", "Film Packaging", "Caps & Closures"],
    certifications: ["FDA Approved", "BPA Free", "Recyclable #5"],
    description:
      "Lightweight, versatile polypropylene used for both flexible films and rigid packaging. Excellent fatigue resistance for hinged lids.",
    supplier: "Braskem",
    priceRange: "$0.80 - $1.50",
    availability: "In Stock",
    featured: false,
    sustainable: false,
  },
  {
    id: "plastic-pla",
    name: "PLA (Polylactic Acid)",
    category: "Plastic",
    subcategory: "Bioplastic",
    weight: "N/A",
    thickness: "0.3mm",
    color: "#C8E6C9",
    image: "/materials/plastic-pla.jpg",
    properties: {
      sustainability: 88,
      durability: 65,
      printability: 80,
      costEfficiency: 55,
    },
    specifications: {
      density: "1.24 g/cm³",
      tensileStrength: "50 MPa",
      moistureResistance: "Low",
    },
    applications: [
      "Compostable Containers",
      "Sustainable Films",
      "Eco Packaging",
    ],
    certifications: ["EN13432 Compostable", "ASTM D6400", "BPI Certified"],
    description:
      "Plant-based compostable bioplastic derived from corn starch. Provides a responsible alternative to petroleum-based plastics.",
    supplier: "NatureWorks",
    priceRange: "$2.00 - $3.50",
    availability: "Limited",
    featured: true,
    sustainable: true,
  },
  // ── FOAM ──
  {
    id: "foam-epe",
    name: "EPE Foam",
    category: "Foam",
    subcategory: "Expanded Polyethylene",
    weight: "N/A",
    thickness: "10mm",
    color: "#FAFAFA",
    image: "/materials/foam-epe.jpg",
    properties: {
      sustainability: 40,
      durability: 85,
      printability: 20,
      costEfficiency: 90,
    },
    specifications: {
      density: "0.025 g/cm³",
      moistureResistance: "Excellent",
      chemicalResistance: "Good",
    },
    applications: [
      "Protective Inserts",
      "Electronics Packaging",
      "Fragile Items",
    ],
    certifications: ["REACH Compliant", "RoHS Compliant"],
    description:
      "Lightweight expanded polyethylene foam offering excellent shock absorption and moisture resistance for product protection.",
    supplier: "Sealed Air",
    priceRange: "$0.30 - $0.70",
    availability: "In Stock",
    featured: false,
    sustainable: false,
  },
  {
    id: "foam-eva",
    name: "EVA Foam",
    category: "Foam",
    subcategory: "Ethylene-Vinyl Acetate Foam",
    weight: "N/A",
    thickness: "5mm",
    color: "#FFF3E0",
    image: "/materials/foam-eva.jpg",
    properties: {
      sustainability: 45,
      durability: 88,
      printability: 30,
      costEfficiency: 82,
    },
    specifications: {
      density: "0.04 g/cm³",
      tensileStrength: "5 MPa",
      chemicalResistance: "Good",
      moistureResistance: "High",
    },
    applications: ["Jewelry Inserts", "Cosmetic Trays", "Luxury Box Lining"],
    certifications: ["REACH Compliant", "FDA Safe"],
    description:
      "Soft, flexible EVA foam commonly used as premium box lining and inserts for jewelry and cosmetics packaging.",
    supplier: "Dongguan Minaean",
    priceRange: "$0.50 - $1.20",
    availability: "In Stock",
    featured: true,
    sustainable: false,
  },
  {
    id: "foam-pu",
    name: "PU Foam",
    category: "Foam",
    subcategory: "Polyurethane Foam",
    weight: "N/A",
    thickness: "20mm",
    color: "#F5E6C8",
    image: "/materials/foam-pu.jpg",
    properties: {
      sustainability: 38,
      durability: 92,
      printability: 10,
      costEfficiency: 68,
    },
    specifications: {
      density: "0.035 g/cm³",
      tensileStrength: "3 MPa",
      chemicalResistance: "Medium",
      moistureResistance: "Medium",
    },
    applications: [
      "Heavy Protective Packaging",
      "Tool Cases",
      "Medical Devices",
    ],
    certifications: ["REACH Compliant", "ISO 9001"],
    description:
      "High-resilience polyurethane foam engineered for heavy-duty protective inserts requiring superior cushioning performance.",
    supplier: "INOAC Corporation",
    priceRange: "$0.80 - $2.00",
    availability: "In Stock",
    featured: false,
    sustainable: false,
  },
]

export default function MaterialsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { chatHistory, setChatHistory } = useChatStore()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [sortBy, setSortBy] = useState<string>("name")
  const [showFilters, setShowFilters] = useState(false)
  const [sustainableOnly, setSustainableOnly] = useState(false)
  const [inStockOnly, setInStockOnly] = useState(false)

  const categories = [
    "All",
    ...Array.from(new Set(materialsDatabase.map((m) => m.category))),
  ]

  const filteredMaterials = useMemo(() => {
    let filtered = materialsDatabase

    if (searchTerm) {
      filtered = filtered.filter(
        (material) =>
          material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          material.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          material.subcategory
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          material.applications.some((app) =>
            app.toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (material) => material.category === selectedCategory
      )
    }

    if (sustainableOnly) {
      filtered = filtered.filter((material) => material.sustainable)
    }

    if (inStockOnly) {
      filtered = filtered.filter(
        (material) => material.availability === "In Stock"
      )
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

  const PropertyBar = ({
    label,
    value,
    color,
  }: {
    label: string
    value: number
    color: string
  }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span
          className="text-[#42544e]"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {label}
        </span>
        <span
          className="font-bold text-[#112d21]"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {value}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#e6e3e2]">
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

              <div className="flex min-w-0 items-center gap-3 pr-2">
                <span
                  className="truncate text-sm text-gray-500"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Material Database
                </span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-sm sm:px-3">
                <div className="h-2 w-2 shrink-0 rounded-full bg-green-500"></div>
                <span
                  className="hidden whitespace-nowrap text-gray-700 sm:inline"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  System Status
                </span>
              </div>
            </div>
          </div>

          {/* Materials Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-7xl px-6 py-8">
              {/* Header */}
              <header className="mb-8">
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
                  <div>
                    <h1
                      className="mb-2 text-3xl font-extrabold tracking-tighter text-[#171d19] md:text-4xl"
                      style={{ fontFamily: "Manrope, sans-serif" }}
                    >
                      Substrate Database
                    </h1>
                    <p
                      className="max-w-2xl text-base text-[#3d4a42] md:text-lg"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Comprehensive material specifications for industrial
                      packaging design. Access technical data, sustainability
                      metrics, and application guidelines.
                    </p>
                  </div>
                  <div className="flex w-full items-center gap-2 sm:gap-3 md:w-auto">
                    <button className="flex w-full flex-1 items-center justify-center gap-1 rounded-lg bg-[#0d9c69] px-2 py-2 text-xs whitespace-nowrap text-white transition-colors hover:bg-[#0a8659] sm:w-40 sm:flex-none sm:gap-2 sm:px-4 sm:text-sm">
                      <Download className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                      <span>Export Database</span>
                    </button>
                    <button className="flex w-full flex-1 items-center justify-center gap-1 rounded-lg border border-[#bccabf] px-2 py-2 text-xs whitespace-nowrap transition-colors hover:bg-[#eff5ee] sm:w-40 sm:flex-none sm:gap-2 sm:px-4 sm:text-sm">
                      <BookOpen className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                      <span>Technical Docs</span>
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
                    placeholder="Search materials, applications, or specifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-[#bccabf] bg-white py-3 pr-4 pl-12 focus:border-transparent focus:ring-2 focus:ring-packify-green"
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
                      className="w-full rounded-lg border border-[#bccabf] bg-white px-4 py-2 focus:ring-2 focus:ring-packify-green sm:w-auto"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full rounded-lg border border-[#bccabf] bg-white px-4 py-2 focus:ring-2 focus:ring-packify-green sm:w-auto"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      <option value="name">Sort by Name</option>
                      <option value="category">Sort by Category</option>
                      <option value="sustainability">
                        Sort by Sustainability
                      </option>
                      <option value="cost">Sort by Cost Efficiency</option>
                    </select>
                  </div>

                  <div className="mt-4 flex w-full items-center justify-between gap-3 border-t border-[#bccabf]/30 pt-4 lg:mt-0 lg:w-auto lg:justify-end lg:border-t-0 lg:pt-0">
                    <span
                      className="text-sm text-[#42544e]"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {filteredMaterials.length} materials
                    </span>
                    <div className="flex rounded-lg border border-[#bccabf] p-1">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`rounded p-2 ${viewMode === "grid" ? "bg-packify-green text-white" : "text-[#42544e]"}`}
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`rounded p-2 ${viewMode === "list" ? "bg-packify-green text-white" : "text-[#42544e]"}`}
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
                          checked={sustainableOnly}
                          onChange={(e) => setSustainableOnly(e.target.checked)}
                          className="rounded border-[#bccabf] text-packify-green focus:ring-packify-green"
                        />
                        <span
                          className="text-sm"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          Sustainable Only
                        </span>
                        <Leaf className="h-4 w-4 text-packify-green" />
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={inStockOnly}
                          onChange={(e) => setInStockOnly(e.target.checked)}
                          className="rounded border-[#bccabf] text-packify-green focus:ring-packify-green"
                        />
                        <span
                          className="text-sm"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          In Stock Only
                        </span>
                        <Zap className="h-4 w-4 text-[#ff9500]" />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Materials Grid/List */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredMaterials.map((material) => (
                    <div
                      key={material.id}
                      className="rounded-xl border border-[#bccabf] bg-white p-6 transition-shadow hover:shadow-lg"
                    >
                      {/* Header */}
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <h3
                              className="text-lg font-bold text-[#171d19]"
                              style={{ fontFamily: "Manrope, sans-serif" }}
                            >
                              {material.name}
                            </h3>
                            {material.featured && (
                              <Star className="h-4 w-4 fill-current text-[#ff9500]" />
                            )}
                            {material.sustainable && (
                              <Leaf className="h-4 w-4 text-packify-green" />
                            )}
                          </div>
                          <p
                            className="text-sm text-[#42544e]"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            {material.category} • {material.subcategory}
                          </p>
                          {material.weight && (
                            <p
                              className="text-xs text-[#42544e]"
                              style={{ fontFamily: "Inter, sans-serif" }}
                            >
                              {material.weight} • {material.thickness}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Image banner */}
                      {material.image && (
                        <div className="-mx-6 -mt-2 mb-4 h-36 overflow-hidden">
                          <Image
                            src={material.image}
                            alt={material.name}
                            width={400}
                            height={144}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}

                      {/* Applications */}
                      <div className="mb-4">
                        <p className="mb-2 text-xs font-bold tracking-wider text-[#42544e] uppercase">
                          Applications
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {material.applications
                            .slice(0, 2)
                            .map((app, index) => (
                              <span
                                key={index}
                                className="rounded-full bg-[#e7ffef] px-2 py-1 text-xs text-[#006c47]"
                                style={{ fontFamily: "Inter, sans-serif" }}
                              >
                                {app}
                              </span>
                            ))}
                          {material.applications.length > 2 && (
                            <span className="rounded-full bg-[#eff5ee] px-2 py-1 text-xs text-[#42544e]">
                              +{material.applications.length - 2}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between border-t border-[#e6e3e2] pt-3">
                        <div>
                          <p
                            className="text-sm font-bold text-[#171d19]"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            {material.priceRange}
                          </p>
                          <p
                            className="text-xs text-[#42544e]"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            {material.supplier}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-1 text-xs ${
                              material.availability === "In Stock"
                                ? "bg-[#e7ffef] text-[#006c47]"
                                : material.availability === "Limited"
                                  ? "bg-[#fff3cd] text-[#ff9500]"
                                  : "bg-[#ffdad6] text-[#ba1a1a]"
                            }`}
                          >
                            {material.availability}
                          </span>
                          <button className="p-1 text-[#42544e] transition-colors hover:text-[#006c47]">
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
                      className="flex flex-col items-center justify-between gap-6 rounded-lg border border-[#bccabf] bg-white p-6 transition-shadow hover:shadow-lg lg:flex-row"
                    >
                      <div className="flex w-full flex-1 flex-col items-center gap-6 sm:flex-row sm:items-start lg:w-auto lg:items-center">
                        {material.image ? (
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-[#bccabf]">
                            <Image
                              src={material.image}
                              alt={material.name}
                              width={56}
                              height={56}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div
                            className="h-12 w-12 shrink-0 rounded-lg border border-[#bccabf]"
                            style={{ backgroundColor: material.color }}
                          />
                        )}
                        <div className="flex-1 text-center sm:text-left">
                          <div className="mb-1 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                            <h3
                              className="text-lg font-bold text-[#171d19]"
                              style={{ fontFamily: "Manrope, sans-serif" }}
                            >
                              {material.name}
                            </h3>
                            {material.featured && (
                              <Star className="h-4 w-4 fill-current text-[#ff9500]" />
                            )}
                            {material.sustainable && (
                              <Leaf className="h-4 w-4 text-packify-green" />
                            )}
                          </div>
                          <p
                            className="mb-2 text-sm text-[#42544e]"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            {material.category} • {material.subcategory}
                            {material.weight && ` • ${material.weight}`}
                          </p>
                          <p
                            className="text-sm text-[#42544e]"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            {material.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex w-full flex-wrap items-center justify-between gap-6 border-t border-[#bccabf]/30 pt-4 sm:justify-end lg:w-auto lg:border-t-0 lg:pt-0">
                        <div className="text-center">
                          <p
                            className="text-sm font-bold text-[#171d19]"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            {material.priceRange}
                          </p>
                          <p
                            className="text-xs text-[#42544e]"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            {material.supplier}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs ${
                            material.availability === "In Stock"
                              ? "bg-[#e7ffef] text-[#006c47]"
                              : material.availability === "Limited"
                                ? "bg-[#fff3cd] text-[#ff9500]"
                                : "bg-[#ffdad6] text-[#ba1a1a]"
                          }`}
                        >
                          {material.availability}
                        </span>
                        <button className="p-2 text-[#42544e] transition-colors hover:text-[#006c47]">
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredMaterials.length === 0 && (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#eff5ee]">
                    <Search className="h-8 w-8 text-[#42544e]" />
                  </div>
                  <h3
                    className="mb-2 text-lg font-semibold text-[#171d19]"
                    style={{ fontFamily: "Manrope, sans-serif" }}
                  >
                    No materials found
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
