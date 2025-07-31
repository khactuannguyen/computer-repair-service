"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";


export default function EditOrderPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    status: "pending",
    estimatedCost: 0,
    estimatedCompletionDate: "",
    assignedTo: "",
    internalNotes: "",
    trackingCode: "",
    service: "",
  });

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    fetch(`/api/admin/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.order) {
          setOrder(data.order);
          setFormData({
            status: data.order.status || "pending",
            estimatedCost: data.order.estimatedCost || 0,
            estimatedCompletionDate: data.order.estimatedCompletionDate
              ? data.order.estimatedCompletionDate.slice(0, 10)
              : "",
            assignedTo: data.order.assignedTo || "",
            internalNotes: data.order.internalNotes || "",
            trackingCode: data.order.trackingCode || "",
            service: data.order.service || "",
          });
        }
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  useEffect(() => {
    fetch("/api/admin/services?page=1&limit=100")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.services) {
          setServices(
            data.services.map((s: any) => ({ id: s._id, name: s.name }))
          );
        }
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        router.push(`/admin/management/orders/${orderId}`);
      } else {
        // handle error
        alert("Cập nhật đơn hàng thất bại");
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi cập nhật đơn hàng");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-24 text-muted-foreground">
        <p>Không tìm thấy đơn hàng</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/admin/management/orders/${orderId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Cập nhật đơn hàng #{order.code || order._id}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Trạng thái
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                  required
                >
                  <option value="pending">Chờ xử lý</option>
                  <option value="in_progress">Đang sửa chữa</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="estimatedCost"
                  className="block text-sm font-medium text-gray-700"
                >
                  Chi phí ước tính (VND)
                </label>
                <input
                  type="number"
                  id="estimatedCost"
                  name="estimatedCost"
                  value={formData.estimatedCost}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="estimatedCompletionDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ngày hoàn thành dự kiến
                </label>
                <input
                  type="date"
                  id="estimatedCompletionDate"
                  name="estimatedCompletionDate"
                  value={formData.estimatedCompletionDate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="assignedTo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Kỹ thuật viên phụ trách
                </label>
                <input
                  type="text"
                  id="assignedTo"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                  placeholder="Nhập ID hoặc tên kỹ thuật viên"
                />
              </div>
              <div>
                <label
                  htmlFor="trackingCode"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mã đơn hàng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="trackingCode"
                  name="trackingCode"
                  value={formData.trackingCode}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="service"
                  className="block text-sm font-medium text-gray-700"
                >
                  Dịch vụ <span className="text-red-500">*</span>
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                >
                  <option value="">Chọn dịch vụ</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name.vi} / {service.name.en}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label
                htmlFor="internalNotes"
                className="block text-sm font-medium text-gray-700"
              >
                Ghi chú nội bộ
              </label>
              <textarea
                id="internalNotes"
                name="internalNotes"
                rows={2}
                value={formData.internalNotes}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600"
                disabled={saving}
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Lưu thay đổi
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
