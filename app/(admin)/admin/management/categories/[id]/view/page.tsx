"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CategoryViewPage() {
  const params = useParams();
  const id = params?.id as string;
  const [cat, setCat] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/categories/${id}`)
      .then((res) => res.json())
      .then(setCat);
  }, [id]);

  if (!cat) return <div className="p-4">Đang tải...</div>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chi tiết danh mục</h1>
      <div className="bg-white rounded shadow p-4">
        <div className="mb-2">
          <span className="font-semibold">Tên danh mục (VI): </span>
          {cat.name?.vi}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Tên danh mục (EN): </span>
          {cat.name?.en}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Mô tả (VI): </span>
          {cat.description?.vi}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Mô tả (EN): </span>
          {cat.description?.en}
        </div>
        <div className="text-xs text-gray-400 mt-4">
          Tạo lúc: {new Date(cat.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
