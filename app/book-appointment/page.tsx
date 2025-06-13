"use client"

import { Suspense } from "react"
import BookingFormWrapper from "@/components/booking/booking-form-wrapper"
import { useTranslation } from "@/hooks/use-translation"

export default function BookAppointmentPage() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{t("booking.title")}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t("booking.subtitle")}</p>
      </div>

      <div className="mt-12">
        <Suspense fallback={<div className="text-center py-8">{t("common.loading")}</div>}>
          <BookingFormWrapper />
        </Suspense>
      </div>

      <div className="mt-16 space-y-8 rounded-lg bg-muted p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">{t("booking.expectations.title")}</h2>
          <p className="mt-2 text-muted-foreground">{t("booking.expectations.subtitle")}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              1
            </div>
            <h3 className="mt-4 text-lg font-medium">{t("booking.expectations.confirmation.title")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t("booking.expectations.confirmation.description")}</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              2
            </div>
            <h3 className="mt-4 text-lg font-medium">{t("booking.expectations.diagnosis.title")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t("booking.expectations.diagnosis.description")}</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              3
            </div>
            <h3 className="mt-4 text-lg font-medium">{t("booking.expectations.repair.title")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t("booking.expectations.repair.description")}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
