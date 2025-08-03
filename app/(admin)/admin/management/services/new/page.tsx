"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Globe } from "lucide-react"
import Link from "next/link"

interface ServiceFormData {
  vi?: {
    name: string
    description: string
    shortDescription: string
    slug: string
  }
  en?: {
    name: string
    description: string
    shortDescription: string
    slug: string
  }
  price: {
    from: number
    to: number
  }
  estimatedTime: string
  categoryDocumentId: string
  icon: string
  warranty: string
  isActive: boolean
  isFeatured: boolean
  order: number
}

interface Category {
  _id: string
  documentId: string
  locale: string
  name: string
}

export default function NewServicePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState<ServiceFormData>({
    price: {
      from: 0,
      to: 0,
    },
    estimatedTime: "",
    categoryDocumentId: "",
    icon: "laptop",
    warranty: "3 tháng",
    isActive: true,
    isFeatured: false,
    order: 0,
  })

  const icons = [
    { value: "laptop", label: "Laptop" },
    { value: "monitor", label: "Monitor" },
    { value: "smartphone", label: "Smartphone" },
    { value: "harddrive", label: "Hard Drive" },
    { value: "cpu", label: "CPU" },
    { value: "wrench", label: "Wrench" },
  ]

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories?locale=vi")
      const data = await response.json()
      if (data.success) {
        setCategories(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
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
      // Validate at least one translation
      if (!formData.vi?.name && !formData.en?.name) {
        throw new Error("Vui lòng nhập tên dịch vụ cho ít nhất một ngôn ngữ")
      }

      if (!formData.categoryDocumentId) {
        throw new Error("Vui lòng chọn danh mục")
      }

      // Create Vietnamese translation if provided
      if (formData.vi && formData.vi.name) {
        const viRes = await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            locale: "vi",
            name: formData.vi.name,
            description: formData.vi.description,
            shortDescription: formData.vi.shortDescription,
            categoryDocumentId: formData.categoryDocumentId,
            price: formData.price,
            estimatedTime: formData.estimatedTime,
            icon: formData.icon,
            warranty: formData.warranty,
            isActive: formData.isActive,
            isFeatured: formData.isFeatured,
            order: formData.order,
          }),
        })

        if (!viRes.ok) {
          const viError = await viRes.json()
          throw new Error(viError.error || "Lỗi khi tạo bản dịch tiếng Việt")
        }

        const viData = await viRes.json()
        const documentId = viData.service.documentId

        // Create English translation if provided
        if (formData.en && formData.en.name) {
          const enRes = await fetch("/api/admin/services", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              documentId, // Use the same documentId
              locale: "en",
              name: formData.en.name,
              description: formData.en.description,
              shortDescription: formData.en.shortDescription,
              categoryDocumentId: formData.categoryDocumentId,
              price: formData.price,
              estimatedTime: formData.estimatedTime,
              icon: formData.icon,
              warranty: formData.warranty,
              isActive: formData.isActive,
              isFeatured: formData.isFeatured,
              order: formData.order,
            }),
          })

          if (!enRes.ok) {
            const enError = await enRes.json()
            console.warn("Failed to create English translation:", enError.error)
          }
        }
      } else if (formData.en && formData.en.name) {
        // Only English translation provided
        const enRes = await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            locale: "en",
            name: formData.en.name,
            description: formData.en.description,
            shortDescription: formData.en.shortDescription,
            categoryDocumentId: formData.categoryDocumentId,
            price: formData.price,
            estimatedTime: formData.estimatedTime,
            icon: formData.icon,
            warranty: formData.warranty,
            isActive: formData.isActive,
            isFeatured: formData.isFeatured,
            order: formData.order,
          }),
        })

        if (!enRes.ok) {
          const enError = await enRes.json()
          throw new Error(enError.error || "Lỗi khi tạo bản dịch tiếng Anh")
        }
      }

      router.push("/admin/management/services")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/management/services">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Thêm dịch vụ mới</h1>
          <p className="text-muted-foreground">Tạo dịch vụ sửa chữa mới với hỗ trợ đa ngôn ngữ</p>
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
                    </TabsTrigger>
                    <TabsTrigger value="en" className="flex items-center gap-2">
                      🇺🇸 English
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="vi" className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="name-vi">Tên dịch vụ (Tiếng Việt)</Label>
                      <Input
                        id="name-vi"
                        value={formData.vi?.name || ""}
                        onChange={(e) => handleLocaleChange("vi", "name", e.target.value)}
                        placeholder="Nhập tên dịch vụ..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description-vi">Mô tả (Tiếng Việt)</Label>
                      <Textarea
                        id="description-vi"
                        value={formData.vi?.description || ""}
                        onChange={(e) => handleLocaleChange("vi", "description", e.target.value)}
                        placeholder="Nhập mô tả dịch vụ..."
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="short-description-vi">Mô tả ngắn (Tiếng Việt)</Label>
                      <Textarea
                        id="short-description-vi"
                        value={formData.vi?.shortDescription || ""}
                        onChange={(e) => handleLocaleChange("vi", "shortDescription", e.target.value)}
                        placeholder="Nhập mô tả ngắn..."
                        rows={2}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="en" className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="name-en">Service Name (English)</Label>
                      <Input
                        id="name-en"
                        value={formData.en?.name || ""}
                        onChange={(e) => handleLocaleChange("en", "name", e.target.value)}
                        placeholder="Enter service name..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description-en">Description (English)</Label>
                      <Textarea
                        id="description-en"
                        value={formData.en?.description || ""}
                        onChange={(e) => handleLocaleChange("en", "description", e.target.value)}
                        placeholder="Enter service description..."
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="short-description-en">Short Description (English)</Label>
                      <Textarea
                        id="short-description-en"
                        value={formData.en?.shortDescription || ""}
                        onChange={(e) => handleLocaleChange("en", "shortDescription", e.target.value)}
                        placeholder="Enter short description..."
                        rows={2}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Giá và thời gian</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price-from">Giá từ (VNĐ)</Label>
                    <Input
                      id="price-from"
                      type="number"
                      value={formData.price.from}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          price: {
                            ...prev.price,
                            from: Number.parseInt(e.target.value) || 0,
                          },
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price-to">Giá đến (VNĐ) - Tùy chọn</Label>
                    <Input
                      id="price-to"
                      type="number"
                      value={formData.price.to}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          price: {
                            ...prev.price,
                            to: Number.parseInt(e.target.value) || 0,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="estimated-time">Thời gian ước tính</Label>
                    <Input
                      id="estimated-time"
                      value={formData.estimatedTime}
                      onChange={(e) => setFormData((prev) => ({ ...prev, estimatedTime: e.target.value }))}
                      placeholder="VD: 2-3 giờ"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warranty">Bảo hành</Label>
                    <Input
                      id="warranty"
                      value={formData.warranty}
                      onChange={(e) => setFormData((prev) => ({ ...prev, warranty: e.target.value }))}
                      placeholder="VD: 3 tháng"
                    />
                  </div>
                </div>
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
                  <Label htmlFor="category">Danh mục</Label>
                  <Select
                    value={formData.categoryDocumentId}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryDocumentId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.documentId} value={cat.documentId}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Select
                    value={formData.icon}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, icon: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {icons.map((icon) => (
                        <SelectItem key={icon.value} value={icon.value}>
                          {icon.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Thứ tự hiển thị</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData((prev) => ({ ...prev, order: Number.parseInt(e.target.value) || 0 }))}
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

                <div className="flex items-center justify-between">
                  <Label htmlFor="is-featured">Nổi bật</Label>
                  <Switch
                    id="is-featured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isFeatured: checked }))}
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
              Lưu dịch vụ
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
