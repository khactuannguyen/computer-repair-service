"use client";

import type React from "react";

import { useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function ContactForm() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.fullName.length < 2) {
      newErrors.fullName = t("contact.validation.name_min");
    }
    // Email: optional, but if filled must be valid
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = t("contact.validation.email_invalid");
      }
    }
    // Phone: required, must be valid
    if (!formData.phone) {
      newErrors.phone = t("contact.validation.phone_required");
    } else {
      // Accept only digits, 9-15 chars (Vietnam/intl)
      const phoneRegex = /^\+?\d{9,15}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = t("contact.validation.phone_invalid");
      }
    }
    if (formData.subject.length < 3) {
      newErrors.subject = t("contact.validation.subject_min");
    }
    // Message: optional, but if filled must be at least 10 chars
    if (
      formData.message &&
      formData.message.length > 0 &&
      formData.message.length < 10
    ) {
      newErrors.message = t("contact.validation.message_min");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.success) {
        toast({
          title: t("contact.messages.success_title"),
          description: t("contact.messages.success_description"),
        });
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        toast({
          title: t("contact.messages.error_title"),
          description: result.error || t("contact.messages.error_description"),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t("contact.messages.error_title"),
        description: t("contact.messages.error_description"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h2 className="text-2xl font-bold">{t("contact.form.title")}</h2>
      <p className="mt-2 text-muted-foreground">{t("contact.form.subtitle")}</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-2">
            {t("contact.form.full_name")}{" "}
            <span className="text-red-500">*</span>
          </label>
          <Input
            id="fullName"
            placeholder={t("contact.form.full_name_placeholder")}
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            className={errors.fullName ? "border-red-500" : ""}
            required
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            {t("contact.form.phone")} <span className="text-red-500">*</span>
          </label>
          <Input
            id="phone"
            placeholder={t("contact.form.phone_placeholder")}
            value={formData.phone}
            onChange={(e) => {
              // Only allow digits and + at the start
              let val = e.target.value;
              if (val.length === 1 && val !== "+" && isNaN(Number(val))) return;
              if (val.length > 1) val = val.replace(/[^\d]/g, "");
              if (val.length === 0 || val === "+") {
                setFormData((prev) => ({ ...prev, phone: val }));
              } else {
                setFormData((prev) => ({ ...prev, phone: val }));
              }
            }}
            className={errors.phone ? "border-red-500" : ""}
            required
            inputMode="numeric"
            pattern="[0-9+]*"
            autoComplete="tel"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            {t("contact.form.email")}
          </label>
          <Input
            id="email"
            type="email"
            placeholder={t("contact.form.email_placeholder")}
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium mb-2">
            {t("contact.form.subject")} <span className="text-red-500">*</span>
          </label>
          <Input
            id="subject"
            placeholder={t("contact.form.subject_placeholder")}
            value={formData.subject}
            onChange={(e) => handleInputChange("subject", e.target.value)}
            className={errors.subject ? "border-red-500" : ""}
            required
          />
          {errors.subject && (
            <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2">
            {t("contact.form.message")}
          </label>
          <Textarea
            id="message"
            placeholder={t("contact.form.message_placeholder")}
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
            className={`min-h-[120px] ${
              errors.message ? "border-red-500" : ""
            }`}
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("contact.form.submitting")}
            </>
          ) : (
            t("contact.form.submit")
          )}
        </Button>
      </form>
    </div>
  );
}
