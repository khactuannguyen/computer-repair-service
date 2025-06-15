"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";

export const dynamic = "force-dynamic";

export default function NewServicePage() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: {
      vi: "",
      en: "",
    },
    description: {
      vi: "",
      en: "",
    },
    shortDescription: {
      vi: "",
      en: "",
    },
    price: {
      from: 0,
      to: 0,
    },
    estimatedTime: "",
    category: "laptop",
    icon: "wrench",
    imageUrl: "",
    warranty: "3 tháng",
    isActive: true,
    isFeatured: false,
    order: 0,
  });
  const [categories, setCategories] = useState<any[]>([]);

  const icons = [
    { value: "laptop", label: "Laptop" },
    { value: "monitor", label: "Monitor" },
    { value: "smartphone", label: "Smartphone" },
    { value: "harddrive", label: "Hard Drive" },
    { value: "cpu", label: "CPU" },
    { value: "wrench", label: "Wrench" },
  ];

  // Fetch categories from API
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/management/services");
      } else {
        console.error("Error creating service");
      }
    } catch (error) {
      console.error("Error creating service:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateLocalizedField = (field: string, lang: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev,
        [lang]: value,
      },
    }));
  };

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
          <p className="text-muted-foreground">
            Tạo dịch vụ sửa chữa mới cho cửa hàng
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="vi" className="w-full">
                  <TabsList>
                    <TabsTrigger value="vi">Tiếng Việt</TabsTrigger>
                    <TabsTrigger value="en">English</TabsTrigger>
                  </TabsList>

                  <TabsContent value="vi" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name-vi">Tên dịch vụ (Tiếng Việt)</Label>
                      <Input
                        id="name-vi"
                        value={formData.name.vi}
                        onChange={(e) =>
                          updateLocalizedField("name", "vi", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description-vi">Mô tả (Tiếng Việt)</Label>
                      <Textarea
                        id="description-vi"
                        value={formData.description.vi}
                        onChange={(e) =>
                          updateLocalizedField(
                            "description",
                            "vi",
                            e.target.value
                          )
                        }
                        rows={4}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="short-description-vi">
                        Mô tả ngắn (Tiếng Việt)
                      </Label>
                      <Textarea
                        id="short-description-vi"
                        value={formData.shortDescription.vi}
                        onChange={(e) =>
                          updateLocalizedField(
                            "shortDescription",
                            "vi",
                            e.target.value
                          )
                        }
                        rows={2}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="en" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name-en">Service Name (English)</Label>
                      <Input
                        id="name-en"
                        value={formData.name.en}
                        onChange={(e) =>
                          updateLocalizedField("name", "en", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description-en">
                        Description (English)
                      </Label>
                      <Textarea
                        id="description-en"
                        value={formData.description.en}
                        onChange={(e) =>
                          updateLocalizedField(
                            "description",
                            "en",
                            e.target.value
                          )
                        }
                        rows={4}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="short-description-en">
                        Short Description (English)
                      </Label>
                      <Textarea
                        id="short-description-en"
                        value={formData.shortDescription.en}
                        onChange={(e) =>
                          updateLocalizedField(
                            "shortDescription",
                            "en",
                            e.target.value
                          )
                        }
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
                        updateFormData("price", {
                          ...formData.price,
                          from: Number.parseInt(e.target.value) || 0,
                        })
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
                        updateFormData("price", {
                          ...formData.price,
                          to: Number.parseInt(e.target.value) || 0,
                        })
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
                      onChange={(e) =>
                        updateFormData("estimatedTime", e.target.value)
                      }
                      placeholder="VD: 2-3 giờ"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warranty">Bảo hành</Label>
                    <Input
                      id="warranty"
                      value={formData.warranty}
                      onChange={(e) =>
                        updateFormData("warranty", e.target.value)
                      }
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
                    value={formData.category}
                    onValueChange={(value) => updateFormData("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name?.[locale] || cat.name?.en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Select
                    value={formData.icon}
                    onValueChange={(value) => updateFormData("icon", value)}
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
                  <Label htmlFor="image-url">URL hình ảnh</Label>
                  <Input
                    id="image-url"
                    value={formData.imageUrl}
                    onChange={(e) => updateFormData("imageUrl", e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Thứ tự hiển thị</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      updateFormData(
                        "order",
                        Number.parseInt(e.target.value) || 0
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is-active">Kích hoạt</Label>
                  <Switch
                    id="is-active"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      updateFormData("isActive", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is-featured">Nổi bật</Label>
                  <Switch
                    id="is-featured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) =>
                      updateFormData("isFeatured", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

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
  );
}
