"use client"

import { Suspense } from "react"
import ContactForm from "@/components/contact/contact-form"
import ContactInfo from "@/components/contact/contact-info"
import { useTranslation } from "@/hooks/use-translation"

export default function ContactPage() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{t("contact.title")}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t("contact.subtitle")}</p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <ContactInfo />

        <div>
          <Suspense fallback={<div className="text-center py-8">{t("common.loading")}</div>}>
            <ContactForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
