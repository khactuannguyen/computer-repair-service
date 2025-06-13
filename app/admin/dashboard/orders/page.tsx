import { checkAuth } from "@/lib/auth/auth"
import connectToDatabase from "@/lib/db/mongodb"
import RepairOrder from "@/lib/db/models/RepairOrder"
import User from "@/lib/db/models/User"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

interface SearchParams {
  status?: string
  search?: string
}

async function getOrders(searchParams: SearchParams) {
  await connectToDatabase()

  const query: any = {}

  if (searchParams.status && searchParams.status !== "all") {
    query.status = searchParams.status
  }

  if (searchParams.search) {
    const searchRegex = new RegExp(searchParams.search, "i")
    query.$or = [
      { customerName: searchRegex },
      { customerPhone: searchRegex },
      { trackingCode: searchRegex },
      { deviceType: searchRegex },
    ]
  }

  const orders = await RepairOrder.find(query).sort({ createdAt: -1 }).lean()

  // Get technicians for assigned orders
  const technicianIds = orders.filter((order) => order.assignedTo).map((order) => order.assignedTo)

  const technicians = await User.find({
    _id: { $in: technicianIds },
  }).lean()

  const technicianMap = technicians.reduce(
    (acc, tech) => {
      acc[tech._id.toString()] = tech.name
      return acc
    },
    {} as Record<string, string>,
  )

  return orders.map((order) => ({
    ...order,
    technicianName: order.assignedTo ? technicianMap[order.assignedTo.toString()] : null,
    id: order._id.toString(),
  }))
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  await checkAuth()
  const orders = await getOrders(searchParams)

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý"
      case "in_progress":
        return "Đang sửa"
      case "completed":
        return "Hoàn thành"
      case "cancelled":
        return "Đã hủy"
      default:
        return status
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold">Đơn sửa chữa</h1>
        <Button asChild className="mt-4 sm:mt-0 bg-yellow-400 hover:bg-yellow-500">
          <Link href="/admin/dashboard/orders/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Tạo đơn mới
          </Link>
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <form className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                name="search"
                placeholder="Tìm kiếm theo tên, số điện thoại, mã đơn..."
                defaultValue={searchParams.search || ""}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="w-full sm:w-48">
              <select
                name="status"
                defaultValue={searchParams.status || "all"}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xử lý</option>
                <option value="in_progress">Đang sửa</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
            <Button type="submit">Lọc</Button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Mã đơn
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Khách hàng
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Thiết bị
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Kỹ thuật viên
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Trạng thái
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ngày tạo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.trackingCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{order.customerName}</div>
                      <div className="text-xs">{order.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.deviceType}
                      {order.deviceBrand && ` - ${order.deviceBrand}`}
                      {order.deviceModel && ` ${order.deviceModel}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.technicianName || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(order.status)}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/dashboard/orders/${order.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Chi tiết
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    Không tìm thấy đơn sửa chữa nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
