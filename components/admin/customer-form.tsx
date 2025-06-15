import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CustomerForm({ initialData, onSave, loading }: any) {
  const [form, setForm] = useState({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    note: initialData?.note || "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Name and phone are required");
      return;
    }
    setError("");
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <Input name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Phone <span className="text-red-500">*</span>
        </label>
        <Input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <Input name="email" value={form.email} onChange={handleChange} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Note</label>
        <Textarea name="note" value={form.note} onChange={handleChange} />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
