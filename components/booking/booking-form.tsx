"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { services } from "@/lib/services-data"
import { useTranslation } from "@/hooks/use-translation"
import { submitBookingForm } from "@/lib/actions/booking-actions"

interface BookingFormProps {
  initialServiceId: string | null
}

export default function BookingForm({ initialServiceId }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
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
  const { t } = useTranslation()

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
      // Submit form data and send emails
      const result = await submitBookingForm(formData)

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

        // Redirect to thank you page
        router.push("/booking-confirmation")
      } else {
        toast({
          title: t("booking.messages.error_title"),
          description: result.message || t("booking.messages.error_description"),
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

  return (
    <div className="mx-auto max-w-2xl rounded-lg border bg-card p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">{t("booking.form.full_name")}</label>
            <Input
              placeholder={t("booking.form.full_name_placeholder")}
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className={errors.fullName ? "border-red-500" : ""}
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t("booking.form.email")}</label>
            <Input
              type="email"
              placeholder={t("booking.form.email_placeholder")}
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">{t("booking.form.phone")}</label>
            <Input
              placeholder={t("booking.form.phone_placeholder")}
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t("booking.form.device_type")}</label>
            <select
              value={formData.deviceType}
              onChange={(e) => handleInputChange("deviceType", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${errors.deviceType ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">{t("booking.form.device_type_placeholder")}</option>
              <option value="macbook">{t("booking.device_types.macbook")}</option>
              <option value="macbook-pro">{t("booking.device_types.macbook_pro")}</option>
              <option value="macbook-air">{t("booking.device_types.macbook_air")}</option>
              <option value="windows-laptop">{t("booking.device_types.windows_laptop")}</option>
              <option value="gaming-laptop">{t("booking.device_types.gaming_laptop")}</option>
              <option value="other">{t("booking.device_types.other")}</option>
            </select>
            {errors.deviceType && <p className="text-red-500 text-sm mt-1">{errors.deviceType}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{t("booking.form.service_needed")}</label>
          <select
            value={formData.serviceId}
            onChange={(e) => handleInputChange("serviceId", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${errors.serviceId ? "border-red-500" : "border-gray-300"}`}
          >
            <option value="">{t("booking.form.service_placeholder")}</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.title}
              </option>
            ))}
            <option value="other">{t("booking.device_types.other")} (Please specify in description)</option>
          </select>
          {errors.serviceId && <p className="text-red-500 text-sm mt-1">{errors.serviceId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{t("booking.form.problem_description")}</label>
          <Textarea
            placeholder={t("booking.form.problem_placeholder")}
            className={`min-h-[120px] ${errors.problemDescription ? "border-red-500" : ""}`}
            value={formData.problemDescription}
            onChange={(e) => handleInputChange("problemDescription", e.target.value)}
          />
          {errors.problemDescription && <p className="text-red-500 text-sm mt-1">{errors.problemDescription}</p>}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">{t("booking.form.preferred_date")}</label>
            <Input
              type="date"
              value={formData.preferredDate}
              onChange={(e) => handleInputChange("preferredDate", e.target.value)}
              className={errors.preferredDate ? "border-red-500" : ""}
              min={new Date().toISOString().split("T")[0]}
            />
            <p className="text-sm text-muted-foreground mt-1">{t("booking.time_slots.business_days")}</p>
            {errors.preferredDate && <p className="text-red-500 text-sm mt-1">{errors.preferredDate}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t("booking.form.preferred_time")}</label>
            <select
              value={formData.preferredTime}
              onChange={(e) => handleInputChange("preferredTime", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${errors.preferredTime ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">{t("booking.form.time_placeholder")}</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            <p className="text-sm text-muted-foreground mt-1">{t("booking.time_slots.business_hours")}</p>
            {errors.preferredTime && <p className="text-red-500 text-sm mt-1">{errors.preferredTime}</p>}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
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
