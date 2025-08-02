const { MongoClient } = require("mongodb")
const { v4: uuidv4 } = require("uuid")
require("dotenv").config()

const MONGODB_URI = process.env.MONGODB_URI
const DB_NAME = process.env.DB_NAME || "laptopsun"

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI environment variable is not set")
  process.exit(1)
}

// Helper function to create slug from text
function createSlug(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim("-")
}

// Enhanced seed data with i18n structure (vi/en only)
const seedData = {
  categories: [
    {
      documentId: uuidv4(),
      translations: {
        vi: {
          name: "MacBook",
          description: "Dịch vụ sửa chữa MacBook Pro, MacBook Air",
          slug: "macbook",
        },
        en: {
          name: "MacBook",
          description: "MacBook Pro, MacBook Air repair services",
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
          description: "Sửa chữa laptop các hãng Dell, HP, Asus, Acer, Lenovo",
          slug: "laptop",
        },
        en: {
          name: "Laptop",
          description: "Laptop repair for Dell, HP, Asus, Acer, Lenovo brands",
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
          description: "Dịch vụ khôi phục dữ liệu từ ổ cứng, SSD",
          slug: "khoi-phuc-du-lieu",
        },
        en: {
          name: "Data Recovery",
          description: "Data recovery services from hard drives, SSDs",
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
      categoryDocumentId: null, // Will be set to MacBook category
      translations: {
        vi: {
          name: "Sửa màn hình MacBook Pro",
          description:
            "Thay thế màn hình MacBook Pro bị vỡ, nứt, hoặc không hiển thị. Chúng tôi sử dụng linh kiện chính hãng và cung cấp bảo hành 6 tháng cho dịch vụ thay màn hình.",
          shortDescription: "Thay màn hình MacBook Pro chính hãng, bảo hành 6 tháng",
          slug: "sua-man-hinh-macbook-pro",
          features: ["Sử dụng linh kiện chính hãng", "Bảo hành 6 tháng", "Kiểm tra miễn phí", "Hỗ trợ tận nơi"],
        },
        en: {
          name: "MacBook Pro Screen Repair",
          description:
            "Replace broken, cracked or non-displaying MacBook Pro screens. We use genuine parts and provide 6-month warranty for screen replacement service.",
          shortDescription: "Genuine MacBook Pro screen replacement with 6-month warranty",
          slug: "macbook-pro-screen-repair",
          features: ["Genuine parts used", "6-month warranty", "Free diagnosis", "On-site support"],
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
      categoryDocumentId: null, // Will be set to MacBook category
      translations: {
        vi: {
          name: "Thay pin MacBook Air",
          description:
            "Thay pin MacBook Air bị chai, phồng hoặc không sạc được. Sử dụng pin chính hãng với công nghệ mới nhất, giúp kéo dài thời gian sử dụng máy.",
          shortDescription: "Thay pin MacBook Air chính hãng, cải thiện thời lượng pin",
          slug: "thay-pin-macbook-air",
          features: ["Pin chính hãng Apple", "Công nghệ mới nhất", "Tăng thời lượng pin", "Bảo hành 6 tháng"],
        },
        en: {
          name: "MacBook Air Battery Replacement",
          description:
            "Replace degraded, swollen or non-charging MacBook Air batteries. Using genuine batteries with latest technology to extend device usage time.",
          shortDescription: "Genuine MacBook Air battery replacement, improved battery life",
          slug: "macbook-air-battery-replacement",
          features: ["Genuine Apple battery", "Latest technology", "Extended battery life", "6-month warranty"],
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
      categoryDocumentId: null, // Will be set to Laptop category
      translations: {
        vi: {
          name: "Sửa bàn phím laptop",
          description:
            "Sửa chữa bàn phím laptop bị liệt phím, dính phím, hoặc không nhận phím. Hỗ trợ tất cả các hãng laptop phổ biến như Dell, HP, Asus, Acer, Lenovo.",
          shortDescription: "Sửa bàn phím laptop mọi hãng, thay phím lẻ",
          slug: "sua-ban-phim-laptop",
          features: ["Hỗ trợ mọi hãng laptop", "Thay phím lẻ", "Sửa chữa nhanh chóng", "Giá cả hợp lý"],
        },
        en: {
          name: "Laptop Keyboard Repair",
          description:
            "Fix laptop keyboards with stuck keys, dead keys or unresponsive keys. Support all popular laptop brands like Dell, HP, Asus, Acer, Lenovo.",
          shortDescription: "Laptop keyboard repair all brands, individual key replacement",
          slug: "laptop-keyboard-repair",
          features: ["All laptop brands supported", "Individual key replacement", "Quick repair", "Reasonable price"],
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
      categoryDocumentId: null, // Will be set to Data Recovery category
      translations: {
        vi: {
          name: "Khôi phục dữ liệu ổ cứng",
          description:
            "Khôi phục dữ liệu từ ổ cứng bị hỏng, format nhầm, virus. Chúng tôi sử dụng công nghệ tiên tiến để khôi phục tối đa dữ liệu quan trọng của bạn.",
          shortDescription: "Khôi phục dữ liệu ổ cứng, SSD với tỷ lệ thành công cao",
          slug: "khoi-phuc-du-lieu-o-cung",
          features: [
            "Công nghệ tiên tiến",
            "Tỷ lệ thành công cao",
            "Bảo mật tuyệt đối",
            "Không khôi phục được không tính phí",
          ],
        },
        en: {
          name: "Hard Drive Data Recovery",
          description:
            "Recover data from damaged hard drives, accidental formatting, virus attacks. We use advanced technology to maximize recovery of your important data.",
          shortDescription: "Hard drive, SSD data recovery with high success rate",
          slug: "hard-drive-data-recovery",
          features: ["Advanced technology", "High success rate", "Absolute security", "No recovery, no fee"],
        },
      },
      price: { from: 500000, to: 3000000 },
      estimatedTime: "1-3 ngày",
      icon: "hard-drive",
      warranty: "1 tháng",
      isActive: true,
      isFeatured: false,
      order: 4,
    },
  ],

  faqs: [
    {
      documentId: uuidv4(),
      translations: {
        vi: {
          question: "Thời gian sửa chữa mất bao lâu?",
          answer:
            "Thời gian sửa chữa phụ thuộc vào loại sự cố và độ phức tạp. Hầu hết các trường hợp đơn giản như thay pin, vệ sinh có thể hoàn thành trong ngày. Các trường hợp phức tạp như sửa bo mạch chủ, khôi phục dữ liệu có thể mất 2-5 ngày làm việc.",
        },
        en: {
          question: "How long does repair take?",
          answer:
            "Repair time depends on the type of issue and complexity. Most simple cases like battery replacement, cleaning can be completed same-day. Complex cases like motherboard repair, data recovery may take 2-5 business days.",
        },
      },
      category: "general",
      order: 1,
      isActive: true,
    },
    {
      documentId: uuidv4(),
      translations: {
        vi: {
          question: "Có bảo hành sau khi sửa chữa không?",
          answer:
            "Có, chúng tôi cung cấp bảo hành từ 1-12 tháng cho tất cả dịch vụ sửa chữa tùy theo loại dịch vụ. Bảo hành bao gồm cả linh kiện thay thế và công sửa chữa.",
        },
        en: {
          question: "Is there warranty after repair?",
          answer:
            "Yes, we provide 1-12 months warranty for all repair services depending on the service type. Warranty covers both replacement parts and repair work.",
        },
      },
      category: "warranty",
      order: 2,
      isActive: true,
    },
    {
      documentId: uuidv4(),
      translations: {
        vi: {
          question: "Tôi có thể theo dõi tiến độ sửa chữa như thế nào?",
          answer:
            "Bạn có thể theo dõi tiến độ sửa chữa thông qua trang web của chúng tôi bằng mã đơn hàng. Chúng tôi cũng sẽ gửi thông báo qua SMS/email khi có cập nhật về tình trạng sửa chữa.",
        },
        en: {
          question: "How can I track my repair progress?",
          answer:
            "You can track your repair progress through our website using your order code. We will also send notifications via SMS/email when there are updates on your repair status.",
        },
      },
      category: "support",
      order: 3,
      isActive: true,
    },
  ],

  testimonials: [
    {
      documentId: uuidv4(),
      translations: {
        vi: {
          customerName: "Nguyễn Văn An",
          customerTitle: "Kỹ sư phần mềm",
          content:
            "MacBook Pro của tôi bị vỡ màn hình và tôi rất lo lắng về dữ liệu công việc quan trọng. Đội ngũ LaptopSun không chỉ thay màn hình nhanh chóng mà còn giúp sao lưu toàn bộ dữ liệu an toàn. Dịch vụ chuyên nghiệp, giá cả hợp lý!",
        },
        en: {
          customerName: "Nguyen Van An",
          customerTitle: "Software Engineer",
          content:
            "My MacBook Pro had a broken screen and I was worried about important work data. LaptopSun team not only replaced the screen quickly but also helped backup all data safely. Professional service, reasonable price!",
        },
      },
      rating: 5,
      serviceType: "macbook",
      isPublished: true,
      isFeatured: true,
      order: 1,
      publishedAt: new Date(),
    },
    {
      documentId: uuidv4(),
      translations: {
        vi: {
          customerName: "Trần Thị Bình",
          customerTitle: "Sinh viên Đại học",
          content:
            "Laptop của em bị chậm và nóng máy liên tục. Sau khi vệ sinh và nâng cấp RAM tại LaptopSun, máy chạy mượt mà như mới. Giá cả phù hợp với túi tiền sinh viên!",
        },
        en: {
          customerName: "Tran Thi Binh",
          customerTitle: "University Student",
          content:
            "My laptop was slow and constantly overheating. After cleaning and RAM upgrade at LaptopSun, it runs smoothly like new. Price suitable for student budget!",
        },
      },
      rating: 5,
      serviceType: "laptop",
      isPublished: true,
      isFeatured: true,
      order: 2,
      publishedAt: new Date(),
    },
    {
      documentId: uuidv4(),
      translations: {
        vi: {
          customerName: "Lê Minh Hoàng",
          customerTitle: "Nhà thiết kế đồ họa",
          content:
            "Ổ cứng MacBook của tôi bị hỏng và mất toàn bộ dự án thiết kế. May mắn tìm được LaptopSun, họ đã khôi phục được 95% dữ liệu. Thật sự cứu cánh cho công việc của tôi!",
        },
        en: {
          customerName: "Le Minh Hoang",
          customerTitle: "Graphic Designer",
          content:
            "My MacBook hard drive failed and I lost all my design projects. Fortunately found LaptopSun, they recovered 95% of the data. Really saved my work!",
        },
      },
      rating: 5,
      serviceType: "data-recovery",
      isPublished: true,
      isFeatured: false,
      order: 3,
      publishedAt: new Date(),
    },
  ],

  blogPosts: [
    {
      documentId: uuidv4(),
      translations: {
        vi: {
          title: "5 cách bảo vệ laptop khỏi virus và malware hiệu quả",
          slug: "5-cach-bao-ve-laptop-khoi-virus-malware",
          content:
            "Virus và malware là những mối đe dọa thường xuyên đối với người dùng laptop. Trong bài viết này, chúng tôi sẽ chia sẻ 5 cách hiệu quả nhất để bảo vệ laptop của bạn khỏi các mối đe dọa này...",
          excerpt:
            "Hướng dẫn chi tiết 5 phương pháp bảo vệ laptop khỏi virus và malware, giúp máy tính luôn an toàn và hoạt động ổn định.",
        },
        en: {
          title: "5 effective ways to protect your laptop from viruses and malware",
          slug: "5-effective-ways-protect-laptop-viruses-malware",
          content:
            "Viruses and malware are constant threats to laptop users. In this article, we will share the 5 most effective ways to protect your laptop from these threats...",
          excerpt:
            "Detailed guide on 5 methods to protect laptop from viruses and malware, keeping your computer safe and running stable.",
        },
      },
      tags: ["bảo mật", "virus", "malware", "laptop", "antivirus"],
      category: "security",
      isPublished: true,
      isFeatured: true,
      readTime: 8,
      publishedAt: new Date(),
      author: null, // Will be set to admin user
    },
    {
      documentId: uuidv4(),
      translations: {
        vi: {
          title: "Cách vệ sinh laptop đúng cách tại nhà",
          slug: "cach-ve-sinh-laptop-dung-cach-tai-nha",
          content:
            "Vệ sinh laptop định kỳ là việc rất quan trọng để duy trì hiệu suất và kéo dài tuổi thọ máy. Bài viết này sẽ hướng dẫn bạn cách vệ sinh laptop an toàn và hiệu quả tại nhà...",
          excerpt: "Hướng dẫn từng bước cách vệ sinh laptop an toàn tại nhà, giúp máy hoạt động mát mẻ và bền bỉ hơn.",
        },
        en: {
          title: "How to properly clean your laptop at home",
          slug: "how-to-properly-clean-laptop-at-home",
          content:
            "Regular laptop cleaning is very important to maintain performance and extend machine lifespan. This article will guide you on how to clean your laptop safely and effectively at home...",
          excerpt:
            "Step-by-step guide on how to safely clean your laptop at home, helping it run cooler and more durable.",
        },
      },
      tags: ["vệ sinh", "bảo dưỡng", "laptop", "cleaning", "maintenance"],
      category: "maintenance",
      isPublished: true,
      isFeatured: false,
      readTime: 6,
      publishedAt: new Date(Date.now() - 86400000),
      author: null, // Will be set to admin user
    },
  ],

  staticContent: [
    {
      documentId: uuidv4(),
      key: "hero_banner",
      type: "hero",
      translations: {
        vi: {
          title: "Dịch vụ sửa chữa laptop chuyên nghiệp",
          content:
            "Chúng tôi cung cấp dịch vụ sửa chữa laptop, MacBook chuyên nghiệp với đội ngũ kỹ thuật viên giàu kinh nghiệm. Cam kết chất lượng, bảo hành dài hạn.",
          buttonText: "Đặt lịch sửa chữa",
        },
        en: {
          title: "Professional laptop repair service",
          content:
            "We provide professional laptop and MacBook repair services with experienced technicians. Quality commitment, long-term warranty.",
          buttonText: "Book repair service",
        },
      },
      buttonUrl: "/book-appointment",
      imageUrl: "/hero-laptop-repair.jpg",
      isActive: true,
      order: 1,
    },
    {
      documentId: uuidv4(),
      key: "about_us",
      type: "about",
      translations: {
        vi: {
          title: "Về LaptopSun",
          content:
            "LaptopSun là trung tâm sửa chữa laptop và MacBook hàng đầu với hơn 5 năm kinh nghiệm. Chúng tôi tự hào mang đến dịch vụ chất lượng cao, sử dụng linh kiện chính hãng và đội ngũ kỹ thuật viên được đào tạo chuyên nghiệp.",
        },
        en: {
          title: "About LaptopSun",
          content:
            "LaptopSun is a leading laptop and MacBook repair center with over 5 years of experience. We pride ourselves on providing high-quality service, using genuine parts and professionally trained technicians.",
        },
      },
      isActive: true,
      order: 1,
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

    // Create admin user first
    console.log("👤 Creating admin user...")
    const bcrypt = require("bcryptjs")
    const hashedPassword = await bcrypt.hash("admin123", 12)

    const adminUser = {
      name: "Administrator",
      email: "admin@laptopsun.com",
      password: hashedPassword,
      role: "admin",
      phone: "0857270270",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const usersCollection = db.collection("users")
    const existingAdmin = await usersCollection.findOne({
      email: adminUser.email,
    })

    let adminId
    if (!existingAdmin) {
      const result = await usersCollection.insertOne(adminUser)
      adminId = result.insertedId
      console.log("✅ Admin user created")
    } else {
      adminId = existingAdmin._id
      console.log("ℹ️  Admin user already exists")
    }

    // Clear existing collections
    console.log("🧹 Clearing existing data...")
    await db.collection("categories").deleteMany({})
    await db.collection("services").deleteMany({})
    await db.collection("faqs").deleteMany({})
    await db.collection("testimonials").deleteMany({})
    await db.collection("blogposts").deleteMany({})
    await db.collection("staticcontents").deleteMany({})

    // Seed Categories
    console.log("📂 Seeding categories...")
    const categoryDocuments = []
    const categoryMap = new Map() // To store documentId -> category mapping

    for (const category of seedData.categories) {
      categoryMap.set(category.documentId, category)

      for (const [lang, translation] of Object.entries(category.translations)) {
        categoryDocuments.push({
          documentId: category.documentId,
          lang,
          name: translation.name,
          description: translation.description,
          slug: translation.slug,
          order: category.order,
          isActive: category.isActive,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }
    }

    await db.collection("categories").insertMany(categoryDocuments)
    console.log(`✅ Inserted ${categoryDocuments.length} category documents`)

    // Seed Services
    console.log("🛠️  Seeding services...")
    const serviceDocuments = []

    // Set category references
    const macbookCategory = seedData.categories.find((c) => c.translations.vi.name === "MacBook")
    const laptopCategory = seedData.categories.find((c) => c.translations.vi.name === "Laptop")
    const dataRecoveryCategory = seedData.categories.find((c) => c.translations.vi.name === "Khôi phục dữ liệu")

    seedData.services[0].categoryDocumentId = macbookCategory.documentId
    seedData.services[1].categoryDocumentId = macbookCategory.documentId
    seedData.services[2].categoryDocumentId = laptopCategory.documentId
    seedData.services[3].categoryDocumentId = dataRecoveryCategory.documentId

    for (const service of seedData.services) {
      for (const [lang, translation] of Object.entries(service.translations)) {
        serviceDocuments.push({
          documentId: service.documentId,
          lang,
          name: translation.name,
          description: translation.description,
          shortDescription: translation.shortDescription,
          slug: translation.slug,
          features: translation.features,
          price: service.price,
          estimatedTime: service.estimatedTime,
          categoryDocumentId: service.categoryDocumentId,
          icon: service.icon,
          warranty: service.warranty,
          isActive: service.isActive,
          isFeatured: service.isFeatured,
          order: service.order,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }
    }

    await db.collection("services").insertMany(serviceDocuments)
    console.log(`✅ Inserted ${serviceDocuments.length} service documents`)

    // Seed FAQs
    console.log("❓ Seeding FAQs...")
    const faqDocuments = []

    for (const faq of seedData.faqs) {
      for (const [lang, translation] of Object.entries(faq.translations)) {
        faqDocuments.push({
          documentId: faq.documentId,
          lang,
          question: translation.question,
          answer: translation.answer,
          category: faq.category,
          order: faq.order,
          isActive: faq.isActive,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }
    }

    await db.collection("faqs").insertMany(faqDocuments)
    console.log(`✅ Inserted ${faqDocuments.length} FAQ documents`)

    // Seed Testimonials
    console.log("💬 Seeding testimonials...")
    const testimonialDocuments = []

    for (const testimonial of seedData.testimonials) {
      for (const [lang, translation] of Object.entries(testimonial.translations)) {
        testimonialDocuments.push({
          documentId: testimonial.documentId,
          lang,
          customerName: translation.customerName,
          customerTitle: translation.customerTitle,
          content: translation.content,
          rating: testimonial.rating,
          serviceType: testimonial.serviceType,
          isPublished: testimonial.isPublished,
          isFeatured: testimonial.isFeatured,
          order: testimonial.order,
          publishedAt: testimonial.publishedAt,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }
    }

    await db.collection("testimonials").insertMany(testimonialDocuments)
    console.log(`✅ Inserted ${testimonialDocuments.length} testimonial documents`)

    // Seed Blog Posts
    console.log("📝 Seeding blog posts...")
    const blogPostDocuments = []

    for (const post of seedData.blogPosts) {
      for (const [lang, translation] of Object.entries(post.translations)) {
        blogPostDocuments.push({
          documentId: post.documentId,
          lang,
          title: translation.title,
          slug: translation.slug,
          content: translation.content,
          excerpt: translation.excerpt,
          tags: post.tags,
          category: post.category,
          isPublished: post.isPublished,
          isFeatured: post.isFeatured,
          readTime: post.readTime,
          publishedAt: post.publishedAt,
          author: adminId,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }
    }

    await db.collection("blogposts").insertMany(blogPostDocuments)
    console.log(`✅ Inserted ${blogPostDocuments.length} blog post documents`)

    // Seed Static Content
    console.log("📄 Seeding static content...")
    const staticContentDocuments = []

    for (const content of seedData.staticContent) {
      for (const [lang, translation] of Object.entries(content.translations)) {
        staticContentDocuments.push({
          documentId: content.documentId,
          lang,
          key: content.key,
          type: content.type,
          title: translation.title,
          content: translation.content,
          buttonText: translation.buttonText,
          buttonUrl: content.buttonUrl,
          imageUrl: content.imageUrl,
          isActive: content.isActive,
          order: content.order,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }
    }

    await db.collection("staticcontents").insertMany(staticContentDocuments)
    console.log(`✅ Inserted ${staticContentDocuments.length} static content documents`)

    console.log("🎉 Database seeding completed successfully!")
    console.log("\n📊 Summary:")
    console.log(
      `- Categories: ${categoryDocuments.length} documents (${seedData.categories.length} entities × 2 languages)`,
    )
    console.log(`- Services: ${serviceDocuments.length} documents (${seedData.services.length} entities × 2 languages)`)
    console.log(`- FAQs: ${faqDocuments.length} documents (${seedData.faqs.length} entities × 2 languages)`)
    console.log(
      `- Testimonials: ${testimonialDocuments.length} documents (${seedData.testimonials.length} entities × 2 languages)`,
    )
    console.log(
      `- Blog Posts: ${blogPostDocuments.length} documents (${seedData.blogPosts.length} entities × 2 languages)`,
    )
    console.log(
      `- Static Content: ${staticContentDocuments.length} documents (${seedData.staticContent.length} entities × 2 languages)`,
    )
    console.log(`- Admin User: admin@laptopsun.com / admin123`)
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
