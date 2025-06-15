"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Filter,
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

interface Service {
  _id: string;
  name: {
    vi: string;
    en: string;
  };
  description: {
    vi: string;
    en: string;
  };
  price: {
    from: number;
    to?: number;
  };
  category: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export const dynamic = "force-dynamic";

export default function AdminServicesPage() {
  const { t, locale } = useTranslation();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, [page, search, category]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(category !== "all" && { category }),
      });

      const response = await fetch(`/api/admin/services?${params}`);
      const data = await response.json();

      if (data.success) {
        setServices(data.services);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(
        data.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
      );
    } catch (e) {
      setCategories([]);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) return;

    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchServices();
      }
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const formatPrice = (price: Service["price"]) => {
    if (price.to) {
      return `${price.from.toLocaleString()} - ${price.to.toLocaleString()} VNĐ`;
    }
    return `Từ ${price.from.toLocaleString()} VNĐ`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Dịch vụ</h1>
          <p className="text-muted-foreground">
            Quản lý tất cả dịch vụ sửa chữa của cửa hàng
          </p>
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
          <CardTitle>Danh sách dịch vụ</CardTitle>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  {categories.find((c) => c.value === category)?.label}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categories.map((cat) => (
                  <DropdownMenuItem
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                  >
                    {cat.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thứ tự</TableHead>
                  <TableHead className="w-[100px]">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{service.name.vi}</div>
                        <div className="text-sm text-muted-foreground">
                          {service.name.en}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {service.category &&
                        typeof service.category === "object" &&
                        "name" in service.category
                          ? (service.category as any).name?.[locale] ||
                            (service.category as any).name?.vi ||
                            ""
                          : ""}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatPrice(service.price)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={service.isActive ? "default" : "secondary"}
                        >
                          {service.isActive ? "Hoạt động" : "Tạm dừng"}
                        </Badge>
                        {service.isFeatured && (
                          <Badge variant="outline">
                            {t("services.card.featured")}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{service.order}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/admin/management/services/${service._id}`}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Xem
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/admin/management/services/${service._id}/edit`}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Sửa
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(service._id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Hiển thị {(pagination.page - 1) * pagination.limit + 1} đến{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                trong {pagination.total} kết quả
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                >
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
  );
}
