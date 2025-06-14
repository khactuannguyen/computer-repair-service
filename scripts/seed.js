const { MongoClient } = require("mongodb");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || "laptopsun";

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI environment variable is not set");
  process.exit(1);
}

// Sample data with multilingual support
const seedData = {
  services: [
    {
      name: {
        vi: "Sửa màn hình Macbook",
        en: "Macbook Screen Repair",
      },
      description: {
        vi: "Thay thế màn hình Macbook bị vỡ, nứt hoặc không hiển thị. Sử dụng linh kiện chính hãng.",
        en: "Replace broken, cracked or non-displaying Macbook screens. Using genuine parts.",
      },
      price: 2500000,
      estimatedTime: "2-3 giờ",
      category: "macbook",
      isActive: true,
    },
    {
      name: {
        vi: "Thay pin Macbook",
        en: "Macbook Battery Replacement",
      },
      description: {
        vi: "Thay pin Macbook chai, phồng hoặc không sạc được. Bảo hành 6 tháng.",
        en: "Replace degraded, swollen or non-charging Macbook batteries. 6-month warranty.",
      },
      price: 1800000,
      estimatedTime: "1-2 giờ",
      category: "macbook",
      isActive: true,
    },
    {
      name: {
        vi: "Sửa bàn phím laptop",
        en: "Laptop Keyboard Repair",
      },
      description: {
        vi: "Sửa chữa bàn phím laptop bị liệt phím, dính phím hoặc không nhận phím.",
        en: "Fix laptop keyboards with stuck keys, dead keys or unresponsive keys.",
      },
      price: 800000,
      estimatedTime: "1 giờ",
      category: "laptop",
      isActive: true,
    },
    {
      name: {
        vi: "Khôi phục dữ liệu",
        en: "Data Recovery",
      },
      description: {
        vi: "Khôi phục dữ liệu từ ổ cứng bị hỏng, format nhầm hoặc virus.",
        en: "Recover data from damaged hard drives, accidental formatting or virus attacks.",
      },
      price: 1500000,
      estimatedTime: "1-3 ngày",
      category: "data",
      isActive: true,
    },
    {
      name: {
        vi: "Vệ sinh laptop chuyên sâu",
        en: "Deep Laptop Cleaning",
      },
      description: {
        vi: "Vệ sinh toàn bộ laptop, thay keo tản nhiệt, làm sạch quạt tản nhiệt.",
        en: "Complete laptop cleaning, thermal paste replacement, fan cleaning.",
      },
      price: 500000,
      estimatedTime: "2-3 giờ",
      category: "laptop",
      isActive: true,
    },
  ],

  faqs: [
    {
      question: {
        vi: "Thời gian sửa chữa mất bao lâu?",
        en: "How long does repair take?",
      },
      answer: {
        vi: "Thời gian sửa chữa phụ thuộc vào loại sự cố. Hầu hết các trường hợp đơn giản có thể hoàn thành trong ngày. Các trường hợp phức tạp có thể mất 2-5 ngày làm việc.",
        en: "Repair time depends on the type of issue. Most simple cases can be completed same-day. Complex cases may take 2-5 business days.",
      },
      category: "general",
      order: 1,
      isActive: true,
    },
    {
      question: {
        vi: "Có bảo hành sau khi sửa chữa không?",
        en: "Is there warranty after repair?",
      },
      answer: {
        vi: "Có, chúng tôi cung cấp bảo hành 3-6 tháng cho tất cả dịch vụ sửa chữa tùy theo loại dịch vụ. Bảo hành bao gồm cả linh kiện và công sửa chữa.",
        en: "Yes, we provide 3-6 months warranty for all repair services depending on the service type. Warranty covers both parts and labor.",
      },
      category: "warranty",
      order: 2,
      isActive: true,
    },
    {
      question: {
        vi: "Có sửa chữa tại nhà không?",
        en: "Do you provide home service?",
      },
      answer: {
        vi: "Hiện tại chúng tôi chỉ nhận sửa chữa tại cửa hàng để đảm bảo chất lượng dịch vụ tốt nhất. Tuy nhiên, chúng tôi có dịch vụ đến lấy và giao máy tận nơi.",
        en: "Currently we only accept repairs at our store to ensure the best service quality. However, we offer pickup and delivery service.",
      },
      category: "service",
      order: 3,
      isActive: true,
    },
    {
      question: {
        vi: "Giá sửa chữa như thế nào?",
        en: "How much does repair cost?",
      },
      answer: {
        vi: "Giá sửa chữa phụ thuộc vào loại sự cố và linh kiện cần thay. Chúng tôi sẽ báo giá chi tiết sau khi kiểm tra máy. Không sửa được thì không tính phí kiểm tra.",
        en: "Repair cost depends on the type of issue and parts needed. We provide detailed quote after diagnosis. No fix, no diagnostic fee.",
      },
      category: "pricing",
      order: 4,
      isActive: true,
    },
  ],

  testimonials: [
    {
      customerName: "Nguyễn Văn An",
      customerTitle: "Kỹ sư phần mềm",
      content: {
        vi: "Macbook của tôi bị vỡ màn hình, đem đến LaptopSun sửa rất nhanh và chất lượng. Giá cả hợp lý, nhân viên tư vấn nhiệt tình.",
        en: "My Macbook screen was broken, brought it to LaptopSun for quick and quality repair. Reasonable price, enthusiastic staff consultation.",
      },
      rating: 5,
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      customerName: "Trần Thị Bình",
      customerTitle: "Sinh viên",
      content: {
        vi: "Laptop của em bị chậm, đem đến đây vệ sinh và nâng cấp RAM. Giờ chạy rất mượt, cảm ơn anh chị nhiều!",
        en: "My laptop was slow, brought it here for cleaning and RAM upgrade. Now it runs very smoothly, thank you so much!",
      },
      rating: 5,
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      customerName: "Lê Minh Cường",
      customerTitle: "Doanh nhân",
      content: {
        vi: "Dịch vụ khôi phục dữ liệu rất tốt. Ổ cứng của tôi bị hỏng nhưng vẫn lấy lại được hết dữ liệu quan trọng.",
        en: "Data recovery service is excellent. My hard drive was damaged but they recovered all important data.",
      },
      rating: 5,
      isPublished: true,
      publishedAt: new Date(),
    },
  ],

  blogPosts: [
    {
      title: {
        vi: "5 cách bảo vệ laptop khỏi virus",
        en: "5 ways to protect your laptop from viruses",
      },
      slug: "5-cach-bao-ve-laptop-khoi-virus",
      content: {
        vi: "Virus máy tính là mối đe dọa thường xuyên đối với người dùng laptop. Dưới đây là 5 cách hiệu quả để bảo vệ laptop của bạn...",
        en: "Computer viruses are a constant threat to laptop users. Here are 5 effective ways to protect your laptop...",
      },
      excerpt: {
        vi: "Hướng dẫn chi tiết cách bảo vệ laptop khỏi virus và malware hiệu quả nhất.",
        en: "Detailed guide on how to protect your laptop from viruses and malware most effectively.",
      },
      tags: ["bảo mật", "virus", "laptop", "security", "antivirus"],
      isPublished: true,
      publishedAt: new Date(),
      author: null, // Will be set to admin user ID after user creation
    },
    {
      title: {
        vi: "Cách vệ sinh laptop đúng cách",
        en: "How to clean your laptop properly",
      },
      slug: "cach-ve-sinh-laptop-dung-cach",
      content: {
        vi: "Vệ sinh laptop định kỳ giúp máy hoạt động ổn định và kéo dài tuổi thọ. Bài viết này sẽ hướng dẫn bạn cách vệ sinh laptop an toàn...",
        en: "Regular laptop cleaning helps the machine operate stably and extends its lifespan. This article will guide you on how to clean your laptop safely...",
      },
      excerpt: {
        vi: "Hướng dẫn từng bước cách vệ sinh laptop an toàn tại nhà.",
        en: "Step-by-step guide on how to safely clean your laptop at home.",
      },
      tags: ["vệ sinh", "bảo dưỡng", "laptop", "cleaning", "maintenance"],
      isPublished: true,
      publishedAt: new Date(),
      author: null,
    },
  ],
};

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log("🔌 Connecting to MongoDB...");
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db(DB_NAME);

    // Create admin user first
    console.log("👤 Creating admin user...");
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash("admin123", 12);

    const adminUser = {
      name: "Administrator",
      email: "admin@laptopsun.com",
      password: hashedPassword,
      role: "admin",
      phone: "0857270270",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const usersCollection = db.collection("users");
    const existingAdmin = await usersCollection.findOne({
      email: adminUser.email,
    });

    let adminId;
    if (!existingAdmin) {
      const result = await usersCollection.insertOne(adminUser);
      adminId = result.insertedId;
      console.log("✅ Admin user created");
    } else {
      adminId = existingAdmin._id;
      console.log("ℹ️  Admin user already exists");
    }

    // Seed Services
    console.log("🛠️  Seeding services...");
    const servicesCollection = db.collection("services");
    await servicesCollection.deleteMany({}); // Clear existing

    const servicesWithTimestamp = seedData.services.map((service) => ({
      ...service,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await servicesCollection.insertMany(servicesWithTimestamp);
    console.log(`✅ Inserted ${servicesWithTimestamp.length} services`);

    // Seed FAQs
    console.log("❓ Seeding FAQs...");
    const faqsCollection = db.collection("faqs");
    await faqsCollection.deleteMany({}); // Clear existing

    const faqsWithTimestamp = seedData.faqs.map((faq) => ({
      ...faq,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await faqsCollection.insertMany(faqsWithTimestamp);
    console.log(`✅ Inserted ${faqsWithTimestamp.length} FAQs`);

    // Seed Testimonials
    console.log("💬 Seeding testimonials...");
    const testimonialsCollection = db.collection("testimonials");
    await testimonialsCollection.deleteMany({}); // Clear existing

    const testimonialsWithTimestamp = seedData.testimonials.map(
      (testimonial) => ({
        ...testimonial,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );

    await testimonialsCollection.insertMany(testimonialsWithTimestamp);
    console.log(`✅ Inserted ${testimonialsWithTimestamp.length} testimonials`);

    // Seed Blog Posts
    console.log("📝 Seeding blog posts...");
    const blogPostsCollection = db.collection("blogposts");
    await blogPostsCollection.deleteMany({}); // Clear existing

    const blogPostsWithTimestamp = seedData.blogPosts.map((post) => ({
      ...post,
      author: adminId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await blogPostsCollection.insertMany(blogPostsWithTimestamp);
    console.log(`✅ Inserted ${blogPostsWithTimestamp.length} blog posts`);

    console.log("🎉 Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`- Services: ${seedData.services.length}`);
    console.log(`- FAQs: ${seedData.faqs.length}`);
    console.log(`- Testimonials: ${seedData.testimonials.length}`);
    console.log(`- Blog Posts: ${seedData.blogPosts.length}`);
    console.log(`- Admin User: admin@laptopsun.com / admin123`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await client.close();
    console.log("🔌 MongoDB connection closed");
  }
}

// Run the seed function
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedData, seedDatabase };
