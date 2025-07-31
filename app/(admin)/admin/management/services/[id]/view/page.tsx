"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { ArrowLeft, Pencil } from "lucide-react";


export default function ServiceDetailPage() {
  const { t, locale } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const serviceId = params?.id as string;
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!serviceId) return;
    setLoading(true);
    fetch(`/api/admin/services/${serviceId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.service) {
          setService(data.service);
        }
      })
      .finally(() => setLoading(false));
  }, [serviceId]);

  const getLocalizedText = (text: { vi: string; en: string }) => {
    return text?.[locale] || text?.vi || "";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center py-24 text-muted-foreground">
        {t("common.page_not_found")}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/management/services">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Link>
        </Button>
        <Button variant="secondary" size="sm" asChild>
          <Link href={`/admin/management/services/${serviceId}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getLocalizedText(service.name)}
            {service.isFeatured && (
              <Badge variant="default">{t("services.card.featured")}</Badge>
            )}
            {!service.isActive && <Badge variant="destructive">Inactive</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="font-semibold">
              {t("services.card.estimated_time")}:{" "}
            </span>
            {service.estimatedTime}
          </div>
          <div>
            <span className="font-semibold">{t("services.card.price")}: </span>
            {service.price?.to && service.price?.to > service.price?.from
              ? `${service.price.from.toLocaleString()} - ${service.price.to.toLocaleString()} VNĐ`
              : `Từ ${service.price.from.toLocaleString()} VNĐ`}
          </div>
          <div>
            <span className="font-semibold">Danh mục: </span>
            {service.category?.name?.[locale] ||
              service.category?.name?.vi ||
              service.category}
          </div>
          {service.imageUrl && (
            <div>
              <img
                src={service.imageUrl}
                alt="Service"
                className="rounded-lg max-h-60"
              />
            </div>
          )}
          <div>
            <span className="font-semibold">{t("common.description")}: </span>
            <div className="whitespace-pre-line mt-1">
              {getLocalizedText(service.description)}
            </div>
          </div>
          {service.shortDescription?.vi && (
            <div>
              <span className="font-semibold">{t("common.more")}: </span>
              <div className="whitespace-pre-line mt-1">
                {getLocalizedText(service.shortDescription)}
              </div>
            </div>
          )}
          <div>
            <span className="font-semibold">Bảo hành: </span>
            {service.warranty}
          </div>
          <div>
            <span className="font-semibold">Thứ tự hiển thị: </span>
            {service.order}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
