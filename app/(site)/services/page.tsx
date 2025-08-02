import type { Metadata } from "next"
import { useTranslation } from "@/hooks/use-translation"
import { ServiceCard } from "@/components/services/service-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, Shield, Star } from "lucide-react"

async function getServices(lang: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/services?lang=${lang}&active=true`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch services")
    }

    const result = await response.json()
    return result.success ? result.data : []
  } catch (error) {
    console.error("Error fetching services:", error)
    return []
  }
}

async function getCategories(lang: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories?lang=${lang}&active=true`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch categories")
    }

    const result = await response.json()
    return result.success ? result.data : []
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const t = useTranslation()

  return {
    title: t("services.title"),
    description: t("services.subtitle"),
  }
}

export default async function ServicesPage() {
  const t = useTranslation()
  const lang = "vi" // This should come from locale context

  const [services, categories] = await Promise.all([getServices(lang), getCategories(lang)])

  // Group services by category
  const servicesByCategory = services.reduce((acc: any, service: any) => {
    const categoryId = service.categoryDocumentId
    if (!acc[categoryId]) {
      acc[categoryId] = []
    }
    acc[categoryId].push(service)
    return acc
  }, {})

  const featuredServices = services.filter((service: any) => service.isFeatured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">{t("services.title")}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">{t("services.subtitle")}</p>
        </div>
      </section>

      {/* Services Tabs */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-12">
              <TabsTrigger value="all">{t("services.tabs.all")}</TabsTrigger>
              <TabsTrigger value="macbook">{t("services.tabs.macbook")}</TabsTrigger>
              <TabsTrigger value="laptop">{t("services.tabs.laptop")}</TabsTrigger>
              <TabsTrigger value="data">{t("services.tabs.data")}</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-8">
              {/* Featured Services */}
              {featuredServices.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("services.card.featured")}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredServices.map((service: any) => (
                      <ServiceCard key={service._id} service={service} />
                    ))}
                  </div>
                </div>
              )}

              {/* All Services by Category */}
              {categories.map((category: any) => {
                const categoryServices = servicesByCategory[category.documentId] || []
                if (categoryServices.length === 0) return null

                return (
                  <div key={category._id}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.name}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryServices.map((service: any) => (
                        <ServiceCard key={service._id} service={service} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </TabsContent>

            {/* Category-specific tabs */}
            {categories.map((category: any) => {
              const categoryServices = servicesByCategory[category.documentId] || []
              const tabValue = category.slug

              return (
                <TabsContent key={category._id} value={tabValue} className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{category.name}</h2>
                    <p className="text-lg text-gray-600">{category.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryServices.map((service: any) => (
                      <ServiceCard key={service._id} service={service} />
                    ))}
                  </div>
                </TabsContent>
              )
            })}
          </Tabs>
        </div>
      </section>

      {/* Repair Process */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("services.process.title")}</h2>
            <p className="text-lg text-gray-600">{t("services.process.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-yellow-600" />
                </div>
                <CardTitle className="text-lg">{t("services.process.diagnosis.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t("services.process.diagnosis.description")}</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <CardTitle className="text-lg">{t("services.process.approval.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t("services.process.approval.description")}</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <CardTitle className="text-lg">{t("services.process.repair.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t("services.process.repair.description")}</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-yellow-600" />
                </div>
                <CardTitle className="text-lg">{t("services.process.quality.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t("services.process.quality.description")}</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Custom Solutions CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="p-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-4">{t("services.custom.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-lg text-gray-600 mb-6">
                {t("services.custom.description")}
              </CardDescription>
              <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black">
                {t("services.custom.contact")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
