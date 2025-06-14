"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ServiceCard from "@/components/services/service-card"
import { services } from "@/lib/services-data"
import { useTranslation } from "@/hooks/use-translation"

export default function ServicesPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("all")

  // Group services by category
  const macbookServices = services.filter((service) => service.category === "macbook")
  const laptopServices = services.filter((service) => service.category === "laptop")
  const dataServices = services.filter((service) => service.category === "data")

  const getServicesForTab = () => {
    switch (activeTab) {
      case "macbook":
        return macbookServices
      case "laptop":
        return laptopServices
      case "data":
        return dataServices
      default:
        return services
    }
  }

  const tabs = [
    { id: "all", label: t("services.tabs.all") },
    { id: "macbook", label: t("services.tabs.macbook") },
    { id: "laptop", label: t("services.tabs.laptop") },
    { id: "data", label: t("services.tabs.data") },
  ]

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{t("services.title")}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t("services.subtitle")}</p>
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
            {getServicesForTab().map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16 space-y-8 rounded-lg bg-muted p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">{t("services.process.title")}</h2>
          <p className="mt-2 text-muted-foreground">{t("services.process.subtitle")}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-4">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              1
            </div>
            <h3 className="mt-4 text-lg font-medium">{t("services.process.diagnosis.title")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t("services.process.diagnosis.description")}</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              2
            </div>
            <h3 className="mt-4 text-lg font-medium">{t("services.process.approval.title")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t("services.process.approval.description")}</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              3
            </div>
            <h3 className="mt-4 text-lg font-medium">{t("services.process.repair.title")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t("services.process.repair.description")}</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              4
            </div>
            <h3 className="mt-4 text-lg font-medium">{t("services.process.quality.title")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t("services.process.quality.description")}</p>
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
  )
}
