"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CategoryNewPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: { vi: "", en: "" },
    description: { vi: "", en: "" },
    order: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    lang: "vi" | "en",
    field: "name" | "description",
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Có lỗi xảy ra");
      router.push("/admin/management/categories");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Thêm danh mục</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-4 rounded shadow"
      >
        {["vi", "en"].map((lang) => (
          <div key={lang}>
            <label className="block font-semibold mb-1">
              Tên danh mục ({lang.toUpperCase()})
            </label>
            <input
              className="w-full border rounded px-3 py-2 mb-2"
              value={form.name[lang as "vi" | "en"]}
              onChange={(e) =>
                handleChange(lang as "vi" | "en", "name", e.target.value)
              }
              required
            />
            <label className="block font-semibold mb-1">
              Mô tả ({lang.toUpperCase()})
            </label>
            <textarea
              className="w-full border rounded px-3 py-2"
              value={form.description[lang as "vi" | "en"]}
              onChange={(e) =>
                handleChange(lang as "vi" | "en", "description", e.target.value)
              }
            />
          </div>
        ))}
        {error && <div className="text-red-500">{error}</div>}
        <div>
          <label className="block font-semibold mb-1">
            Thứ tự hiển thị <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2 mb-2"
            value={form.order}
            onChange={(e) =>
              setForm((f) => ({ ...f, order: Number(e.target.value) }))
            }
            required
            min={0}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Đang lưu..." : "Lưu"}
        </Button>
      </form>
    </div>
  );
}
