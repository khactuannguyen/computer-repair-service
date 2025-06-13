"use client"

import { useState } from "react"
import Link from "next/link"
import { Phone, Mail, MapPin, Facebook } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import { cn } from "@/lib/utils"

export default function ContactBar() {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-primary text-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Desktop View */}
        <div className="hidden md:flex items-center justify-between py-2 text-sm">
          <div className="flex items-center space-x-6">
            <Link href="tel:0857270270" className="flex items-center hover:opacity-80">
              <Phone className="h-4 w-4 mr-2" />
              <span>0857 270 270</span>
            </Link>
            <Link href="mailto:support@laptopsun.vn" className="flex items-center hover:opacity-80">
              <Mail className="h-4 w-4 mr-2" />
              <span>support@laptopsun.vn</span>
            </Link>
            <Link
              href="https://maps.app.goo.gl/Yx5Yx5Yx5Yx5Yx5Yx5"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:opacity-80"
            >
              <MapPin className="h-4 w-4 mr-2" />
              <span>995 CMT8, Phường 7, Quận Tân Bình, TP.HCM</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="https://www.facebook.com/laptopsun"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80"
              aria-label="Facebook"
            >
              <Facebook className="h-4 w-4" />
            </Link>
            <Link
              href="https://zalo.me/0857270270"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80"
            >
              <span className="font-bold">Zalo</span>
            </Link>
          </div>
        </div>

        {/* Mobile View - Collapsible */}
        <div className="md:hidden">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <Link href="tel:0857270270" className="flex items-center" aria-label={t("contact.info.phone.title")}>
                <Phone className="h-4 w-4" />
              </Link>
              <Link
                href="mailto:support@laptopsun.vn"
                className="flex items-center"
                aria-label={t("contact.info.email.title")}
              >
                <Mail className="h-4 w-4" />
              </Link>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs underline"
              aria-expanded={isExpanded}
              aria-controls="mobile-contact-details"
            >
              {isExpanded ? t("common.less") : t("common.more")}
            </button>
            <div className="flex items-center space-x-3">
              <Link
                href="https://www.facebook.com/laptopsun"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link href="https://zalo.me/0857270270" target="_blank" rel="noopener noreferrer">
                <span className="font-bold text-xs">Zalo</span>
              </Link>
            </div>
          </div>

          {/* Expanded mobile view */}
          <div
            id="mobile-contact-details"
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              isExpanded ? "max-h-20 opacity-100 pb-2" : "max-h-0 opacity-0",
            )}
            aria-hidden={!isExpanded}
          >
            <div className="flex flex-col space-y-1 text-xs">
              <div className="flex items-center">
                <Phone className="h-3 w-3 mr-1" />
                <span>0857 270 270</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-3 w-3 mr-1" />
                <span>support@laptopsun.vn</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                <span className="truncate">995 CMT8, Phường 7, Quận Tân Bình, TP.HCM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
