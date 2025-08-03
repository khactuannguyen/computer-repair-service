const { MongoClient } = require("mongodb")
const { v4: uuidv4 } = require("uuid")
require("dotenv").config()

const MONGODB_URI = process.env.MONGODB_URI
const DB_NAME = process.env.DB_NAME || "laptopsun"

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI environment variable is not set")
  process.exit(1)
}

// Enhanced sample data with i18n structure
const seedData = {
  categories: [
    {
      documentId: uuidv4(),
      translations: {
        vi: {
          name: "MacBook",
          description: "Dịch vụ sửa chữa MacBook chuyên nghiệp",
          slug: "macbook",
        },
        en: {
          name: "MacBook",
          description: "Professional MacBook repair services",
          slug: "macbook",
        },
      },
      order: 1,
      isActive: true,
    },
    {
      documentId: uuidv4(),
      translations: {
        vi: {
          name: "Laptop",
          description: "Sửa chữa laptop các hãng",
          slug: "laptop",
        },
        en: {
          name: "Laptop",
          description: "Multi-brand laptop repair",
          slug: "laptop",
        },
      },
      order: 2,
      isActive: true,
    },
    {
      documentId: uuidv4(),
      translations: {
        vi: {
          name: "Khôi phục dữ liệu",
          description: "Dịch vụ khôi phục dữ liệu chuyên nghiệp",
          slug: "khoi-phuc-du-lieu",
        },
        en: {
          name: "Data Recovery",
          description: "Professional data recovery services",
          slug: "data-recovery",
        },
      },
      order: 3,
      isActive: true,
    },
  ],

  services: [
    {
      documentId: uuidv4(),
      categoryIndex: 0, // MacBook category
      translations: {
        vi: {
          name: "Sửa màn hình MacBook Pro",
          description:
            "Thay thế màn hình MacBook Pro bị vỡ, nứt, hoặc không hiển thị. Chúng tôi sử dụng linh kiện chính hãng và cung cấp bảo hành 6 tháng cho dịch vụ thay màn hình.",
          shortDescription: "Thay màn hình MacBook Pro chính hãng, bảo hành 6 tháng",
          slug: "sua-man-hinh-macbook-pro",
        },
        en: {
          name: "MacBook Pro Screen Repair",
          description:
            "Replace broken, cracked or non-displaying MacBook Pro screens. We use genuine parts and provide 6-month warranty for screen replacement service.",
          shortDescription: "Genuine MacBook Pro screen replacement with 6-month warranty",
          slug: "macbook-pro-screen-repair",
        },
      },
      price: { from: 2500000, to: 5000000 },
      estimatedTime: "2-3 giờ",
      icon: "laptop",
      warranty: "6 tháng",
      isActive: true,
      isFeatured: true,
      order: 1,
    },
    {
      documentId: uuidv4(),
      categoryIndex: 0, // MacBook category
      translations: {
        vi: {
          name: "Thay pin MacBook Air",
          description:
            "Thay pin MacBook Air bị chai, phồng hoặc không sạc được. Sử dụng pin chính hãng với công nghệ mới nhất, giúp kéo dài thời gian sử dụng máy.",
          shortDescription: "Thay pin MacBook Air chính hãng, cải thiện thời lượng pin",
          slug: "thay-pin-macbook-air",
        },
        en: {
          name: "MacBook Air Battery Replacement",
          description:
            "Replace degraded, swollen or non-charging MacBook Air batteries. Using genuine batteries with latest technology to extend device usage time.",
          shortDescription: "Genuine MacBook Air battery replacement, improved battery life",
          slug: "macbook-air-battery-replacement",
        },
      },
      price: { from: 1800000, to: 2500000 },
      estimatedTime: "1-2 giờ",
      icon: "cpu",
      warranty: "6 tháng",
      isActive: true,
      isFeatured: true,
      order: 2,
    },
    {
      documentId: uuidv4(),
      categoryIndex: 1, // Laptop category
      translations: {
        vi: {
          name: "Sửa bàn phím laptop",
          description:
            "Sửa chữa bàn phím laptop bị liệt phím, dính phím, hoặc không nhận phím. Hỗ trợ tất cả các hãng laptop phổ biến như Dell, HP, Asus, Acer, Lenovo.",
          shortDescription: "Sửa bàn phím laptop mọi hãng, thay phím lẻ",
          slug: "sua-ban-phim-laptop",
        },
        en: {
          name: "Laptop Keyboard Repair",
          description:
            "Fix laptop keyboards with stuck keys, dead keys or unresponsive keys. Support all popular laptop brands like Dell, HP, Asus, Acer, Lenovo.",
          shortDescription: "Laptop keyboard repair all brands, individual key replacement",
          slug: "laptop-keyboard-repair",
        },
      },
      price: { from: 300000, to: 1200000 },
      estimatedTime: "1-2 giờ",
      icon: "laptop",
      warranty: "3 tháng",
      isActive: true,
      isFeatured: true,
      order: 3,
    },
    {
      documentId: uuidv4(),
      categoryIndex: 2, // Data Recovery category
      translations: {
        vi: {
          name: "Khôi phục dữ liệu",
          description:
            "Khôi phục dữ liệu từ ổ cứng bị hỏng, format nhầm, virus tấn công. Sử dụng công nghệ tiên tiến để khôi phục tối đa dữ liệu quan trọng của bạn.",
          shortDescription: "Khôi phục dữ liệu chuyên nghiệp, tỷ lệ thành công cao",
          slug: "khoi-phuc-du-lieu",
        },
        en: {
          name: "Data Recovery Service",
          description:
            "Recover data from damaged hard drives, accidental formatting, virus attacks. Using advanced technology to maximize recovery of your important data.",
          shortDescription: "Professional data recovery with high success rate",
          slug: "data-recovery-service",
        },
      },
      price: { from: 500000, to: 3000000 },
      estimatedTime: "1-5 ngày",
      icon: "harddrive",
      warranty: "1 tháng",
      isActive: true,
      isFeatured: true,
      order: 4,
    },
  ],
}

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    console.log("🔌 Connecting to MongoDB...")
    await client.connect()
    console.log("✅ Connected to MongoDB")

    const db = client.db(DB_NAME)

    // Clear existing collections
    console.log("🧹 Clearing existing i18n data...")
    await db.collection("categories").deleteMany({})
    await db.collection("services").deleteMany({})

    // Seed Categories
    console.log("📂 Seeding categories with i18n structure...")
    const categoryDocuments = []

    seedData.categories.forEach((category) => {
      // Create Vietnamese document
      categoryDocuments.push({
        documentId: category.documentId,
        locale: "vi",
        name: category.translations.vi.name,
        description: category.translations.vi.description,
        slug: category.translations.vi.slug,
        order: category.order,
        isActive: category.isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Create English document
      categoryDocuments.push({
        documentId: category.documentId,
        locale: "en",
        name: category.translations.en.name,
        description: category.translations.en.description,
        slug: category.translations.en.slug,
        order: category.order,
        isActive: category.isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    })

    await db.collection("categories").insertMany(categoryDocuments)
    console.log(`✅ Inserted ${categoryDocuments.length} category documents`)

    // Seed Services
    console.log("🛠️  Seeding services with i18n structure...")
    const serviceDocuments = []

    seedData.services.forEach((service) => {
      const categoryDocumentId = seedData.categories[service.categoryIndex].documentId

      // Create Vietnamese document
      serviceDocuments.push({
        documentId: service.documentId,
        locale: "vi",
        name: service.translations.vi.name,
        description: service.translations.vi.description,
        shortDescription: service.translations.vi.shortDescription,
        slug: service.translations.vi.slug,
        categoryDocumentId,
        price: service.price,
        estimatedTime: service.estimatedTime,
        icon: service.icon,
        warranty: service.warranty,
        isActive: service.isActive,
        isFeatured: service.isFeatured,
        order: service.order,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Create English document
      serviceDocuments.push({
        documentId: service.documentId,
        locale: "en",
        name: service.translations.en.name,
        description: service.translations.en.description,
        shortDescription: service.translations.en.shortDescription,
        slug: service.translations.en.slug,
        categoryDocumentId,
        price: service.price,
        estimatedTime: service.estimatedTime,
        icon: service.icon,
        warranty: service.warranty,
        isActive: service.isActive,
        isFeatured: service.isFeatured,
        order: service.order,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    })

    await db.collection("services").insertMany(serviceDocuments)
    console.log(`✅ Inserted ${serviceDocuments.length} service documents`)

    console.log("🎉 i18n Database seeding completed successfully!")
    console.log("\n📊 Summary:")
    console.log(`- Categories: ${seedData.categories.length} (${categoryDocuments.length} documents)`)
    console.log(`- Services: ${seedData.services.length} (${serviceDocuments.length} documents)`)
    console.log(`- Languages: Vietnamese (vi) + English (en)`)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  } finally {
    await client.close()
    console.log("🔌 MongoDB connection closed")
  }
}

// Run the seed function
if (require.main === module) {
  seedDatabase()
}

module.exports = { seedData, seedDatabase }
