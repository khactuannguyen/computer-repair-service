"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Laptop,
  Monitor,
  Smartphone,
  HardDrive,
  Cpu,
  Wrench,
} from "lucide-react";
import type { Service } from "@/lib/services-data";
import { useTranslation } from "@/hooks/use-translation";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const { t } = useTranslation();

  const getIcon = () => {
    switch (service.icon) {
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

  return (
    <Card className="flex h-full flex-col">
      <CardContent className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          {getIcon()}
        </div>
        <h3 className="mb-2 text-xl font-medium">{service.title}</h3>
        <p className="mb-4 flex-1 text-muted-foreground">
          {service.description}
        </p>
        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {t("services.card.price")}
            </span>
            <span className="text-lg font-bold">{service.price}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {t("services.card.estimated_time")}
            </span>
            <span className="text-sm">{service.estimatedTime}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t p-6 pt-4">
        <Button asChild className="w-full">
          <Link href={`/book-appointment?service=${service.id}`}>
            {t("services.card.book_now")}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
