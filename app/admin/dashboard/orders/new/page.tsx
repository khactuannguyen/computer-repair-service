import { checkRole } from "@/lib/auth/auth"
import connectToDatabase from "@/lib/db/mongodb"
import User from "@/lib/db/models/User"
import { createRepairOrder } from "@/lib/actions/repair-order-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

async function getTechnicians() {
  await connectToDatabase()

  const technicians = await User.find({
    role: { $in: ["admin", "technician"] },
  })
    .select("_id name")
    .lean()

  return technicians.map((tech) => ({
    id: tech._id.toString(),
    name: tech.name,
  }))
}

export default async function NewOrderPage() {
  await checkRole(["admin", "receptionist"])
  const technicians = await getTechnicians()

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link href="/admin/dashboard/orders" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Tạo đơn sửa chữa mới</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin đơn sửa chữa</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createRepairOrder} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Thông tin khách hàng</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
                    Tên khách hàng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="customerPhone"
                    name="customerPhone"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Thông tin thiết bị</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="deviceType" className="block text-sm font-medium text-gray-700">
                    Loại thiết bị <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="deviceType"
                    name="deviceType"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                  >
                    <option value="">Chọn loại thiết bị</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Desktop">Máy tính để bàn</option>
                    <option value="Tablet">Máy tính bảng</option>
                    <option value="Phone">Điện thoại</option>
                    <option value="Printer">Máy in</option>
                    <option value="Other">Khác</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="deviceBrand" className="block text-sm font-medium text-gray-700">
                    Hãng sản xuất
                  </label>
                  <input
                    type="text"
                    id="deviceBrand"
                    name="deviceBrand"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="deviceModel" className="block text-sm font-medium text-gray-700">
                    Model
                  </label>
                  <input
                    type="text"
                    id="deviceModel"
                    name="deviceModel"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700">
                    Số serial
                  </label>
                  <input
                    type="text"
                    id="serialNumber"
                    name="serialNumber"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Thông tin sửa chữa</h3>
              <div>
                <label htmlFor="issueDescription" className="block text-sm font-medium text-gray-700">
                  Mô tả vấn đề <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="issueDescription"
                  name="issueDescription"
                  rows={3}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="estimatedCost" className="block text-sm font-medium text-gray-700">
                    Chi phí ước tính (VND)
                  </label>
                  <input
                    type="number"
                    id="estimatedCost"
                    name="estimatedCost"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="estimatedCompletionDate" className="block text-sm font-medium text-gray-700">
                    Ngày hoàn thành dự kiến
                  </label>
                  <input
                    type="date"
                    id="estimatedCompletionDate"
                    name="estimatedCompletionDate"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">
                  Kỹ thuật viên phụ trách
                </label>
                <select
                  id="assignedTo"
                  name="assignedTo"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                >
                  <option value="">Chọn kỹ thuật viên</option>
                  {technicians.map((tech) => (
                    <option key={tech.id} value={tech.id}>
                      {tech.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="internalNotes" className="block text-sm font-medium text-gray-700">
                  Ghi chú nội bộ
                </label>
                <textarea
                  id="internalNotes"
                  name="internalNotes"
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Link href="/admin/dashboard/orders">
                <Button variant="outline" type="button">
                  Hủy
                </Button>
              </Link>
              <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600">
                Tạo đơn sửa chữa
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
