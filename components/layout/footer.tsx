"use client";

import Link from "next/link";
import { Facebook, Phone, Mail, MapPin, Clock } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import Image from "next/image";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-muted">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative h-8 w-8">
                <Image
                  src="/laptopsun-logo.svg"
                  alt="LaptopSun Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-lg font-semibold">LaptopSun</h3>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {t("footer.company_description")}
            </p>
            <div className="mt-6 flex space-x-4">
              <Link
                href="https://www.facebook.com/laptopsun"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://zalo.me/0857270270"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <span className="font-bold">Zalo</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold">{t("footer.quick_links")}</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/services"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {t("footer.our_services")}
                </Link>
              </li>
              <li>
                <Link
                  href="/book-appointment"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {t("nav.book_appointment")}
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {t("footer.repair_tips")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {t("footer.contact_us")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold">{t("footer.contact_us")}</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start">
                <Phone className="mr-2 h-5 w-5 text-muted-foreground" />
                <Link
                  href="tel:0857270270"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  0857 270 270
                </Link>
              </li>
              <li className="flex items-start">
                <Mail className="mr-2 h-5 w-5 text-muted-foreground" />
                <Link
                  href="mailto:contact@laptopsun.vn"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  contact@laptopsun.vn
                </Link>
              </li>
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
                <Link
                  href="https://maps.app.goo.gl/Yx5Yx5Yx5Yx5Yx5Yx5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  995 CMT8, Phường 7, Quận Tân Bình, TP.HCM
                </Link>
              </li>
              <li className="flex items-start">
                <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground whitespace-pre-line">
                  {t("footer.business_hours")}
                </span>
              </li>
            </ul>
          </div>

          {/* Map */}
          <div>
            <h3 className="text-lg font-semibold">{t("footer.find_us")}</h3>
            <div className="mt-4 h-48 w-full overflow-hidden rounded-md bg-gray-200">
              <iframe
                title="LaptopSun Location"
                className="h-full w-full border-0"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4631.63857608082!2d106.65759354677559!3d10.79045208297997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f0024f81221%3A0x58af5d71ccecd9f4!2sLaptopsun!5e0!3m2!1svi!2s!4v1749753075439!5m2!1svi!2s"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} LaptopSun. {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
