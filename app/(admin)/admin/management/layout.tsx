import type React from "react";
import { checkAuth } from "@/lib/auth/auth";
import { AdminSidebar } from "@/components/admin/sidebar";

export const dynamic = "force-dynamic";

export default async function AdminManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await checkAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar
        user={{ name: session.name as string, role: session.role as string }}
      />
      <div className="lg:pl-64">
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
