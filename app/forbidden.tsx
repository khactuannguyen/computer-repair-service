"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import ContactBar from "@/components/layout/contact-bar";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { TranslationProvider } from "@/components/providers/translation-provider";

export default function Forbidden() {
  const { t } = useTranslation();

  return (
    <div>
      <TranslationProvider>
        <ContactBar />
        <Header />
        <div className="container flex h-[70vh] flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">403</h1>
          <h2 className="mt-4 text-xl font-semibold">
            {t("common.page_forbidden")}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {t("common.page_forbidden_description")}
          </p>
          <Button asChild className="mt-8">
            <Link href="/">{t("common.back_to_home")}</Link>
          </Button>
        </div>
        <Footer />
      </TranslationProvider>
    </div>
  );
}
