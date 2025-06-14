import { checkAuth } from "@/lib/auth/auth";
import connectToDatabase from "@/lib/db/mongodb";
import RepairOrder from "@/lib/db/models/RepairOrder";
import User from "@/lib/db/models/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PenToolIcon as Tool,
  CheckCircle,
  Clock,
  AlertCircle,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getStats() {
  await connectToDatabase();

  const totalOrders = await RepairOrder.countDocuments();
  const pendingOrders = await RepairOrder.countDocuments({ status: "pending" });
  const inProgressOrders = await RepairOrder.countDocuments({
    status: "in_progress",
  });
  const completedOrders = await RepairOrder.countDocuments({
    status: "completed",
  });
  const totalUsers = await User.countDocuments();

  const recentOrders = await RepairOrder.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  return {
    totalOrders,
    pendingOrders,
    inProgressOrders,
    completedOrders,
    totalUsers,
    recentOrders,
  };
}

export default async function AdminDashboardPage() {
  await checkAuth();
  const stats = await getStats();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tổng quan</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng đơn sửa chữa
            </CardTitle>
            <Tool className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-gray-500">Tất cả đơn sửa chữa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đang chờ xử lý
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-gray-500">Đơn đang chờ xử lý</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang sửa chữa</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgressOrders}</div>
            <p className="text-xs text-gray-500">Đơn đang được sửa chữa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã hoàn thành</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedOrders}</div>
            <p className="text-xs text-gray-500">Đơn đã hoàn thành</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Đơn sửa chữa gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentOrders.length > 0 ? (
              <div className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <div
                    key={(
                      order._id as string | number | { toString(): string }
                    ).toString()}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-gray-500">
                        {order.deviceType}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.trackingCode}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "in_progress"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status === "pending"
                          ? "Chờ xử lý"
                          : order.status === "in_progress"
                          ? "Đang sửa"
                          : order.status === "completed"
                          ? "Hoàn thành"
                          : "Đã hủy"}
                      </span>
                      <Link
                        href={`/admin/dashboard/orders/${order._id}`}
                        className="block mt-1 text-xs text-blue-600 hover:underline"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-gray-500">
                Không có đơn sửa chữa nào
              </p>
            )}
            <div className="mt-4">
              <Link
                href="/admin/dashboard/orders"
                className="text-sm text-blue-600 hover:underline"
              >
                Xem tất cả đơn sửa chữa
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Thông tin hệ thống</CardTitle>
            <UsersIcon className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tổng số người dùng:</span>
                <span className="font-bold">{stats.totalUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Phiên bản hệ thống:</span>
                <span>1.0.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Trạng thái:</span>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  Hoạt động
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
