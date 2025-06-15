"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, Award } from "lucide-react";
import ServiceCard from "@/components/services/service-card";
import TestimonialCard from "@/components/testimonials/testimonial-card";
import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/use-translation";

export default function Home() {
  const { t, locale } = useTranslation();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const getLocalizedText = (text: { vi: string; en: string }) => {
    return text?.[locale] || text?.vi || "";
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/services?limit=6`);
      const data = await response.json();
      if (data.success) {
        setServices(
          data.services.map((s: any) => ({
            id: s._id,
            title: getLocalizedText(s.name),
            description: getLocalizedText(s.shortDescription || s.description),
            price: s.price?.to
              ? `${s.price.from.toLocaleString()} - ${s.price.to.toLocaleString()} VNĐ`
              : `Từ ${s.price.from.toLocaleString()} VNĐ`,
            icon: s.icon,
            estimatedTime: s.estimatedTime,
            category: s.category,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="flex flex-col space-y-6">
              <Badge className="w-fit">{t("home.hero.badge")}</Badge>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                {t("home.hero.title")}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t("home.hero.description")}
              </p>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Button asChild size="lg">
                  <Link href="/book-appointment">
                    {t("home.hero.book_service")}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/services">{t("home.hero.view_services")}</Link>
                </Button>
              </div>
            </div>
            <div className="relative mx-auto aspect-square w-full max-w-lg">
              <Image
                src="/hero/laptop-repair.jpg"
                alt="Laptop Repair"
                fill
                className="object-contain"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg?height=600&width=600";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              {t("home.features.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              {t("home.features.subtitle")}
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-4 text-xl font-medium">
                  {t("home.features.certified.title")}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {t("home.features.certified.description")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-4 text-xl font-medium">
                  {t("home.features.quick.title")}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {t("home.features.quick.description")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-4 text-xl font-medium">
                  {t("home.features.warranty.title")}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {t("home.features.warranty.description")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="bg-muted py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              {t("home.services.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              {t("home.services.subtitle")}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link href="/services">{t("home.services.view_all")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              {t("home.process.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              {t("home.process.subtitle")}
            </p>
          </div>

          <div className="mt-16">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="mt-4 text-xl font-medium">
                  {t("home.process.step1.title")}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {t("home.process.step1.description")}
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="mt-4 text-xl font-medium">
                  {t("home.process.step2.title")}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {t("home.process.step2.description")}
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="mt-4 text-xl font-medium">
                  {t("home.process.step3.title")}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {t("home.process.step3.description")}
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  4
                </div>
                <h3 className="mt-4 text-xl font-medium">
                  {t("home.process.step4.title")}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {t("home.process.step4.description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              {t("home.testimonials.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              {t("home.testimonials.subtitle")}
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <TestimonialCard
              name="Sarah Johnson"
              role="Graphic Designer"
              content="My MacBook Pro wouldn't turn on and I was panicking about my work files. TechFix not only fixed it the same day but also helped recover all my data. Excellent service!"
              rating={5}
              image="/placeholder.svg?height=80&width=80"
            />
            <TestimonialCard
              name="Michael Chen"
              role="Software Developer"
              content="I spilled coffee on my laptop keyboard and thought it was done for. The team at TechFix replaced the keyboard and cleaned the internals. Works like new now. Very impressed!"
              rating={5}
              image="/placeholder.svg?height=80&width=80"
            />
            <TestimonialCard
              name="Emily Rodriguez"
              role="College Student"
              content="As a student, I couldn't afford a new laptop when mine started overheating. TechFix cleaned the fans and replaced the thermal paste at a price I could afford. Great value!"
              rating={4}
              image="/placeholder.svg?height=80&width=80"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 text-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                {t("home.cta.title")}
              </h2>
              <p className="mt-4 text-lg">{t("home.cta.description")}</p>
            </div>
            <div className="flex flex-col items-start justify-center space-y-4 md:items-end">
              <Button asChild size="lg" variant="secondary">
                <Link href="/book-appointment">{t("home.cta.book_now")}</Link>
              </Button>
              <p className="text-sm">{t("home.cta.guarantee")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
