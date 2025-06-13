"use client"

import { Phone, Mail, MapPin, Clock, Facebook } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import Link from "next/link"

export default function ContactInfo() {
  const { t } = useTranslation()

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h2 className="text-2xl font-bold">{t("contact.info.title")}</h2>
      <p className="mt-2 text-muted-foreground">{t("contact.info.subtitle")}</p>

      <div className="mt-8 space-y-6">
        <div className="flex items-start">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Phone className="h-5 w-5 text-primary" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium">{t("contact.info.phone.title")}</h3>
            <p className="mt-1 text-muted-foreground">{t("contact.info.phone.subtitle")}</p>
            <Link href="tel:0857270270" className="mt-2 block font-medium text-primary hover:underline">
              0857 270 270
            </Link>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium">{t("contact.info.email.title")}</h3>
            <p className="mt-1 text-muted-foreground">{t("contact.info.email.subtitle")}</p>
            <Link href="mailto:support@laptopsun.vn" className="mt-2 block font-medium text-primary hover:underline">
              support@laptopsun.vn
            </Link>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium">{t("contact.info.address.title")}</h3>
            <p className="mt-1 text-muted-foreground">{t("contact.info.address.subtitle")}</p>
            <address className="mt-2 not-italic">995 CMT8, Phường 7, Quận Tân Bình, TP.HCM</address>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium">{t("contact.info.hours.title")}</h3>
            <p className="mt-1 text-muted-foreground">{t("contact.info.hours.subtitle")}</p>
            <div className="mt-2 space-y-1">
              <p>{t("contact.info.hours.weekdays")}</p>
              <p>{t("contact.info.hours.weekend")}</p>
            </div>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Facebook className="h-5 w-5 text-primary" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium">{t("contact.info.social.title")}</h3>
            <p className="mt-1 text-muted-foreground">{t("contact.info.social.subtitle")}</p>
            <div className="mt-2 flex space-x-4">
              <Link
                href="https://www.facebook.com/laptopsun"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Facebook
              </Link>
              <Link
                href="https://zalo.me/0857270270"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Zalo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
