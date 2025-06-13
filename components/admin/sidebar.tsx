"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { logoutAction } from "@/lib/actions/auth-actions"
import { LayoutDashboard, PenToolIcon as Tool, Users, Settings, LogOut, Menu, X } from "lucide-react"
import Image from "next/image"

interface SidebarProps {
  user: {
    name: string
    role: string
  }
}

export function AdminSidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const navigation = [
    {
      name: "Tổng quan",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      current: isActive("/admin/dashboard"),
      roles: ["admin", "technician", "receptionist"],
    },
    {
      name: "Đơn sửa chữa",
      href: "/admin/dashboard/orders",
      icon: Tool,
      current: isActive("/admin/dashboard/orders"),
      roles: ["admin", "technician", "receptionist"],
    },
    {
      name: "Người dùng",
      href: "/admin/dashboard/users",
      icon: Users,
      current: isActive("/admin/dashboard/users"),
      roles: ["admin"],
    },
    {
      name: "Cài đặt",
      href: "/admin/dashboard/settings",
      icon: Settings,
      current: isActive("/admin/dashboard/settings"),
      roles: ["admin"],
    },
  ]

  const filteredNavigation = navigation.filter((item) => item.roles.includes(user.role))

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-0 left-0 z-40 w-full bg-white border-b border-gray-200 lg:hidden">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center">
            <Image src="/laptopsun-logo.svg" alt="LaptopSun Logo" width={40} height={40} className="h-10 w-10" />
            <span className="ml-2 text-lg font-semibold">LaptopSun Admin</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed inset-y-0 left-0 z-40 w-64 bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
                <div className="flex items-center">
                  <Image src="/laptopsun-logo.svg" alt="LaptopSun Logo" width={40} height={40} className="h-10 w-10" />
                  <span className="ml-2 text-lg font-semibold">LaptopSun</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-2">
                  {filteredNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        item.current
                          ? "bg-yellow-100 text-yellow-800"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                        "group flex items-center px-2 py-2 text-base font-medium rounded-md",
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon
                        className={cn(
                          item.current ? "text-yellow-600" : "text-gray-400 group-hover:text-gray-500",
                          "mr-4 flex-shrink-0 h-6 w-6",
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-yellow-200 flex items-center justify-center">
                      <span className="text-yellow-800 font-medium text-sm">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user.name}</div>
                    <div className="text-sm font-medium text-gray-500 capitalize">{user.role}</div>
                  </div>
                </div>
                <form action={logoutAction} className="mt-4">
                  <Button type="submit" variant="outline" className="w-full flex items-center justify-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <Image src="/laptopsun-logo.svg" alt="LaptopSun Logo" width={40} height={40} className="h-10 w-10" />
              <span className="ml-2 text-lg font-semibold">LaptopSun</span>
            </div>
            <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
              {filteredNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    item.current
                      ? "bg-yellow-100 text-yellow-800"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                  )}
                >
                  <item.icon
                    className={cn(
                      item.current ? "text-yellow-600" : "text-gray-400 group-hover:text-gray-500",
                      "mr-3 flex-shrink-0 h-5 w-5",
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-yellow-200 flex items-center justify-center">
                  <span className="text-yellow-800 font-medium text-sm">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user.name}</p>
                <p className="text-xs font-medium text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
            <form action={logoutAction} className="mt-2">
              <Button type="submit" variant="outline" size="sm" className="w-full flex items-center justify-center">
                <LogOut className="mr-2 h-4 w-4" />
                Đăng xuất
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
