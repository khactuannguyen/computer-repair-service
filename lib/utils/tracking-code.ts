import connectToDatabase from "@/lib/db/mongodb";
import RepairOrder from "@/lib/db/models/RepairOrder";

export async function generateTrackingCode(): Promise<string> {
  await connectToDatabase();

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const datePrefix = `${year}${month}${day}`;

  // Find the highest sequence number for today
  const todayStart = new Date(year, today.getMonth(), today.getDate());
  const todayEnd = new Date(year, today.getMonth(), today.getDate() + 1);

  const lastOrder = (await RepairOrder.findOne({
    createdAt: {
      $gte: todayStart,
      $lt: todayEnd,
    },
    trackingCode: { $regex: `^LPS-${datePrefix}-` },
  })
    .sort({ trackingCode: -1 })
    .lean()) as { trackingCode?: string } | null;

  let sequence = 1;
  if (lastOrder?.trackingCode) {
    const lastSequence = Number.parseInt(lastOrder.trackingCode.split("-")[2]);
    sequence = lastSequence + 1;
  }

  const sequenceStr = String(sequence).padStart(4, "0");
  return `LPS-${datePrefix}-${sequenceStr}`;
}

export function parseTrackingCode(
  trackingCode: string
): { date: Date; sequence: number } | null {
  const match = trackingCode.match(/^LPS-(\d{8})-(\d{4})$/);
  if (!match) return null;

  const [, dateStr, sequenceStr] = match;
  const year = Number.parseInt(dateStr.substring(0, 4));
  const month = Number.parseInt(dateStr.substring(4, 6)) - 1;
  const day = Number.parseInt(dateStr.substring(6, 8));
  const sequence = Number.parseInt(sequenceStr);

  return {
    date: new Date(year, month, day),
    sequence,
  };
}
