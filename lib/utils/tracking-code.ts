import RepairOrder from "@/lib/db/models/RepairOrder"
import connectToDatabase from "@/lib/db/mongodb"

export async function generateTrackingCode(): Promise<string> {
  await connectToDatabase()

  const today = new Date()
  const year = today.getFullYear().toString().slice(-2)
  const month = (today.getMonth() + 1).toString().padStart(2, "0")
  const day = today.getDate().toString().padStart(2, "0")

  const datePrefix = `LPS-${year}${month}${day}`

  // Find the highest sequence number for today
  const latestOrder = await RepairOrder.findOne(
    { trackingCode: { $regex: `^${datePrefix}` } },
    {},
    { sort: { trackingCode: -1 } },
  )

  let sequenceNumber = 1

  if (latestOrder) {
    const latestSequence = Number.parseInt(latestOrder.trackingCode.split("-")[2])
    sequenceNumber = latestSequence + 1
  }

  return `${datePrefix}-${sequenceNumber.toString().padStart(3, "0")}`
}
