export interface Service {
  id: string
  title: string
  description: string
  price: string
  icon: string
  estimatedTime: string
  category: string
}

export const services: Service[] = [
  {
    id: "macbook-screen-replacement",
    title: "MacBook Screen Replacement",
    description: "Professional screen replacement for all MacBook models with genuine parts",
    price: "$299",
    icon: "monitor",
    estimatedTime: "2-4 hours",
    category: "macbook",
  },
  {
    id: "macbook-keyboard-repair",
    title: "MacBook Keyboard Repair",
    description: "Fix sticky keys, replace damaged keyboards, and butterfly mechanism repairs",
    price: "$199",
    icon: "laptop",
    estimatedTime: "1-2 hours",
    category: "macbook",
  },
  {
    id: "macbook-battery-replacement",
    title: "MacBook Battery Replacement",
    description: "Replace worn-out batteries to restore your MacBook's battery life",
    price: "$149",
    icon: "cpu",
    estimatedTime: "1-2 hours",
    category: "macbook",
  },
  {
    id: "laptop-screen-repair",
    title: "Laptop Screen Repair",
    description: "Screen replacement and repair for Windows laptops and gaming laptops",
    price: "$179",
    icon: "monitor",
    estimatedTime: "2-3 hours",
    category: "laptop",
  },
  {
    id: "laptop-keyboard-replacement",
    title: "Laptop Keyboard Replacement",
    description: "Replace damaged or non-functioning laptop keyboards",
    price: "$89",
    icon: "laptop",
    estimatedTime: "1 hour",
    category: "laptop",
  },
  {
    id: "water-damage-cleaning",
    title: "Water Damage Cleaning",
    description: "Professional cleaning and restoration for water-damaged devices",
    price: "$129",
    icon: "wrench",
    estimatedTime: "4-6 hours",
    category: "laptop",
  },
  {
    id: "pc-optimization",
    title: "PC Optimization & Tune-up",
    description: "Speed up your laptop with software optimization and cleanup",
    price: "$79",
    icon: "cpu",
    estimatedTime: "2-3 hours",
    category: "laptop",
  },
  {
    id: "data-recovery",
    title: "Data Recovery",
    description: "Recover lost files and data from damaged hard drives and SSDs",
    price: "$199",
    icon: "harddrive",
    estimatedTime: "1-3 days",
    category: "data",
  },
  {
    id: "virus-removal",
    title: "Virus & Malware Removal",
    description: "Complete system cleaning and security setup",
    price: "$99",
    icon: "wrench",
    estimatedTime: "2-4 hours",
    category: "laptop",
  },
  {
    id: "hardware-upgrade",
    title: "Hardware Upgrades",
    description: "RAM, SSD, and other hardware upgrades to boost performance",
    price: "$149",
    icon: "cpu",
    estimatedTime: "1-2 hours",
    category: "laptop",
  },
  {
    id: "motherboard-repair",
    title: "Motherboard Repair",
    description: "Complex motherboard diagnostics and micro-soldering repairs",
    price: "$299",
    icon: "cpu",
    estimatedTime: "3-5 days",
    category: "laptop",
  },
  {
    id: "data-backup-setup",
    title: "Data Backup Setup",
    description: "Set up automated backup solutions to protect your important files",
    price: "$69",
    icon: "harddrive",
    estimatedTime: "1 hour",
    category: "data",
  },
]
