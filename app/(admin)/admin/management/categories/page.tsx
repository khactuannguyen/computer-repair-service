"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface CategoryTranslation {
  _id: string
  documentId: string
  locale: string
  name: string
  description: string
  slug: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface CategoryGroup {
  documentId: string
  translations: {
    vi?: CategoryTranslation
    en?: CategoryTranslation
  }
  order: number
  isActive: boolean
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchCategories()
  }, [search])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      // Get all categories for both locales
      const [viRes, enRes] = await Promise.all([
        fetch("/api/admin/categories?locale=vi"),
        fetch("/api/admin/categories?locale=en"),
      ])

      const [viData, enData] = await Promise.all([viRes.json(), enRes.json()])

      // Group by documentId
      const grouped = new Map<string, CategoryGroup>()

      // Process Vietnamese categories
      if (viData.success) {
        viData.data.forEach((cat: CategoryTranslation) => {
          if (!grouped.has(cat.documentId)) {
            grouped.set(cat.documentId, {
              documentId: cat.documentId,
              translations: {},
              order: cat.order,
              isActive: cat.isActive,
            })
          }
          grouped.get(cat.documentId)!.translations.vi = cat
        })
      }

      // Process English categories
      if (enData.success) {
        enData.data.forEach((cat: CategoryTranslation) => {
          if (!grouped.has(cat.documentId)) {
            grouped.set(cat.documentId, {
              documentId: cat.documentId,
              translations: {},
              order: cat.order,
              isActive: cat.isActive,
            })
          }
          grouped.get(cat.documentId)!.translations.en = cat
        })
      }

      // Convert to array and filter by search
      const categoryGroups = Array.from(grouped.values())
        .filter((group) => {
          if (!search) return true
          const viName = group.translations.vi?.name?.toLowerCase() || ""
          const enName = group.translations.en?.name?.toLowerCase() || ""
          return viName.includes(search.toLowerCase()) || enName.includes(search.toLowerCase())
        })
        .sort((a, b) => a.order - b.order)

      setCategories(categoryGroups)
    } catch (e) {
      console.error("Error fetching categories:", e)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (translation: CategoryTranslation) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa bản dịch ${translation.locale.toUpperCase()} của danh mục này?`)) return

    try {
      const response = await fetch(`/api/admin/categories/${translation._id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchCategories()
      } else {
        const error = await response.json()
        alert(`Lỗi: ${error.error || "Không thể xóa danh mục"}`)
      }
    } catch (error) {
      console.error("Error deleting category:", error)
      alert("Có lỗi xảy ra khi xóa danh mục")
    }
  }

  const getTranslationStatus = (group: CategoryGroup) => {
    const hasVi = !!group.translations.vi
    const hasEn = !!group.translations.en

    if (hasVi && hasEn) return { status: "complete", text: "Đầy đủ", variant: "default" as const }
    if (hasVi && !hasEn) return { status: "partial", text: "Thiếu EN", variant: "secondary" as const }
    if (!hasVi && hasEn) return { status: "partial", text: "Thiếu VI", variant: "secondary" as const }
    return { status: "empty", text: "Trống", variant: "destructive" as const }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Danh mục</h1>
          <p className="text-muted-foreground">Quản lý tất cả danh mục dịch vụ với hỗ trợ đa ngôn ngữ</p>
        </div>
        <Button asChild>
          <Link href="/admin/management/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            Thêm danh mục
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Danh sách danh mục (Đa ngôn ngữ)
          </CardTitle>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm danh mục..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên danh mục</TableHead>
                  <TableHead>Trạng thái dịch</TableHead>
                  <TableHead>Thứ tự</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="w-[100px]">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((group) => {
                  const translationStatus = getTranslationStatus(group)
                  const primaryTranslation = group.translations.vi || group.translations.en

                  return (
                    <TableRow key={group.documentId}>
                      <TableCell>
                        <div className="space-y-1">
                          {group.translations.vi && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">VI</span>
                              <span className="font-medium">{group.translations.vi.name}</span>
                            </div>
                          )}
                          {group.translations.en && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">EN</span>
                              <span className="font-medium">{group.translations.en.name}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={translationStatus.variant}>{translationStatus.text}</Badge>
                      </TableCell>
                      <TableCell>{group.order}</TableCell>
                      <TableCell>
                        <Badge variant={group.isActive ? "default" : "secondary"}>
                          {group.isActive ? "Hoạt động" : "Tạm dừng"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {primaryTranslation?.createdAt
                          ? new Date(primaryTranslation.createdAt).toLocaleDateString()
                          : ""}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/management/categories/${group.documentId}/view`}>
                                <Eye className="mr-2 h-4 w-4" />
                                Xem
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/management/categories/${group.documentId}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Sửa
                              </Link>
                            </DropdownMenuItem>
                            {group.translations.vi && (
                              <DropdownMenuItem
                                onClick={() => handleDelete(group.translations.vi!)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Xóa VI
                              </DropdownMenuItem>
                            )}
                            {group.translations.en && (
                              <DropdownMenuItem
                                onClick={() => handleDelete(group.translations.en!)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Xóa EN
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
