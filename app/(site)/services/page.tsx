"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Laptop,
  Monitor,
  Smartphone,
  HardDrive,
  Cpu,
  Wrench,
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

interface Service {
  _id: string;
  name: {
    vi: string;
    en: string;
  };
  description: {
    vi: string;
    en: string;
  };
  shortDescription?: {
    vi: string;
    en: string;
  };
  price: {
    from: number;
    to?: number;
  };
  estimatedTime: string;
  category: string;
  icon: string;
  imageUrl?: string;
  isActive: boolean;
  isFeatured: boolean;
}

export default function ServicesPage() {
  const { t, locale } = useTranslation();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchServices();
  }, [activeTab]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeTab !== "all") {
        params.append("category", activeTab);
      }

      const response = await fetch(`/api/services?${params}`);
      const data = await response.json();

      if (data.success) {
        setServices(data.services);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "laptop":
        return <Laptop className="h-6 w-6" />;
      case "monitor":
        return <Monitor className="h-6 w-6" />;
      case "smartphone":
        return <Smartphone className="h-6 w-6" />;
      case "harddrive":
        return <HardDrive className="h-6 w-6" />;
      case "cpu":
        return <Cpu className="h-6 w-6" />;
      default:
        return <Wrench className="h-6 w-6" />;
    }
  };

  const formatPrice = (price: Service["price"]) => {
    if (price.to && price.to > price.from) {
      return `${price.from.toLocaleString()} - ${price.to.toLocaleString()} VNĐ`;
    }
    return `Từ ${price.from.toLocaleString()} VNĐ`;
  };

  const getLocalizedText = (text: { vi: string; en: string }) => {
    return text[locale as keyof typeof text] || text.vi;
  };

  const tabs = [
    { id: "all", label: t("services.tabs.all") },
    { id: "macbook", label: t("services.tabs.macbook") },
    { id: "laptop", label: t("services.tabs.laptop") },
    { id: "data", label: t("services.tabs.data") },
  ];

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t("services.title")}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {t("services.subtitle")}
        </p>
      </div>

      <div className="mt-12">
        {/* Custom Tab Implementation */}
        <div className="flex flex-wrap justify-center gap-2 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card key={service._id} className="flex h-full flex-col">
                <CardContent className="flex flex-1 flex-col p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    {getIcon(service.icon)}
                  </div>
                  <h3 className="mb-2 text-xl font-medium">
                    {getLocalizedText(service.name)}
                  </h3>
                  <p className="mb-4 flex-1 text-muted-foreground">
                    {getLocalizedText(
                      service.shortDescription || service.description
                    )}
                  </p>
                  <div className="mt-auto space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {t("services.card.starting_from")}
                      </span>
                      <span className="text-lg font-bold">
                        {formatPrice(service.price)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {t("services.card.estimated_time")}
                      </span>
                      <span className="text-sm">{service.estimatedTime}</span>
                    </div>
                  </div>
                  {service.isFeatured && (
                    <Badge className="mt-2 w-fit">Nổi bật</Badge>
                  )}
                </CardContent>
                <CardFooter className="border-t p-6 pt-4">
                  <Button asChild className="w-full">
                    <Link href={`/book-appointment?service=${service._id}`}>
                      {t("services.card.book_now")}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Process and CTA sections remain the same */}
      <div className="mt-16 space-y-8 rounded-lg bg-muted p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">{t("services.process.title")}</h2>
          <p className="mt-2 text-muted-foreground">
            {t("services.process.subtitle")}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-4">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              1
            </div>
            <h3 className="mt-4 text-lg font-medium">
              {t("services.process.diagnosis.title")}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("services.process.diagnosis.description")}
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              2
            </div>
            <h3 className="mt-4 text-lg font-medium">
              {t("services.process.approval.title")}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("services.process.approval.description")}
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              3
            </div>
            <h3 className="mt-4 text-lg font-medium">
              {t("services.process.repair.title")}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("services.process.repair.description")}
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              4
            </div>
            <h3 className="mt-4 text-lg font-medium">
              {t("services.process.quality.title")}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("services.process.quality.description")}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 rounded-lg bg-primary p-8 text-primary-foreground">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">{t("services.custom.title")}</h2>
            <p className="mt-4">{t("services.custom.description")}</p>
          </div>
          <div className="flex items-center justify-center md:justify-end">
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">{t("services.custom.contact")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
