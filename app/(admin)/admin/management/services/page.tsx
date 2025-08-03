"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Globe } from "lucide-react"

interface ServiceTranslation {
  _id: string
  documentId: string
  locale: string
  name: string
  description: string
  price: {
    from: number
    to?: number
  }
  categoryDocumentId: string
  isActive: boolean
  isFeatured: boolean
  order: number
  createdAt: string
  updatedAt: string
  category?: {
    name: string
    documentId: string
  }
}

interface ServiceGroup {
  documentId: string
  translations: {
    vi?: ServiceTranslation
    en?: ServiceTranslation
  }
  order: number
  isActive: boolean
  isFeatured: boolean
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })

  useEffect(() => {
    fetchServices()
  }, [page, search])

  const fetchServices = async () => {
    try {
      setLoading(true)

      // Get all services for both locales
      const [viRes, enRes] = await Promise.all([
        fetch(`/api/admin/services?locale=vi&page=${page}&limit=10${search ? `&search=${search}` : ""}`),
        fetch(`/api/admin/services?locale=en&page=${page}&limit=10${search ? `&search=${search}` : ""}`),
      ])

      const [viData, enData] = await Promise.all([viRes.json(), enRes.json()])

      // Group by documentId
      const grouped = new Map<string, ServiceGroup>()

      // Process Vietnamese services
      if (viData.success) {
        viData.services.forEach((service: ServiceTranslation) => {
          if (!grouped.has(service.documentId)) {
            grouped.set(service.documentId, {
              documentId: service.documentId,
              translations: {},
              order: service.order,
              isActive: service.isActive,
              isFeatured: service.isFeatured,
            })
          }
          grouped.get(service.documentId)!.translations.vi = service
        })
        setPagination(viData.pagination)
      }

      // Process English services
      if (enData.success) {
        enData.services.forEach((service: ServiceTranslation) => {
          if (!grouped.has(service.documentId)) {
            grouped.set(service.documentId, {
              documentId: service.documentId,
              translations: {},
              order: service.order,
              isActive: service.isActive,
              isFeatured: service.isFeatured,
            })
          }
          grouped.get(service.documentId)!.translations.en = service
        })
      }

      // Convert to array and sort
      const serviceGroups = Array.from(grouped.values()).sort((a, b) => a.order - b.order)

      setServices(serviceGroups)
    } catch (error) {
      console.error("Error fetching services:", error)
      setServices([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (translation: ServiceTranslation) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa bản dịch ${translation.locale.toUpperCase()} của dịch vụ này?`)) return

    try {
      const response = await fetch(`/api/admin/services/${translation._id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchServices()
      } else {
        const error = await response.json()
        alert(`Lỗi: ${error.error || "Không thể xóa dịch vụ"}`)
      }
    } catch (error) {
      console.error("Error deleting service:", error)
      alert("Có lỗi xảy ra khi xóa dịch vụ")
    }
  }

  const formatPrice = (price: ServiceTranslation["price"]) => {
    if (price.to && price.to > price.from) {
      return `${price.from.toLocaleString()} - ${price.to.toLocaleString()} VNĐ`
    }
    return `Từ ${price.from.toLocaleString()} VNĐ`
  }

  const getTranslationStatus = (group: ServiceGroup) => {
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
          <h1 className="text-3xl font-bold">Quản lý Dịch vụ</h1>
          <p className="text-muted-foreground">Quản lý tất cả dịch vụ sửa chữa với hỗ trợ đa ngôn ngữ</p>
        </div>
        <Button asChild>
          <Link href="/admin/management/services/new">
            <Plus className="mr-2 h-4 w-4" />
            Thêm dịch vụ
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Danh sách dịch vụ (Đa ngôn ngữ)
          </CardTitle>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm dịch vụ..."
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
                  <TableHead>Tên dịch vụ</TableHead>
                  <TableHead>Trạng thái dịch</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thứ tự</TableHead>
                  <TableHead className="w-[100px]">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((group) => {
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
                      <TableCell>
                        <Badge variant="outline">{primaryTranslation?.category?.name || "N/A"}</Badge>
                      </TableCell>
                      <TableCell>{primaryTranslation && formatPrice(primaryTranslation.price)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge variant={group.isActive ? "default" : "secondary"}>
                            {group.isActive ? "Hoạt động" : "Tạm dừng"}
                          </Badge>
                          {group.isFeatured && <Badge variant="outline">Nổi bật</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>{group.order}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/management/services/${group.documentId}/view`}>
                                <Eye className="mr-2 h-4 w-4" />
                                Xem
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/management/services/${group.documentId}/edit`}>
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

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Hiển thị {(pagination.page - 1) * pagination.limit + 1} đến{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} trong {pagination.total} kết quả
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page <= 1}>
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= pagination.pages}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
