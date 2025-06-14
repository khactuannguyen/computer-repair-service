"use client"

import { useEffect } from "react"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import { Button } from "@/components/ui/button"

export default function BookingConfirmationPage() {
  const { t } = useTranslation()

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-24 w-24 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold mb-6">{t("booking.confirmation.title")}</h1>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <p className="text-lg mb-4">{t("booking.confirmation.thank_you")}</p>
          <p className="mb-4">{t("booking.confirmation.email_sent")}</p>
          <p className="mb-6">{t("booking.confirmation.contact_soon")}</p>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">{t("booking.confirmation.what_next")}</h2>
            <ul className="text-left list-disc pl-6 mb-6 space-y-2">
              <li>{t("booking.confirmation.next_steps.check_email")}</li>
              <li>{t("booking.confirmation.next_steps.prepare")}</li>
              <li>{t("booking.confirmation.next_steps.questions")}</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild>
            <Link href="/">{t("booking.confirmation.buttons.home")}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/services">{t("booking.confirmation.buttons.services")}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
