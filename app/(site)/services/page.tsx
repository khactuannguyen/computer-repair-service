"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Laptop, Monitor, Smartphone, HardDrive, Cpu, Wrench, Search } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

interface Service {
  _id: string
  documentId: string
  name: string
  description: string
  shortDescription?: string
  price: {
    from: number
    to?: number
  }
  estimatedTime: string
  categoryDocumentId: string
  icon: string
  imageUrl?: string
  isActive: boolean
  isFeatured: boolean
  category?: {
    name: string
    documentId: string
  }
}

interface Category {
  _id: string
  documentId: string
  name: string
  description?: string
  slug: string
  order: number
  isActive: boolean
}

export default function ServicesPage() {
  const { t, locale } = useTranslation()
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    fetchData()
  }, [locale])

  const fetchData = async () => {
    try {
      setLoading(true)

      const [servicesRes, categoriesRes] = await Promise.all([
        fetch(`/api/services?lang=${locale}&active=true`),
        fetch(`/api/categories?lang=${locale}&active=true`),
      ])

      const servicesData = await servicesRes.json()
      const categoriesData = await categoriesRes.json()

      if (servicesData.success) {
        setServices(servicesData.data || [])
      } else {
        console.error("Failed to fetch services:", servicesData.error)
        setServices([])
      }

      if (categoriesData.success) {
        setCategories(categoriesData.data || [])
      } else {
        console.error("Failed to fetch categories:", categoriesData.error)
        setCategories([])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      setServices([])
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "laptop":
        return <Laptop className="h-6 w-6" />
      case "monitor":
        return <Monitor className="h-6 w-6" />
      case "smartphone":
        return <Smartphone className="h-6 w-6" />
      case "harddrive":
        return <HardDrive className="h-6 w-6" />
      case "cpu":
        return <Cpu className="h-6 w-6" />
      default:
        return <Wrench className="h-6 w-6" />
    }
  }

  const formatPrice = (price: Service["price"]) => {
    if (price.to && price.to > price.from) {
      return `${price.from.toLocaleString()} - ${price.to.toLocaleString()} VNĐ`
    }
    return `${t("services.card.starting_from")} ${price.from.toLocaleString()} VNĐ`
  }

  // Filter services based on search and category
  const filteredServices = services.filter((service) => {
    const matchesSearch = searchTerm
      ? service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true

    const matchesCategory = selectedCategory === "all" ? true : service.categoryDocumentId === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Group services by category for display
  const servicesByCategory = categories.reduce(
    (acc, category) => {
      const categoryServices = filteredServices.filter((service) => service.categoryDocumentId === category.documentId)
      if (categoryServices.length > 0) {
        acc[category.documentId] = {
          category,
          services: categoryServices,
        }
      }
      return acc
    },
    {} as Record<string, { category: Category; services: Service[] }>,
  )

  const featuredServices = filteredServices.filter((service) => service.isFeatured)

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{t("services.title")}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t("services.subtitle")}</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="mt-12 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={t("services.search_placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder={t("services.filter_by_category")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("services.tabs.all")}</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.documentId} value={category.documentId}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-8">
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t("services.no_services")}</h3>
            <p className="text-gray-600">
              {locale === "vi"
                ? "Không tìm thấy dịch vụ nào phù hợp với tiêu chí tìm kiếm."
                : "No services found matching your search criteria."}
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Services */}
            {featuredServices.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("services.card.featured")}</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {featuredServices.map((service) => (
                    <Card key={service._id} className="flex h-full flex-col">
                      <CardContent className="flex flex-1 flex-col p-6">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                          {getIcon(service.icon)}
                        </div>
                        <h3 className="mb-2 text-xl font-medium">{service.name}</h3>
                        <p className="mb-2 text-xs text-primary font-semibold">{service.category?.name || ""}</p>
                        <p className="mb-4 flex-1 text-muted-foreground">
                          {service.shortDescription || service.description}
                        </p>
                        <div className="mt-auto space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{t("services.card.price")}</span>
                            <span className="text-lg font-bold">{formatPrice(service.price)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{t("services.card.estimated_time")}</span>
                            <span className="text-sm">{service.estimatedTime}</span>
                          </div>
                        </div>
                        <Badge className="mt-2 w-fit">{t("services.card.featured")}</Badge>
                      </CardContent>
                      <CardFooter className="border-t p-6 pt-4">
                        <Button asChild className="w-full">
                          <Link href={`/book-appointment?service=${service.documentId}`}>
                            {t("services.card.book_now")}
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Services by Category */}
            {Object.entries(servicesByCategory).map(([categoryId, { category, services: categoryServices }]) => (
              <div key={categoryId}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.name}</h2>
                {category.description && <p className="text-gray-600 mb-6">{category.description}</p>}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryServices.map((service) => (
                    <Card key={service._id} className="flex h-full flex-col">
                      <CardContent className="flex flex-1 flex-col p-6">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                          {getIcon(service.icon)}
                        </div>
                        <h3 className="mb-2 text-xl font-medium">{service.name}</h3>
                        <p className="mb-4 flex-1 text-muted-foreground">
                          {service.shortDescription || service.description}
                        </p>
                        <div className="mt-auto space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{t("services.card.price")}</span>
                            <span className="text-lg font-bold">{formatPrice(service.price)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{t("services.card.estimated_time")}</span>
                            <span className="text-sm">{service.estimatedTime}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t p-6 pt-4">
                        <Button asChild className="w-full">
                          <Link href={`/book-appointment?service=${service.documentId}`}>
                            {t("services.card.book_now")}
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Process and CTA sections */}
      <div className="mt-16 space-y-8 rounded-lg bg-muted p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">{t("services.process.title")}</h2>
          <p className="mt-2 text-muted-foreground">{t("services.process.subtitle")}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-4">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              1
            </div>
            <h3 className="mt-4 text-lg font-medium">{t("services.process.diagnosis.title")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t("services.process.diagnosis.description")}</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              2
            </div>
            <h3 className="mt-4 text-lg font-medium">{t("services.process.approval.title")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t("services.process.approval.description")}</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              3
            </div>
            <h3 className="mt-4 text-lg font-medium">{t("services.process.repair.title")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t("services.process.repair.description")}</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              4
            </div>
            <h3 className="mt-4 text-lg font-medium">{t("services.process.quality.title")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t("services.process.quality.description")}</p>
          </div>
        </div>
      </div>

      <div className="mt-16 rounded-lg bg-primary p-8 text-primary-foreground">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">{t("services.custom.title")}</h2>
            <p className="mt-4">{t("services.custom.description")}</p>
          </div>
          <div className="flex items-center justify-center md:justify-end">
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">{t("services.custom.contact")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
