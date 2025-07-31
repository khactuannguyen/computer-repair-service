"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";


export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    fetch(`/api/admin/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.order) {
          setOrder(data.order);
        }
      })
      .finally(() => setLoading(false));
  }, [orderId]);

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
          <Link href="/admin/management/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/admin/management/orders/${orderId}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Đơn hàng #{order.code || order._id}
            {order.status === "completed" && (
              <Badge variant="default">Hoàn thành</Badge>
            )}
            {order.status === "cancelled" && (
              <Badge variant="destructive">Đã hủy</Badge>
            )}
            {order.status === "pending" && (
              <Badge variant="secondary">Chờ xử lý</Badge>
            )}
            {order.status === "in_progress" && (
              <Badge variant="outline">Đang sửa chữa</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="font-semibold">Khách hàng: </span>
            {order.customerName}
          </div>
          <div>
            <span className="font-semibold">Số điện thoại: </span>
            {order.customerPhone}
          </div>
          {order.customerEmail && (
            <div>
              <span className="font-semibold">Email: </span>
              {order.customerEmail}
            </div>
          )}
          <div>
            <span className="font-semibold">Thiết bị: </span>
            {order.deviceType} {order.deviceBrand && `- ${order.deviceBrand}`}{" "}
            {order.deviceModel && `- ${order.deviceModel}`}
          </div>
          {order.serialNumber && (
            <div>
              <span className="font-semibold">Serial: </span>
              {order.serialNumber}
            </div>
          )}
          <div>
            <span className="font-semibold">Mô tả vấn đề: </span>
            <div className="whitespace-pre-line mt-1">
              {order.issueDescription}
            </div>
          </div>
          {order.estimatedCost && (
            <div>
              <span className="font-semibold">Chi phí ước tính: </span>
              {order.estimatedCost.toLocaleString()} VNĐ
            </div>
          )}
          {order.estimatedCompletionDate && (
            <div>
              <span className="font-semibold">Ngày hoàn thành dự kiến: </span>
              {new Date(order.estimatedCompletionDate).toLocaleDateString()}
            </div>
          )}
          {order.assignedTo && (
            <div>
              <span className="font-semibold">Kỹ thuật viên: </span>
              {order.assignedToName || order.assignedTo}
            </div>
          )}
          {order.internalNotes && (
            <div>
              <span className="font-semibold">Ghi chú nội bộ: </span>
              <div className="whitespace-pre-line mt-1">
                {order.internalNotes}
              </div>
            </div>
          )}
          <div>
            <span className="font-semibold">Ngày tạo: </span>
            {order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}
          </div>
          <div>
            <span className="font-semibold">Cập nhật lần cuối: </span>
            {order.updatedAt ? new Date(order.updatedAt).toLocaleString() : ""}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
