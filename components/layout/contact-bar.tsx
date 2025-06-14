"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Clock } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

export default function ContactBar() {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-primary text-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Desktop View */}
        <div className="hidden md:flex items-center justify-between py-2 text-sm">
          <div className="flex items-center space-x-6">
            <Link
              href={`tel:${t("contact.info.phone.number")}`}
              className="flex items-center hover:opacity-80"
            >
              <Phone className="h-4 w-4 mr-2" />
              <span>{t("contact.info.phone.number")}</span>
            </Link>
            <Link
              href={`mailto:${t("contact.info.email.address")}`}
              className="flex items-center hover:opacity-80"
            >
              <Mail className="h-4 w-4 mr-2" />
              <span>{t("contact.info.email.address")}</span>
            </Link>
            <Link
              href={t("contact.info.address.link")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:opacity-80"
            >
              <MapPin className="h-4 w-4 mr-2" />
              <span>{t("contact.info.address.full")}</span>
            </Link>

            <Clock className="mr-12 h-4 w-4" />
            <div className="flex flex-col items-start space-y-0.5">
              <span>
                <p>
                  {t("contact.info.hours.weekdays")}{" "}
                  {t("contact.info.hours.sunday")}
                </p>
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href={t("contact.info.facebook.link")}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80"
              aria-label="Facebook"
            >
              <Facebook className="h-4 w-4" />
            </Link>
            <Link
              href={t("contact.info.zalo.link")}
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
              <Link
                href={`tel:${t("contact.info.phone.number")}`}
                className="flex items-center"
                aria-label={t("contact.info.phone.title")}
              >
                <Phone className="h-4 w-4" />
              </Link>
              <Link
                href={`mailto:${t("contact.info.email.address")}`}
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
                href={t("contact.info.facebook.link")}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                href={t("contact.info.zalo.link")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="font-bold text-xs">Zalo</span>
              </Link>
            </div>
          </div>

          {/* Expanded mobile view */}
          <div
            id="mobile-contact-details"
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              isExpanded ? "max-h-24 opacity-100 pb-2" : "max-h-0 opacity-0"
            )}
            aria-hidden={!isExpanded}
          >
            <div className="flex flex-col space-y-1 text-xs">
              <div className="flex items-center">
                <Phone className="h-3 w-3 mr-1" />
                <span>{t("contact.info.phone.number")}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-3 w-3 mr-1" />
                <span>{t("contact.info.email.address")}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                <span className="truncate">
                  {t("contact.info.address.full")}
                </span>
              </div>
              <div className="flex flex-col items-start">
                <span>{t("contact.info.hours.weekdays")}</span>
                <span>{t("contact.info.hours.sunday")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
