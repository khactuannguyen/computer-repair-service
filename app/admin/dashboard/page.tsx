"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { repairOrders } from "@/lib/orders-data"
import { useTranslation } from "@/hooks/use-translation"

export default function AdminDashboardPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { t } = useTranslation()

  const filteredOrders = repairOrders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.deviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">{t("admin.dashboard.title")}</h1>
          <p className="text-muted-foreground">{t("admin.dashboard.subtitle")}</p>
        </div>
        <Button asChild>
          <Link href="/admin/dashboard/new-order">{t("admin.dashboard.new_order")}</Link>
        </Button>
      </div>

      <div className="mt-8 rounded-lg border bg-card p-4 shadow-sm">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <div className="flex-1">
            <Input
              placeholder={t("admin.dashboard.search_placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">{t("admin.dashboard.status.all")}</option>
              <option value="pending">{t("admin.dashboard.status.pending")}</option>
              <option value="in-progress">{t("admin.dashboard.status.in_progress")}</option>
              <option value="completed">{t("admin.dashboard.status.completed")}</option>
              <option value="cancelled">{t("admin.dashboard.status.cancelled")}</option>
            </select>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-medium">{t("admin.dashboard.table.order_id")}</th>
                <th className="text-left p-2 font-medium">{t("admin.dashboard.table.customer")}</th>
                <th className="text-left p-2 font-medium">{t("admin.dashboard.table.device")}</th>
                <th className="text-left p-2 font-medium">{t("admin.dashboard.table.service")}</th>
                <th className="text-left p-2 font-medium">{t("admin.dashboard.table.date")}</th>
                <th className="text-left p-2 font-medium">{t("admin.dashboard.table.status")}</th>
                <th className="text-right p-2 font-medium">{t("admin.dashboard.table.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{order.id}</td>
                    <td className="p-2">{order.customerName}</td>
                    <td className="p-2">{order.deviceType}</td>
                    <td className="p-2">{order.service}</td>
                    <td className="p-2">{order.date}</td>
                    <td className="p-2">
                      <Badge className={getStatusColor(order.status)} variant="outline">
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-2 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/dashboard/orders/${order.id}`}>{t("common.view")}</Link>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center p-8">
                    {t("admin.dashboard.no_orders")}
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
