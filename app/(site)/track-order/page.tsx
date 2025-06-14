"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

interface OrderStatus {
  trackingCode: string;
  customerName: string;
  deviceType: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
  estimatedCompletionDate?: string;
  internalNotes?: string[];
}

export default function TrackOrderPage() {
  const { t } = useTranslation();
  const [trackingCode, setTrackingCode] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!trackingCode.trim() || !phone.trim()) {
      setError(t("track_order.ui.error_required"));
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const response = await fetch("/api/track-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trackingCode: trackingCode.trim().toUpperCase(),
          phone: phone.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOrder(data.order);
      } else {
        setError(data.message || t("track_order.ui.error_not_found"));
      }
    } catch (err) {
      setError(t("track_order.ui.error_generic"));
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-primary" />;
      case "in_progress":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return t("track_order.ui.status.pending");
      case "in_progress":
        return t("track_order.ui.status.in_progress");
      case "completed":
        return t("track_order.ui.status.completed");
      case "cancelled":
        return t("track_order.ui.status.cancelled");
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-primary/10 text-primary";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t("track_order.ui.page_title")}
          </h1>
          <p className="text-gray-600">
            {t("track_order.ui.page_description")}
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              {t("track_order.ui.search_title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="trackingCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("track_order.ui.tracking_code_label")}
                </label>
                <Input
                  id="trackingCode"
                  placeholder={t("track_order.ui.tracking_code_placeholder")}
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  className="uppercase"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("track_order.ui.phone_label")}
                </label>
                <Input
                  id="phone"
                  placeholder={t("track_order.ui.phone_placeholder")}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <Button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              {loading ? t("track_order.ui.searching") : t("track_order.ui.search_button")}
            </Button>
          </CardContent>
        </Card>

        {order && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t("track_order.ui.order_info_title")}</span>
                <Badge className={getStatusColor(order.status)}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(order.status)}
                    {getStatusText(order.status)}
                  </span>
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {t("track_order.ui.basic_info")}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("track_order.ui.order_code")}</span>
                      <span className="font-medium">{order.trackingCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("track_order.ui.customer")}</span>
                      <span className="font-medium">{order.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("track_order.ui.device")}</span>
                      <span className="font-medium">{order.deviceType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("track_order.ui.created_at")}</span>
                      <span className="font-medium">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {t("track_order.ui.progress_title")}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t("track_order.ui.received")}</p>
                        <p className="text-xs text-gray-500">
                          {t("track_order.ui.received_desc")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          ["in_progress", "completed"].includes(order.status)
                            ? "bg-green-100"
                            : "bg-gray-100"
                        }`}
                      >
                        <Package
                          className={`h-4 w-4 ${
                            ["in_progress", "completed"].includes(order.status)
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t("track_order.ui.repairing")}</p>
                        <p className="text-xs text-gray-500">
                          {t("track_order.ui.repairing_desc")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          order.status === "completed"
                            ? "bg-green-100"
                            : "bg-gray-100"
                        }`}
                      >
                        <CheckCircle
                          className={`h-4 w-4 ${
                            order.status === "completed"
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t("track_order.ui.done")}</p>
                        <p className="text-xs text-gray-500">
                          {t("track_order.ui.done_desc")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {order.estimatedCompletionDate && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-1">
                    {t("track_order.ui.estimated_completion")}
                  </h4>
                  <p className="text-blue-700">
                    {new Date(order.estimatedCompletionDate).toLocaleDateString(
                      "vi-VN"
                    )}
                  </p>
                </div>
              )}

              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <h4 className="font-semibold text-primary mb-2">
                  {t("track_order.ui.important_notes")}
                </h4>
                <ul className="text-primary text-sm space-y-1">
                  <li>{t("track_order.ui.note_1")}</li>
                  <li>{t("track_order.ui.note_2")}</li>
                  <li>{t("track_order.ui.note_3")}</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
