import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db/mongodb"
import RepairOrder from "@/lib/db/models/RepairOrder"

export async function POST(request: NextRequest) {
  try {
    const { trackingCode, phone } = await request.json()

    if (!trackingCode || !phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Vui lòng cung cấp đầy đủ mã đơn hàng và số điện thoại",
        },
        { status: 400 },
      )
    }

    await connectToDatabase()

    // Find order by tracking code and customer phone
    const order = await RepairOrder.findOne({
      trackingCode: trackingCode.toUpperCase(),
      customerPhone: phone,
    }).lean()

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Không tìm thấy đơn hàng với thông tin đã cung cấp",
        },
        { status: 404 },
      )
    }

    // Return order information (excluding sensitive data)
    return NextResponse.json({
      success: true,
      order: {
        trackingCode: order.trackingCode,
        customerName: order.customerName,
        deviceType: order.deviceType,
        status: order.status,
        createdAt: order.createdAt,
        estimatedCompletionDate: order.estimatedCompletionDate,
        // Don't return internal notes for security
      },
    })
  } catch (error) {
    console.error("Error tracking order:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Có lỗi xảy ra khi tra cứu đơn hàng",
      },
      { status: 500 },
    )
  }
}
