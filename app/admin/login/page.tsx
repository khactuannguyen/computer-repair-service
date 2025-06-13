"use client"

import { useState } from "react"
import { loginAction } from "@/lib/actions/auth-actions"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import Image from "next/image"

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    try {
      const result = await loginAction(formData)
      if (result?.error) {
        setError(result.error)
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi đăng nhập")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Image src="/laptopsun-logo.svg" alt="LaptopSun Logo" width={80} height={80} className="h-20 w-20" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Đăng nhập quản trị</CardTitle>
          <CardDescription className="text-center">Đăng nhập để quản lý đơn sửa chữa</CardDescription>
        </CardHeader>
        <form action={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="admin@example.com"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Mật khẩu
              </label>
              <Input id="password" name="password" type="password" autoComplete="current-password" required />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-500" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
