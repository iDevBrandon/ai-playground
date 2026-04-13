"use client"

import { Button } from "@/components/ui/button"
import { PackageOpen, Upload, Search, Filter } from "lucide-react"
import Link from "next/link"
import { useState, Suspense } from "react"
import dynamic from "next/dynamic"

const ThreeDPreview = dynamic(() => import("@/components/ThreeDPreview"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
      <div className="text-center">
        <PackageOpen className="h-12 w-12 text-gray-400 mx-auto mb-2" />
        <p className="text-xs text-gray-500">Loading 3D...</p>
      </div>
    </div>
  )
})

const mockupCategories = [
  "All",
  "Boxes",
  "Bottles",
  "Bags",
  "Labels",
  "Pouches",
  "Tubes"
]

const mockups = [
  {
    id: 1,
    title: "Software Box Mockup",
    category: "Boxes",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=400&fit=crop&auto=format",
    description: "Professional software packaging design",
    tags: ["Yellow", "Orange", "Clean"]
  },
  {
    id: 2,
    title: "Cosmetic Bottle",
    category: "Bottles",
    image: "https://images.unsplash.com/photo-1556229162-51e50e7b8257?w=400&h=400&fit=crop&auto=format", 
    description: "Elegant cosmetic bottle design",
    tags: ["Silver", "Minimalist", "Premium"]
  },
  {
    id: 3,
    title: "Product Box",
    category: "Boxes",
    image: "https://images.unsplash.com/photo-1558618666-fbd51c2cd2d6?w=400&h=400&fit=crop&auto=format",
    description: "Clean product packaging mockup",
    tags: ["White", "Simple", "Modern"]
  },
  {
    id: 4,
    title: "Shopping Bag",
    category: "Bags",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop&auto=format",
    description: "Plastic shopping bag mockup",
    tags: ["White", "Handle", "Retail"]
  },
  {
    id: 5,
    title: "Glass Bottle",
    category: "Bottles", 
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format",
    description: "Clear glass bottle design",
    tags: ["Clear", "Glass", "Beverage"]
  },
  {
    id: 6,
    title: "Paper Bag",
    category: "Bags",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&auto=format",
    description: "Kraft paper bag mockup",
    tags: ["Brown", "Eco", "Paper"]
  },
  {
    id: 7,
    title: "Cardboard Box",
    category: "Boxes",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&auto=format",
    description: "Brown cardboard shipping box",
    tags: ["Brown", "Shipping", "Cardboard"]
  },
  {
    id: 8,
    title: "Clear Pouch",
    category: "Pouches",
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop&auto=format", 
    description: "Transparent packaging pouch",
    tags: ["Clear", "Flexible", "Food"]
  },
  {
    id: 9,
    title: "Coffee Package",
    category: "Pouches",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop&auto=format",
    description: "Coffee bean packaging pouch",
    tags: ["Black", "Coffee", "Premium"]
  },
  {
    id: 10,
    title: "Wine Bottle",
    category: "Bottles",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=400&fit=crop&auto=format",
    description: "Elegant wine bottle packaging",
    tags: ["Dark", "Elegant", "Wine"]
  },
  {
    id: 11,
    title: "Gift Box",
    category: "Boxes",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&auto=format",
    description: "Premium gift box design",
    tags: ["Pink", "Luxury", "Gift"]
  },
  {
    id: 12,
    title: "Tube Packaging",
    category: "Tubes",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format",
    description: "Cosmetic tube packaging",
    tags: ["White", "Minimal", "Cosmetic"]
  },
  {
    id: 13,
    title: "Cylinder Plastic Jar",
    category: "Bottles",
    image: "https://images.unsplash.com/photo-1585218062008-28ed2b7da47a?w=400&h=400&fit=crop&auto=format",
    description: "Plastic jar mockup with 3D rendering",
    tags: ["White", "Plastic", "Container", "3D"]
  }
]

export default function MockupPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<number>>(new Set())

  const filteredMockups = mockups.filter(mockup => {
    const matchesCategory = selectedCategory === "All" || mockup.category === selectedCategory
    const matchesSearch = mockup.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mockup.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mockup.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3">
              <PackageOpen className="h-8 w-8 text-primary" />
              <span className="text-xl font-semibold text-gray-900">Packify</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href="/design-lab" className="text-gray-600 hover:text-gray-900 transition-colors">
                Design Lab
              </Link>
              <Button className="bg-primary text-white hover:bg-primary/90">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Packaging Mockup Tools
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Upload your design to realistic packaging mockups. See how your brand looks on boxes, bottles, bags, and more.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search mockups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Browse Mockups</h2>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">Filter by category</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {mockupCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Mockup Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMockups.map((mockup) => (
              <Link key={mockup.id} href={`/tools/mockup/${mockup.id}`}>
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {[2, 5, 10, 13].includes(mockup.id) ? (
                      // Show 3D Preview for models that have 3D support
                      <Suspense fallback={
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <div className="text-center">
                            <PackageOpen className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">Loading 3D...</p>
                          </div>
                        </div>
                      }>
                        <ThreeDPreview
                          modelPath="/3d/plastic_bottle.glb"
                          packageColor="#ffffff"
                          autoRotate={true}
                        />
                      </Suspense>
                    ) : (
                      // Show static image for other mockups
                      <>
                        {!imageLoadErrors.has(mockup.id) ? (
                          <img 
                            src={mockup.image} 
                            alt={mockup.title}
                            className="w-full h-full object-cover transition-opacity duration-300"
                            onError={() => {
                              setImageLoadErrors(prev => new Set([...prev, mockup.id]))
                            }}
                            onLoad={(e) => {
                              e.currentTarget.style.opacity = '1'
                            }}
                            style={{opacity: 0}}
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <PackageOpen className="h-16 w-16 text-gray-400" />
                          </div>
                        )}
                      </>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="bg-white/90 rounded-lg px-4 py-2 flex items-center space-x-2">
                        <Upload className="h-5 w-5 text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">
                          {[2, 5, 10, 13].includes(mockup.id) ? "Try in 3D" : "Upload Design"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{mockup.title}</h3>
                      {([2, 5, 10, 13].includes(mockup.id)) && (
                        <span className="bg-primary/10 text-primary px-2 py-1 text-xs font-medium rounded-full border border-primary/20">
                          3D
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{mockup.description}</p>
                    
                    <div className="flex flex-wrap gap-1">
                      {mockup.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {filteredMockups.length === 0 && (
            <div className="text-center py-12">
              <PackageOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No mockups found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Need a custom mockup?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Can't find the perfect mockup? We can create custom packaging mockups for your specific needs.
          </p>
          <Button className="bg-primary text-white hover:bg-primary/90">
            Request Custom Mockup
          </Button>
        </div>
      </section>
    </div>
  )
}