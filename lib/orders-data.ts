export interface RepairOrder {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  deviceType: string
  service: string
  problemDescription: string
  status: "pending" | "in-progress" | "completed" | "cancelled"
  date: string
  estimatedCompletion: string
  totalCost: string
}

export const repairOrders: RepairOrder[] = [
  {
    id: "ORD-001",
    customerName: "John Smith",
    customerEmail: "john.smith@email.com",
    customerPhone: "(555) 123-4567",
    deviceType: 'MacBook Pro 13"',
    service: "Screen Replacement",
    problemDescription: "Cracked screen after dropping the laptop",
    status: "in-progress",
    date: "2023-12-15",
    estimatedCompletion: "2023-12-16",
    totalCost: "$299",
  },
  {
    id: "ORD-002",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@email.com",
    customerPhone: "(555) 234-5678",
    deviceType: "Dell XPS 15",
    service: "Keyboard Replacement",
    problemDescription: "Several keys not working properly",
    status: "completed",
    date: "2023-12-14",
    estimatedCompletion: "2023-12-14",
    totalCost: "$89",
  },
  {
    id: "ORD-003",
    customerName: "Mike Chen",
    customerEmail: "mike.chen@email.com",
    customerPhone: "(555) 345-6789",
    deviceType: "MacBook Air",
    service: "Water Damage Cleaning",
    problemDescription: "Spilled coffee on laptop, won't turn on",
    status: "pending",
    date: "2023-12-15",
    estimatedCompletion: "2023-12-18",
    totalCost: "$129",
  },
  {
    id: "ORD-004",
    customerName: "Emily Davis",
    customerEmail: "emily.davis@email.com",
    customerPhone: "(555) 456-7890",
    deviceType: "HP Pavilion",
    service: "Virus Removal",
    problemDescription: "Computer running very slow, pop-ups appearing",
    status: "in-progress",
    date: "2023-12-13",
    estimatedCompletion: "2023-12-15",
    totalCost: "$99",
  },
  {
    id: "ORD-005",
    customerName: "Robert Wilson",
    customerEmail: "robert.w@email.com",
    customerPhone: "(555) 567-8901",
    deviceType: 'MacBook Pro 16"',
    service: "Battery Replacement",
    problemDescription: "Battery drains very quickly, only lasts 1 hour",
    status: "completed",
    date: "2023-12-12",
    estimatedCompletion: "2023-12-13",
    totalCost: "$149",
  },
  {
    id: "ORD-006",
    customerName: "Lisa Anderson",
    customerEmail: "lisa.anderson@email.com",
    customerPhone: "(555) 678-9012",
    deviceType: "Lenovo ThinkPad",
    service: "Data Recovery",
    problemDescription: "Hard drive crashed, need to recover important files",
    status: "in-progress",
    date: "2023-12-11",
    estimatedCompletion: "2023-12-14",
    totalCost: "$199",
  },
]
