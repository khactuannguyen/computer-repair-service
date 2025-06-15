import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import CustomerForm from "@/components/admin/customer-form";

export default function CustomerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/admin/customers/${id}`)
      .then((res) => res.json())
      .then((data) => setCustomer(data.customer))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (form: any) => {
    setLoading(true);
    await fetch(`/api/admin/customers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setEditing(false);
    fetch(`/api/admin/customers/${id}`)
      .then((res) => res.json())
      .then((data) => setCustomer(data.customer))
      .finally(() => setLoading(false));
  };

  if (loading) return <div>Loading...</div>;
  if (!customer) return <div>Customer not found</div>;

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Customer Detail</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </div>
      {editing ? (
        <CustomerForm
          initialData={customer}
          onSave={handleSave}
          loading={loading}
        />
      ) : (
        <div className="space-y-4">
          <div>
            <b>Name:</b> {customer.name}
          </div>
          <div>
            <b>Phone:</b> {customer.phone}
          </div>
          <div>
            <b>Email:</b> {customer.email}
          </div>
          <div>
            <b>Note:</b> {customer.note}
          </div>
          <Button onClick={() => setEditing(true)}>Edit</Button>
        </div>
      )}
    </div>
  );
}
