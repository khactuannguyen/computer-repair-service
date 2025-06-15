"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function RepairOrderForm({ technicians, services }: any) {
  const router = useRouter();
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    deviceType: "",
    deviceBrand: "",
    deviceModel: "",
    serialNumber: "",
    trackingCode: "",
    service: "",
    issueDescription: "",
    estimatedCost: "",
    estimatedCompletionDate: "",
    assignedTo: "",
    internalNotes: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Đã xảy ra lỗi");
      } else {
        router.push("/admin/management/orders");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi gửi dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Thông tin khách hàng */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Thông tin khách hàng</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="customerName"
              className="block text-sm font-medium text-gray-700"
            >
              Tên khách hàng <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              required
              value={form.customerName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="customerPhone"
              className="block text-sm font-medium text-gray-700"
            >
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="customerPhone"
              name="customerPhone"
              required
              value={form.customerPhone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="customerEmail"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="customerEmail"
              name="customerEmail"
              value={form.customerEmail}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Thông tin thiết bị */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Thông tin thiết bị</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="deviceType"
              className="block text-sm font-medium text-gray-700"
            >
              Loại thiết bị <span className="text-red-500">*</span>
            </label>
            <select
              id="deviceType"
              name="deviceType"
              required
              value={form.deviceType}
              onChange={handleChange}
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
            <label
              htmlFor="deviceBrand"
              className="block text-sm font-medium text-gray-700"
            >
              Hãng sản xuất
            </label>
            <input
              type="text"
              id="deviceBrand"
              name="deviceBrand"
              value={form.deviceBrand}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="deviceModel"
              className="block text-sm font-medium text-gray-700"
            >
              Model
            </label>
            <input
              type="text"
              id="deviceModel"
              name="deviceModel"
              value={form.deviceModel}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="serialNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Số serial
            </label>
            <input
              type="text"
              id="serialNumber"
              name="serialNumber"
              value={form.serialNumber}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Thông tin sửa chữa */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Thông tin sửa chữa</h3>
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
            required
            value={form.trackingCode}
            onChange={handleChange}
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
            required
            value={form.service}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
          >
            <option value="">Chọn dịch vụ</option>
            {services.map((service: any) => (
              <option key={service.id} value={service.id}>
                {service.name.vi} / {service.name.en}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="issueDescription"
            className="block text-sm font-medium text-gray-700"
          >
            Mô tả vấn đề <span className="text-red-500">*</span>
          </label>
          <textarea
            id="issueDescription"
            name="issueDescription"
            rows={3}
            required
            value={form.issueDescription}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              value={form.estimatedCost}
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
              value={form.estimatedCompletionDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="assignedTo"
            className="block text-sm font-medium text-gray-700"
          >
            Kỹ thuật viên phụ trách
          </label>
          <select
            id="assignedTo"
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
          >
            <option value="">Chọn kỹ thuật viên</option>
            {technicians.map((tech: any) => (
              <option key={tech.id} value={tech.id}>
                {tech.name}
              </option>
            ))}
          </select>
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
            value={form.internalNotes}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
          />
        </div>
      </div>
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      <div className="flex justify-end space-x-3">
        <Button
          variant="outline"
          type="button"
          onClick={() => router.push("/admin/management/orders")}
        >
          Hủy
        </Button>
        <Button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600"
          disabled={loading}
        >
          {loading ? "Đang tạo..." : "Tạo đơn sửa chữa"}
        </Button>
      </div>
    </form>
  );
}
