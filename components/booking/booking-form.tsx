"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { useTranslation } from "@/hooks/use-translation"

interface BookingFormProps {
  initialServiceId: string | null
}

interface Service {
  _id: string
  documentId: string
  name: string
  description: string
  categoryDocumentId: string
  category?: {
    name: string
  }
}

export default function BookingForm({ initialServiceId }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [loadingServices, setLoadingServices] = useState(true)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    deviceType: "",
    serviceId: initialServiceId || "",
    problemDescription: "",
    preferredDate: "",
    preferredTime: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const router = useRouter()
  const searchParams = useSearchParams()
  const { t, locale } = useTranslation()

  useEffect(() => {
    fetchServices()
  }, [locale])

  useEffect(() => {
    // Set initial service from URL params
    const serviceParam = searchParams.get("service")
    if (serviceParam && serviceParam !== formData.serviceId) {
      setFormData((prev) => ({ ...prev, serviceId: serviceParam }))
    }
  }, [searchParams, formData.serviceId])

  const fetchServices = async () => {
    try {
      setLoadingServices(true)
      const response = await fetch(`/api/services?lang=${locale}&active=true`)
      const data = await response.json()

      if (data.success) {
        setServices(data.data || [])
      } else {
        console.error("Failed to fetch services:", data.error)
        setServices([])
      }
    } catch (error) {
      console.error("Error fetching services:", error)
      setServices([])
    } finally {
      setLoadingServices(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (formData.fullName.length < 2) {
      newErrors.fullName = t("booking.validation.name_min")
    }
    if (!formData.email.includes("@")) {
      newErrors.email = t("booking.validation.email_invalid")
    }
    if (formData.phone.length < 10) {
      newErrors.phone = t("booking.validation.phone_min")
    }
    if (!formData.deviceType) {
      newErrors.deviceType = t("booking.validation.device_required")
    }
    if (!formData.serviceId) {
      newErrors.serviceId = t("booking.validation.service_required")
    }
    if (formData.problemDescription.length < 10) {
      newErrors.problemDescription = t("booking.validation.description_min")
    }
    if (!formData.preferredDate) {
      newErrors.preferredDate = t("booking.validation.date_required")
    }
    if (!formData.preferredTime) {
      newErrors.preferredTime = t("booking.validation.time_required")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const result = await res.json()

      if (result.success) {
        toast({
          title: t("booking.messages.success_title"),
          description: t("booking.messages.success_description"),
        })

        // Reset form
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          deviceType: "",
          serviceId: "",
          problemDescription: "",
          preferredDate: "",
          preferredTime: "",
        })
        setErrors({})
        router.push("/booking-confirmation")
      } else {
        toast({
          title: t("booking.messages.error_title"),
          description: result.error || t("booking.messages.error_description"),
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: t("booking.messages.error_title"),
        description: t("booking.messages.error_description"),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ]

  // Group services by category for better UX
  const servicesByCategory = services.reduce(
    (acc, service) => {
      const categoryName = service.category?.name || t("booking.form.other_services")
      if (!acc[categoryName]) {
        acc[categoryName] = []
      }
      acc[categoryName].push(service)
      return acc
    },
    {} as Record<string, Service[]>,
  )

  return (
    <div className="mx-auto max-w-2xl rounded-lg border bg-card p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("booking.form.full_name")} <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder={t("booking.form.full_name_placeholder")}
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className={errors.fullName ? "border-red-500" : ""}
              required
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t("booking.form.email")} <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              placeholder={t("booking.form.email_placeholder")}
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={errors.email ? "border-red-500" : ""}
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("booking.form.phone")} <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder={t("booking.form.phone_placeholder")}
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className={errors.phone ? "border-red-500" : ""}
              required
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t("booking.form.device_type")} <span className="text-red-500">*</span>
            </label>
            <Select value={formData.deviceType} onValueChange={(value) => handleInputChange("deviceType", value)}>
              <SelectTrigger className={errors.deviceType ? "border-red-500" : ""}>
                <SelectValue placeholder={t("booking.form.device_type_placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="macbook">{t("booking.device_types.macbook")}</SelectItem>
                <SelectItem value="macbook-pro">{t("booking.device_types.macbook_pro")}</SelectItem>
                <SelectItem value="macbook-air">{t("booking.device_types.macbook_air")}</SelectItem>
                <SelectItem value="windows-laptop">{t("booking.device_types.windows_laptop")}</SelectItem>
                <SelectItem value="gaming-laptop">{t("booking.device_types.gaming_laptop")}</SelectItem>
                <SelectItem value="desktop">{t("booking.device_types.desktop")}</SelectItem>
                <SelectItem value="other">{t("booking.device_types.other")}</SelectItem>
              </SelectContent>
            </Select>
            {errors.deviceType && <p className="text-red-500 text-sm mt-1">{errors.deviceType}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t("booking.form.service_needed")} <span className="text-red-500">*</span>
          </label>
          {loadingServices ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-muted-foreground">{t("common.loading")}</span>
            </div>
          ) : (
            <Select value={formData.serviceId} onValueChange={(value) => handleInputChange("serviceId", value)}>
              <SelectTrigger className={errors.serviceId ? "border-red-500" : ""}>
                <SelectValue placeholder={t("booking.form.service_placeholder")} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(servicesByCategory).map(([categoryName, categoryServices]) => (
                  <div key={categoryName}>
                    <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {categoryName}
                    </div>
                    {categoryServices.map((service) => (
                      <SelectItem key={service.documentId} value={service.documentId}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </div>
                ))}
                <SelectItem value="other">
                  {t("booking.device_types.other")} ({t("booking.form.specify_in_description")})
                </SelectItem>
              </SelectContent>
            </Select>
          )}
          {errors.serviceId && <p className="text-red-500 text-sm mt-1">{errors.serviceId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t("booking.form.problem_description")} <span className="text-red-500">*</span>
          </label>
          <Textarea
            placeholder={t("booking.form.problem_placeholder")}
            className={`min-h-[120px] ${errors.problemDescription ? "border-red-500" : ""}`}
            value={formData.problemDescription}
            onChange={(e) => handleInputChange("problemDescription", e.target.value)}
            required
          />
          {errors.problemDescription && <p className="text-red-500 text-sm mt-1">{errors.problemDescription}</p>}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("booking.form.preferred_date")} <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={formData.preferredDate}
              onChange={(e) => handleInputChange("preferredDate", e.target.value)}
              className={errors.preferredDate ? "border-red-500" : ""}
              min={new Date().toISOString().split("T")[0]}
              required
            />
            <p className="text-sm text-muted-foreground mt-1">{t("booking.time_slots.business_days")}</p>
            {errors.preferredDate && <p className="text-red-500 text-sm mt-1">{errors.preferredDate}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t("booking.form.preferred_time")} <span className="text-red-500">*</span>
            </label>
            <Select value={formData.preferredTime} onValueChange={(value) => handleInputChange("preferredTime", value)}>
              <SelectTrigger className={errors.preferredTime ? "border-red-500" : ""}>
                <SelectValue placeholder={t("booking.form.time_placeholder")} />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">{t("booking.time_slots.business_hours")}</p>
            {errors.preferredTime && <p className="text-red-500 text-sm mt-1">{errors.preferredTime}</p>}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting || loadingServices}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("booking.form.submitting")}
            </>
          ) : (
            t("booking.form.submit")
          )}
        </Button>
      </form>
    </div>
  )
}
