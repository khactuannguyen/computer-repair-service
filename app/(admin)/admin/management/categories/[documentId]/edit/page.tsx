"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Globe } from "lucide-react"
import Link from "next/link"

interface CategoryTranslation {
  _id: string
  documentId: string
  locale: string
  name: string
  description: string
  slug: string
  order: number
  isActive: boolean
}

interface CategoryFormData {
  vi?: {
    _id?: string
    name: string
    description: string
    slug: string
  }
  en?: {
    _id?: string
    name: string
    description: string
    slug: string
  }
  order: number
  isActive: boolean
}

export default function CategoryEditPage() {
  const router = useRouter()
  const params = useParams()
  const documentId = params?.documentId as string

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<CategoryFormData>({
    order: 0,
    isActive: true,
  })

  useEffect(() => {
    if (!documentId) return
    fetchCategoryTranslations()
  }, [documentId])

  const fetchCategoryTranslations = async () => {
    try {
      setFetching(true)
      const response = await fetch(`/api/admin/categories?documentId=${documentId}`)
      const data = await response.json()

      if (data.success) {
        const translations = data.data
        setFormData({
          vi: translations.vi
            ? {
                _id: translations.vi._id,
                name: translations.vi.name,
                description: translations.vi.description,
                slug: translations.vi.slug,
              }
            : undefined,
          en: translations.en
            ? {
                _id: translations.en._id,
                name: translations.en.name,
                description: translations.en.description,
                slug: translations.en.slug,
              }
            : undefined,
          order: translations.vi?.order || translations.en?.order || 0,
          isActive: translations.vi?.isActive ?? translations.en?.isActive ?? true,
        })
      }
    } catch (error) {
      console.error("Error fetching category:", error)
      setError("Không thể tải thông tin danh mục")
    } finally {
      setFetching(false)
    }
  }

  const handleLocaleChange = (locale: "vi" | "en", field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [locale]: {
        ...prev[locale],
        [field]: value,
        // Auto-generate slug from name
        ...(field === "name" && {
          slug: value
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, ""),
        }),
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Update or create Vietnamese translation
      if (formData.vi && formData.vi.name) {
        if (formData.vi._id) {
          // Update existing translation
          const viRes = await fetch(`/api/admin/categories/${formData.vi._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: formData.vi.name,
              description: formData.vi.description,
              slug: formData.vi.slug,
              order: formData.order,
              isActive: formData.isActive,
            }),
          })

          if (!viRes.ok) {
            const viError = await viRes.json()
            throw new Error(viError.error || "Lỗi khi cập nhật bản dịch tiếng Việt")
          }
        } else {
          // Create new translation
          const viRes = await fetch("/api/admin/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              documentId,
              locale: "vi",
              name: formData.vi.name,
              description: formData.vi.description,
              slug: formData.vi.slug,
              order: formData.order,
              isActive: formData.isActive,
            }),
          })

          if (!viRes.ok) {
            const viError = await viRes.json()
            throw new Error(viError.error || "Lỗi khi tạo bản dịch tiếng Việt")
          }
        }
      }

      // Update or create English translation
      if (formData.en && formData.en.name) {
        if (formData.en._id) {
          // Update existing translation
          const enRes = await fetch(`/api/admin/categories/${formData.en._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: formData.en.name,
              description: formData.en.description,
              slug: formData.en.slug,
              order: formData.order,
              isActive: formData.isActive,
            }),
          })

          if (!enRes.ok) {
            const enError = await enRes.json()
            throw new Error(enError.error || "Lỗi khi cập nhật bản dịch tiếng Anh")
          }
        } else {
          // Create new translation
          const enRes = await fetch("/api/admin/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              documentId,
              locale: "en",
              name: formData.en.name,
              description: formData.en.description,
              slug: formData.en.slug,
              order: formData.order,
              isActive: formData.isActive,
            }),
          })

          if (!enRes.ok) {
            const enError = await enRes.json()
            console.warn("Failed to create English translation:", enError.error)
          }
        }
      }

      router.push("/admin/management/categories")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/management/categories">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Chỉnh sửa danh mục</h1>
          <p className="text-muted-foreground">Cập nhật thông tin danh mục với hỗ trợ đa ngôn ngữ</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Thông tin đa ngôn ngữ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="vi" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="vi" className="flex items-center gap-2">
                      🇻🇳 Tiếng Việt
                      {formData.vi && <span className="ml-1 w-2 h-2 bg-green-500 rounded-full"></span>}
                    </TabsTrigger>
                    <TabsTrigger value="en" className="flex items-center gap-2">
                      🇺🇸 English
                      {formData.en && <span className="ml-1 w-2 h-2 bg-green-500 rounded-full"></span>}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="vi" className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="name-vi">Tên danh mục (Tiếng Việt)</Label>
                      <Input
                        id="name-vi"
                        value={formData.vi?.name || ""}
                        onChange={(e) => handleLocaleChange("vi", "name", e.target.value)}
                        placeholder="Nhập tên danh mục..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description-vi">Mô tả (Tiếng Việt)</Label>
                      <Textarea
                        id="description-vi"
                        value={formData.vi?.description || ""}
                        onChange={(e) => handleLocaleChange("vi", "description", e.target.value)}
                        placeholder="Nhập mô tả danh mục..."
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug-vi">Slug (Tiếng Việt)</Label>
                      <Input
                        id="slug-vi"
                        value={formData.vi?.slug || ""}
                        onChange={(e) => handleLocaleChange("vi", "slug", e.target.value)}
                        placeholder="slug-danh-muc"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="en" className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="name-en">Category Name (English)</Label>
                      <Input
                        id="name-en"
                        value={formData.en?.name || ""}
                        onChange={(e) => handleLocaleChange("en", "name", e.target.value)}
                        placeholder="Enter category name..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description-en">Description (English)</Label>
                      <Textarea
                        id="description-en"
                        value={formData.en?.description || ""}
                        onChange={(e) => handleLocaleChange("en", "description", e.target.value)}
                        placeholder="Enter category description..."
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug-en">Slug (English)</Label>
                      <Input
                        id="slug-en"
                        value={formData.en?.slug || ""}
                        onChange={(e) => handleLocaleChange("en", "slug", e.target.value)}
                        placeholder="category-slug"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="order">Thứ tự hiển thị</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData((prev) => ({ ...prev, order: Number(e.target.value) || 0 }))}
                    min={0}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is-active">Kích hoạt</Label>
                  <Switch
                    id="is-active"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            {error && (
              <Card className="border-destructive">
                <CardContent className="pt-6">
                  <div className="text-sm text-destructive">{error}</div>
                </CardContent>
              </Card>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
