"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { ProductImageUpload } from "@/components/product-image-upload"

interface ImageData {
  url: string
  public_id: string
}

export default function AddProductPage() {
  const router = useRouter()
  const { agent, token, isLoading } = useAuth()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<ImageData[]>([])
  const [formData, setFormData] = useState({
    productname: "",
    decription: "",
    producttype: "",
  })

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login")
    }
    if (!isLoading && agent && !agent.hasPaid) {
      toast({
        title: "Access Denied",
        description: "You need to verify payment to add products",
        variant: "destructive",
      })
      router.push("/dashboard")
    }
  }, [token, isLoading, agent, router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImagesChange = (newImages: ImageData[]) => {
    setImages(newImages)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.productname || !formData.decription || !formData.producttype) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    if (images.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please upload at least one image",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/addproduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          images,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add product")
      }

      toast({
        title: "Success",
        description: "Product added to marketplace",
      })

      setFormData({
        productname: "",
        decription: "",
        producttype: "",
      })
      setImages([])

      router.push("/agent-dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">Loading...</div>
      </div>
    )
  }

  if (!agent || !agent.hasPaid) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <header className="border-b bg-white dark:bg-slate-900 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">CampusHub</h1>
          <Link href="/dashboard">
            <Button variant="ghost">Back to Dashboard</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
            <CardDescription>List your item on the marketplace</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="productname" className="text-sm font-medium">
                  Product Name *
                </label>
                <Input
                  id="productname"
                  name="productname"
                  placeholder="e.g., Used Textbook"
                  value={formData.productname}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="decription" className="text-sm font-medium">
                  Description *
                </label>
                <textarea
                  id="decription"
                  name="decription"
                  placeholder="Describe your product in detail..."
                  value={formData.decription}
                  onChange={handleChange}
                  required
                  className="w-full min-h-[120px] px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="producttype" className="text-sm font-medium">
                  Product Type *
                </label>
                <Input
                  id="producttype"
                  name="producttype"
                  placeholder="e.g., Books, Electronics, Furniture"
                  value={formData.producttype}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Product Images *</label>
                <ProductImageUpload onImagesChange={handleImagesChange} />
                {images.length > 0 && (
                  <p className="text-sm text-muted-foreground">{images.length} image(s) uploaded</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Adding Product..." : "Add Product"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
