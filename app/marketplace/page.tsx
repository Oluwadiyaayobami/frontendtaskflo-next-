"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface Product {
  id: string
  productname: string
  decription: string
  producttype: string
  images: Array<{ url: string; public_id: string }>
  sellername: string
  sellernumber: string
}

interface ProductDetailModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  if (!isOpen || !product) return null

  const whatsappLink = `https://wa.me/${product.sellernumber.replace(/\D/g, "")}?text=Hi%20${encodeURIComponent(
    product.sellername
  )},%20I'm%20interested%20in%20your%20${encodeURIComponent(product.productname)}%20product.`

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold">{product.productname}</h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {product.images && product.images.length > 0 && (
            <div className="space-y-2">
              <div className="relative w-full h-96 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden">
                <Image
                  src={product.images[0].url || "/placeholder.svg"}
                  alt={product.productname}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, idx) => (
                    <div key={idx} className="relative h-24 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
                      <Image
                        src={img.url || "/placeholder.svg"}
                        alt={`${product.productname} ${idx + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Product Type</p>
              <p className="font-semibold">{product.producttype}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Description</p>
              <p className="text-foreground">{product.decription}</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg space-y-3 border">
              <h3 className="font-bold text-lg">Agent Information</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Agent Name</p>
                  <p className="font-semibold text-sm">@{product.sellername}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Contact Number</p>
                  <p className="font-mono text-sm">{product.sellernumber}</p>
                </div>
              </div>

              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Message on WhatsApp</Button>
              </a>

              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => {
                  navigator.clipboard.writeText(product.sellernumber)
                  alert("Phone number copied!")
                }}
              >
                Copy Phone Number
              </Button>
            </div>
          </div>

          <Button variant="outline" className="w-full bg-transparent" onClick={onClose}>
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function MarketplacePage() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/marketplace`
      )
      if (!response.ok) throw new Error("Failed to fetch products")

      const data = await response.json()

      // Correctly use 'allproductindb' and map _id to id
      const mappedProducts = (Array.isArray(data.allproductindb) ? data.allproductindb : []).map((p) => ({
        ...p,
        id: p._id,
      }))

      setProducts(mappedProducts)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to load marketplace products",
        variant: "destructive",
      })
    } finally {
      setProductsLoading(false)
    }
  }

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <header className="border-b bg-white dark:bg-slate-900 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            CampusHub
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/agent-login">
              <Button variant="outline">Agent Login</Button>
            </Link>
            <Link href="/agent-register">
              <Button>Become Agent</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
          <p className="text-muted-foreground">Browse products from campus agents and place orders</p>
        </div>

        {productsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin">Loading products...</div>
          </div>
        ) : products.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">No products available yet</p>
              <Link href="/">
                <Button>Back to Home</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleProductClick(product)}
              >
                {product.images && product.images.length > 0 && (
                  <div className="relative w-full h-48 bg-slate-200 dark:bg-slate-700">
                    <Image
                      src={product.images[0].url || "/placeholder.svg"}
                      alt={product.productname}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-lg text-balance">{product.productname}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{product.producttype}</p>
                  </div>
                  <p className="text-sm text-foreground line-clamp-2">{product.decription}</p>
                  <div className="pt-2 border-t space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Seller</p>
                      <p className="font-semibold text-sm">@{product.sellername}</p>
                    </div>
                    <p className="text-xs text-primary font-medium">Click to see agent info & message</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <ProductDetailModal product={selectedProduct} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
