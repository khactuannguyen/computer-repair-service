import { checkRole } from "@/lib/auth/auth";
import connectToDatabase from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import { createRepairOrder } from "@/lib/actions/repair-order-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Service from "@/lib/db/models/Service";
import RepairOrderForm from "@/components/booking/repair-order-form";

export const dynamic = "force-dynamic";

async function getTechnicians() {
  await connectToDatabase();

  const technicians = await User.find({
    role: { $in: ["admin", "technician"] },
  })
    .select("_id name")
    .lean<{ _id: any; name: string }[]>();

  return technicians.map((tech) => ({
    id: tech._id.toString(),
    name: tech.name,
  }));
}

async function getServices() {
  await connectToDatabase();
  const services = await Service.find({ isActive: true })
    .select("_id name")
    .sort({ order: 1, createdAt: -1 })
    .lean();
  return services.map((s) => ({ id: s._id.toString(), name: s.name }));
}

export default async function NewOrderPage() {
  await checkRole(["admin", "receptionist"]);
  const technicians = await getTechnicians();
  const services = await getServices();

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link href="/admin/management/orders" className="mr-4">
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
          <RepairOrderForm
            createRepairOrder={createRepairOrder}
            technicians={technicians}
            services={services}
          />
        </CardContent>
      </Card>
    </div>
  );
}
