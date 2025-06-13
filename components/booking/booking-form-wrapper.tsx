"use client"

import { useSearchParams } from "next/navigation"
import BookingForm from "./booking-form"
import { useTranslation } from "@/hooks/use-translation"

export default function BookingFormWrapper() {
  const searchParams = useSearchParams()
  const serviceId = searchParams.get("service")
  const { t } = useTranslation()

  return <BookingForm initialServiceId={serviceId} />
}
