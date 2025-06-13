export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  authorImage: string
  date: string
  categories: string[]
  image: string
}

export const blogPosts: BlogPost[] = [
  {
    id: "prevent-laptop-overheating",
    title: "How to Prevent Your Laptop from Overheating",
    excerpt:
      "Learn the common causes of laptop overheating and simple steps you can take to keep your device cool and running efficiently.",
    content: "Full blog post content here...",
    author: "Mike Johnson",
    authorImage: "/placeholder.svg?height=40&width=40",
    date: "Dec 15, 2023",
    categories: ["Maintenance", "Tips"],
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: "macbook-water-damage-guide",
    title: "What to Do When You Spill Water on Your MacBook",
    excerpt:
      "Quick action steps to minimize damage when liquid meets your MacBook, and when to seek professional help.",
    content: "Full blog post content here...",
    author: "Sarah Chen",
    authorImage: "/placeholder.svg?height=40&width=40",
    date: "Dec 12, 2023",
    categories: ["MacBook", "Emergency"],
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: "extend-laptop-battery-life",
    title: "10 Ways to Extend Your Laptop Battery Life",
    excerpt:
      "Practical tips to maximize your laptop's battery performance and longevity with simple settings adjustments.",
    content: "Full blog post content here...",
    author: "David Rodriguez",
    authorImage: "/placeholder.svg?height=40&width=40",
    date: "Dec 10, 2023",
    categories: ["Battery", "Tips"],
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: "signs-hard-drive-failing",
    title: "Warning Signs Your Hard Drive is Failing",
    excerpt:
      "Recognize the early warning signs of hard drive failure and learn how to backup your data before it's too late.",
    content: "Full blog post content here...",
    author: "Lisa Wang",
    authorImage: "/placeholder.svg?height=40&width=40",
    date: "Dec 8, 2023",
    categories: ["Hardware", "Data Recovery"],
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: "clean-laptop-keyboard",
    title: "The Right Way to Clean Your Laptop Keyboard",
    excerpt:
      "Step-by-step guide to safely clean your laptop keyboard without damaging the keys or internal components.",
    content: "Full blog post content here...",
    author: "Tom Anderson",
    authorImage: "/placeholder.svg?height=40&width=40",
    date: "Dec 5, 2023",
    categories: ["Maintenance", "Cleaning"],
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: "upgrade-laptop-performance",
    title: "Simple Upgrades to Boost Your Laptop Performance",
    excerpt: "Affordable hardware upgrades that can significantly improve your laptop's speed and responsiveness.",
    content: "Full blog post content here...",
    author: "Jennifer Kim",
    authorImage: "/placeholder.svg?height=40&width=40",
    date: "Dec 3, 2023",
    categories: ["Upgrades", "Performance"],
    image: "/placeholder.svg?height=300&width=500",
  },
]
