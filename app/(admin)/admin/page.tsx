import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/auth"

export default async function AdminRootPage() {
  const session = await getSession()

  if (session) {
    // User is logged in, redirect to dashboard
    redirect("/admin/dashboard")
  } else {
    // User is not logged in, redirect to login
    redirect("/admin/login")
  }
}
