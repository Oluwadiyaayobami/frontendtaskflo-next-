"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface ImageData {
  url: string
  public_id: string
}

interface ProductImageUploadProps {
  onImagesChange: (images: ImageData[]) => void
}

export function ProductImageUpload({ onImagesChange }: ProductImageUploadProps) {
  const [images, setImages] = useState<ImageData[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setIsUploading(true)

    try {
      for (const file of Array.from(files)) {
        // Validate file
        if (!file.type.startsWith("image/")) {
          toast({
            title: "Invalid file",
            description: "Please select an image file",
            variant: "destructive",
          })
          continue
        }

        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Image must be less than 5MB",
            variant: "destructive",
          })
          continue
        }

        // Create FormData for Cloudinary
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "")

        // Upload to Cloudinary
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          },
        )

        if (!response.ok) {
          throw new Error("Upload failed")
        }

        const data = await response.json()

        // Add to images and previews
        const imageData: ImageData = {
          url: data.secure_url,
          public_id: data.public_id,
        }

        setImages((prev) => [...prev, imageData])
        onImagesChange([...images, imageData])

        // Create preview
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            setPreviews((prev) => [...prev, event.target.result as string])
          }
        }
        reader.readAsDataURL(file)
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      toast({
        title: "Success",
        description: "Images uploaded successfully",
      })
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)
    setImages(newImages)
    setPreviews(newPreviews)
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-input rounded-lg p-6 text-center hover:bg-muted/50 transition">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="cursor-pointer block">
          <p className="text-sm font-medium mb-2">Click to upload or drag and drop</p>
          <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4 bg-transparent"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Select Images"}
        </Button>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="relative w-full h-32 rounded-lg overflow-hidden bg-slate-200">
                <Image src={preview || "/placeholder.svg"} alt={`Preview ${index + 1}`} fill className="object-cover" />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                onClick={() => removeImage(index)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
