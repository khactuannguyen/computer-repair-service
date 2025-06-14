const { MongoClient } = require("mongodb");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || "laptopsun";

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI environment variable is not set");
  process.exit(1);
}

// Enhanced sample data with full localization
const seedData = {
  services: [
    {
      name: {
        vi: "Sửa màn hình MacBook Pro",
        en: "MacBook Pro Screen Repair",
      },
      description: {
        vi: "Thay thế màn hình MacBook Pro bị vỡ, nứt, hoặc không hiển thị. Chúng tôi sử dụng linh kiện chính hãng và cung cấp bảo hành 6 tháng cho dịch vụ thay màn hình.",
        en: "Replace broken, cracked or non-displaying MacBook Pro screens. We use genuine parts and provide 6-month warranty for screen replacement service.",
      },
      shortDescription: {
        vi: "Thay màn hình MacBook Pro chính hãng, bảo hành 6 tháng",
        en: "Genuine MacBook Pro screen replacement with 6-month warranty",
      },
      price: {
        from: 2500000,
        to: 5000000,
      },
      estimatedTime: "2-3 giờ",
      category: "macbook",
      icon: "laptop",
      warranty: "6 tháng",
      isActive: true,
      isFeatured: true,
      order: 1,
    },
    {
      name: {
        vi: "Thay pin MacBook Air",
        en: "MacBook Air Battery Replacement",
      },
      description: {
        vi: "Thay pin MacBook Air bị chai, phồng hoặc không sạc được. Sử dụng pin chính hãng với công nghệ mới nhất, giúp kéo dài thời gian sử dụng máy.",
        en: "Replace degraded, swollen or non-charging MacBook Air batteries. Using genuine batteries with latest technology to extend device usage time.",
      },
      shortDescription: {
        vi: "Thay pin MacBook Air chính hãng, cải thiện thời lượng pin",
        en: "Genuine MacBook Air battery replacement, improved battery life",
      },
      price: {
        from: 1800000,
        to: 2500000,
      },
      estimatedTime: "1-2 giờ",
      category: "macbook",
      icon: "cpu",
      warranty: "6 tháng",
      isActive: true,
      isFeatured: true,
      order: 2,
    },
    {
      name: {
        vi: "Sửa bàn phím laptop",
        en: "Laptop Keyboard Repair",
      },
      description: {
        vi: "Sửa chữa bàn phím laptop bị liệt phím, dính phím, hoặc không nhận phím. Hỗ trợ tất cả các hãng laptop phổ biến như Dell, HP, Asus, Acer, Lenovo.",
        en: "Fix laptop keyboards with stuck keys, dead keys or unresponsive keys. Support all popular laptop brands like Dell, HP, Asus, Acer, Lenovo.",
      },
      shortDescription: {
        vi: "Sửa bàn phím laptop mọi hãng, thay phím lẻ",
        en: "Laptop keyboard repair all brands, individual key replacement",
      },
      price: {
        from: 300000,
        to: 1200000,
      },
      estimatedTime: "1-2 giờ",
      category: "laptop",
      icon: "laptop",
      warranty: "3 tháng",
      isActive: true,
      isFeatured: true,
      order: 3,
    },
    {
      name: {
        vi: "Khôi phục dữ liệu",
        en: "Data Recovery Service",
      },
      description: {
        vi: "Khôi phục dữ liệu từ ổ cứng bị hỏng, format nhầm, virus tấn công. Sử dụng công nghệ tiên tiến để khôi phục tối đa dữ liệu quan trọng của bạn.",
        en: "Recover data from damaged hard drives, accidental formatting, virus attacks. Using advanced technology to maximize recovery of your important data.",
      },
      shortDescription: {
        vi: "Khôi phục dữ liệu chuyên nghiệp, tỷ lệ thành công cao",
        en: "Professional data recovery with high success rate",
      },
      price: {
        from: 500000,
        to: 3000000,
      },
      estimatedTime: "1-5 ngày",
      category: "data",
      icon: "harddrive",
      warranty: "1 tháng",
      isActive: true,
      isFeatured: true,
      order: 4,
    },
    {
      name: {
        vi: "Vệ sinh laptop chuyên sâu",
        en: "Deep Laptop Cleaning",
      },
      description: {
        vi: "Vệ sinh toàn bộ laptop, thay keo tản nhiệt, làm sạch quạt tản nhiệt. Giúp laptop hoạt động mát mẻ, giảm tiếng ồn và tăng hiệu suất.",
        en: "Complete laptop cleaning, thermal paste replacement, fan cleaning. Helps laptop run cooler, reduce noise and increase performance.",
      },
      shortDescription: {
        vi: "Vệ sinh laptop, thay keo tản nhiệt, giảm nhiệt độ",
        en: "Laptop cleaning, thermal paste replacement, temperature reduction",
      },
      price: {
        from: 200000,
        to: 500000,
      },
      estimatedTime: "2-3 giờ",
      category: "laptop",
      icon: "wrench",
      warranty: "1 tháng",
      isActive: true,
      isFeatured: false,
      order: 5,
    },
    {
      name: {
        vi: "Nâng cấp RAM và SSD",
        en: "RAM and SSD Upgrade",
      },
      description: {
        vi: "Nâng cấp RAM và SSD để tăng tốc độ xử lý và khởi động máy tính. Tư vấn cấu hình phù hợp với nhu cầu sử dụng và ngân sách.",
        en: "Upgrade RAM and SSD to increase processing speed and boot time. Consulting suitable configuration for your usage needs and budget.",
      },
      shortDescription: {
        vi: "Nâng cấp RAM/SSD, tăng tốc máy tính",
        en: "RAM/SSD upgrade, boost computer speed",
      },
      price: {
        from: 500000,
        to: 5000000,
      },
      estimatedTime: "1 giờ",
      category: "laptop",
      icon: "cpu",
      warranty: "12 tháng",
      isActive: true,
      isFeatured: false,
      order: 6,
    },
  ],

  faqs: [
    {
      question: {
        vi: "Thời gian sửa chữa mất bao lâu?",
        en: "How long does repair take?",
      },
      answer: {
        vi: "Thời gian sửa chữa phụ thuộc vào loại sự cố và độ phức tạp. Hầu hết các trường hợp đơn giản như thay pin, vệ sinh có thể hoàn thành trong ngày. Các trường hợp phức tạp như sửa bo mạch chủ, khôi phục dữ liệu có thể mất 2-5 ngày làm việc. Chúng tôi sẽ thông báo thời gian cụ thể sau khi kiểm tra máy.",
        en: "Repair time depends on the type of issue and complexity. Most simple cases like battery replacement, cleaning can be completed same-day. Complex cases like motherboard repair, data recovery may take 2-5 business days. We will notify specific time after device inspection.",
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
        vi: "Có, chúng tôi cung cấp bảo hành từ 1-12 tháng cho tất cả dịch vụ sửa chữa tùy theo loại dịch vụ. Bảo hành bao gồm cả linh kiện thay thế và công sửa chữa. Trong thời gian bảo hành, nếu có lỗi do kỹ thuật, chúng tôi sẽ sửa chữa miễn phí.",
        en: "Yes, we provide 1-12 months warranty for all repair services depending on the service type. Warranty covers both replacement parts and repair work. During warranty period, if there are technical errors, we will repair for free.",
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
        vi: "Hiện tại chúng tôi chỉ nhận sửa chữa tại cửa hàng để đảm bảo chất lượng dịch vụ tốt nhất với đầy đủ thiết bị chuyên dụng. Tuy nhiên, chúng tôi có dịch vụ đến lấy và giao máy tận nơi trong khu vực nội thành với phí hợp lý.",
        en: "Currently we only accept repairs at our store to ensure the best service quality with complete specialized equipment. However, we offer pickup and delivery service within city area at reasonable cost.",
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
        vi: "Giá sửa chữa phụ thuộc vào loại sự cố, linh kiện cần thay và độ phức tạp của công việc. Chúng tôi sẽ kiểm tra và báo giá chi tiết trước khi thực hiện sửa chữa. Khách hàng chỉ thanh toán khi đồng ý với báo giá. Không sửa được thì không tính phí kiểm tra.",
        en: "Repair cost depends on the type of issue, parts needed and work complexity. We will inspect and provide detailed quote before performing repair. Customers only pay when agreeing with the quote. No fix, no diagnostic fee.",
      },
      category: "pricing",
      order: 4,
      isActive: true,
    },
    {
      question: {
        vi: "Có sử dụng linh kiện chính hãng không?",
        en: "Do you use genuine parts?",
      },
      answer: {
        vi: "Chúng tôi ưu tiên sử dụng linh kiện chính hãng cho tất cả dịch vụ sửa chữa. Trong trường hợp không có linh kiện chính hãng, chúng tôi sẽ tư vấn các lựa chọn thay thế chất lượng cao và thông báo rõ ràng cho khách hàng để đưa ra quyết định phù hợp.",
        en: "We prioritize using genuine parts for all repair services. When genuine parts are unavailable, we will advise high-quality alternative options and clearly inform customers to make appropriate decisions.",
      },
      category: "technical",
      order: 5,
      isActive: true,
    },
  ],

  testimonials: [
    {
      customerName: "Nguyễn Văn An",
      customerTitle: {
        vi: "Kỹ sư phần mềm",
        en: "Software Engineer",
      },
      content: {
        vi: "MacBook Pro của tôi bị vỡ màn hình và tôi rất lo lắng về dữ liệu công việc quan trọng. Đội ngũ LaptopSun không chỉ thay màn hình nhanh chóng mà còn giúp sao lưu toàn bộ dữ liệu an toàn. Dịch vụ chuyên nghiệp, giá cả hợp lý!",
        en: "My MacBook Pro had a broken screen and I was worried about important work data. LaptopSun team not only replaced the screen quickly but also helped backup all data safely. Professional service, reasonable price!",
      },
      rating: 5,
      serviceType: "macbook",
      isPublished: true,
      isFeatured: true,
      order: 1,
      publishedAt: new Date(),
    },
    {
      customerName: "Trần Thị Bình",
      customerTitle: {
        vi: "Sinh viên Đại học",
        en: "University Student",
      },
      content: {
        vi: "Laptop của em bị chậm và nóng máy liên tục. Sau khi vệ sinh và nâng cấp RAM tại LaptopSun, máy chạy mượt mà như mới. Giá cả phù hợp với túi tiền sinh viên, nhân viên tư vấn nhiệt tình!",
        en: "My laptop was slow and constantly overheating. After cleaning and RAM upgrade at LaptopSun, it runs smoothly like new. Price suitable for student budget, enthusiastic staff consultation!",
      },
      rating: 5,
      serviceType: "laptop",
      isPublished: true,
      isFeatured: true,
      order: 2,
      publishedAt: new Date(),
    },
    {
      customerName: "Lê Minh Cường",
      customerTitle: {
        vi: "Doanh nhân",
        en: "Businessman",
      },
      content: {
        vi: "Ổ cứng laptop chứa dữ liệu kinh doanh quan trọng bị hỏng đột ngột. May mắn tìm được LaptopSun, họ đã khôi phục được 98% dữ liệu trong 3 ngày. Dịch vụ khôi phục dữ liệu tuyệt vời, đáng tin cậy!",
        en: "Hard drive containing important business data suddenly failed. Fortunately found LaptopSun, they recovered 98% of data in 3 days. Excellent data recovery service, reliable!",
      },
      rating: 5,
      serviceType: "data_recovery",
      isPublished: true,
      isFeatured: true,
      order: 3,
      publishedAt: new Date(),
    },
    {
      customerName: "Phạm Thị Dung",
      customerTitle: {
        vi: "Kế toán viên",
        en: "Accountant",
      },
      content: {
        vi: "MacBook Air của tôi bị hỏng bàn phím, một số phím không hoạt động. LaptopSun đã thay bàn phím mới và kiểm tra toàn bộ hệ thống. Máy hoạt động hoàn hảo, bảo hành 6 tháng rất yên tâm.",
        en: "My MacBook Air had a faulty keyboard, some keys not working. LaptopSun replaced the keyboard and checked the entire system. Machine works perfectly, 6-month warranty gives peace of mind.",
      },
      rating: 4,
      serviceType: "macbook",
      isPublished: true,
      isFeatured: false,
      order: 4,
      publishedAt: new Date(),
    },
  ],

  blogPosts: [
    {
      title: {
        vi: "5 cách bảo vệ laptop khỏi virus và malware hiệu quả",
        en: "5 effective ways to protect your laptop from viruses and malware",
      },
      slug: "5-cach-bao-ve-laptop-khoi-virus-malware",
      content: {
        vi: "Virus và malware là những mối đe dọa thường xuyên đối với người dùng laptop. Trong bài viết này, chúng tôi sẽ chia sẻ 5 cách hiệu quả nhất để bảo vệ laptop của bạn khỏi các mối đe dọa này...",
        en: "Viruses and malware are constant threats to laptop users. In this article, we will share the 5 most effective ways to protect your laptop from these threats...",
      },
      excerpt: {
        vi: "Hướng dẫn chi tiết 5 phương pháp bảo vệ laptop khỏi virus và malware, giúp máy tính luôn an toàn và hoạt động ổn định.",
        en: "Detailed guide on 5 methods to protect laptop from viruses and malware, keeping your computer safe and running stable.",
      },
      tags: ["bảo mật", "virus", "malware", "laptop", "antivirus"],
      category: "security",
      isPublished: true,
      isFeatured: true,
      readTime: 8,
      publishedAt: new Date(),
      author: null,
    },
    {
      title: {
        vi: "Cách vệ sinh laptop đúng cách tại nhà",
        en: "How to properly clean your laptop at home",
      },
      slug: "cach-ve-sinh-laptop-dung-cach-tai-nha",
      content: {
        vi: "Vệ sinh laptop định kỳ là việc rất quan trọng để duy trì hiệu suất và kéo dài tuổi thọ máy. Bài viết này sẽ hướng dẫn bạn cách vệ sinh laptop an toàn và hiệu quả tại nhà...",
        en: "Regular laptop cleaning is very important to maintain performance and extend machine lifespan. This article will guide you on how to clean your laptop safely and effectively at home...",
      },
      excerpt: {
        vi: "Hướng dẫn từng bước cách vệ sinh laptop an toàn tại nhà, giúp máy hoạt động mát mẻ và bền bỉ hơn.",
        en: "Step-by-step guide on how to safely clean your laptop at home, helping it run cooler and more durable.",
      },
      tags: ["vệ sinh", "bảo dưỡng", "laptop", "cleaning", "maintenance"],
      category: "maintenance",
      isPublished: true,
      isFeatured: false,
      readTime: 6,
      publishedAt: new Date(Date.now() - 86400000),
      author: null,
    },
    {
      title: {
        vi: "Dấu hiệu nhận biết laptop cần thay pin",
        en: "Signs that your laptop battery needs replacement",
      },
      slug: "dau-hieu-nhan-biet-laptop-can-thay-pin",
      content: {
        vi: "Pin laptop là một trong những linh kiện dễ hỏng nhất và cần được thay thế định kỳ. Việc nhận biết sớm các dấu hiệu pin hỏng sẽ giúp bạn có kế hoạch thay thế kịp thời...",
        en: "Laptop battery is one of the most vulnerable components and needs periodic replacement. Early recognition of battery failure signs will help you plan timely replacement...",
      },
      excerpt: {
        vi: "Tìm hiểu các dấu hiệu cảnh báo pin laptop hỏng và cách kiểm tra tình trạng pin để quyết định thay thế đúng lúc.",
        en: "Learn the warning signs of laptop battery failure and how to check battery condition to decide on timely replacement.",
      },
      tags: ["pin", "battery", "laptop", "thay thế", "replacement"],
      category: "hardware",
      isPublished: true,
      isFeatured: true,
      readTime: 5,
      publishedAt: new Date(Date.now() - 172800000),
      author: null,
    },
  ],

  staticContent: [
    {
      key: "hero_banner",
      type: "hero",
      title: {
        vi: "Dịch vụ sửa chữa laptop chuyên nghiệp",
        en: "Professional laptop repair service",
      },
      content: {
        vi: "Chúng tôi cung cấp dịch vụ sửa chữa laptop, MacBook chuyên nghiệp với đội ngũ kỹ thuật viên giàu kinh nghiệm. Cam kết chất lượng, bảo hành dài hạn.",
        en: "We provide professional laptop and MacBook repair services with experienced technicians. Quality commitment, long-term warranty.",
      },
      buttonText: {
        vi: "Đặt lịch sửa chữa",
        en: "Book repair service",
      },
      buttonUrl: "/book-appointment",
      imageUrl: "/hero-laptop-repair.jpg",
      isActive: true,
      order: 1,
    },
    {
      key: "about_us",
      type: "about",
      title: {
        vi: "Về LaptopSun",
        en: "About LaptopSun",
      },
      content: {
        vi: "LaptopSun là trung tâm sửa chữa laptop và MacBook hàng đầu với hơn 5 năm kinh nghiệm. Chúng tôi tự hào mang đến dịch vụ chất lượng cao, sử dụng linh kiện chính hãng và đội ngũ kỹ thuật viên được đào tạo chuyên nghiệp.",
        en: "LaptopSun is a leading laptop and MacBook repair center with over 5 years of experience. We pride ourselves on providing high-quality service, using genuine parts and professionally trained technicians.",
      },
      isActive: true,
      order: 1,
    },
    {
      key: "contact_info",
      type: "footer",
      content: {
        vi: "Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM\nĐiện thoại: 0857270270\nEmail: info@laptopsun.com\nGiờ làm việc: 8:00 - 20:00 (Thứ 2 - Chủ nhật)",
        en: "Address: 123 ABC Street, District 1, Ho Chi Minh City\nPhone: 0857270270\nEmail: info@laptopsun.com\nWorking hours: 8:00 - 20:00 (Monday - Sunday)",
      },
      isActive: true,
      order: 1,
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

    // Clear existing collections
    console.log("🧹 Clearing existing data...");
    await db.collection("services").deleteMany({});
    await db.collection("faqs").deleteMany({});
    await db.collection("testimonials").deleteMany({});
    await db.collection("blogposts").deleteMany({});
    await db.collection("staticcontents").deleteMany({});

    // Seed Services
    console.log("🛠️  Seeding services...");
    const servicesWithTimestamp = seedData.services.map((service) => ({
      ...service,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await db.collection("services").insertMany(servicesWithTimestamp);
    console.log(`✅ Inserted ${servicesWithTimestamp.length} services`);

    // Seed FAQs
    console.log("❓ Seeding FAQs...");
    const faqsWithTimestamp = seedData.faqs.map((faq) => ({
      ...faq,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await db.collection("faqs").insertMany(faqsWithTimestamp);
    console.log(`✅ Inserted ${faqsWithTimestamp.length} FAQs`);

    // Seed Testimonials
    console.log("💬 Seeding testimonials...");
    const testimonialsWithTimestamp = seedData.testimonials.map(
      (testimonial) => ({
        ...testimonial,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );
    await db.collection("testimonials").insertMany(testimonialsWithTimestamp);
    console.log(`✅ Inserted ${testimonialsWithTimestamp.length} testimonials`);

    // Seed Blog Posts
    console.log("📝 Seeding blog posts...");
    const blogPostsWithTimestamp = seedData.blogPosts.map((post) => ({
      ...post,
      author: adminId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await db.collection("blogposts").insertMany(blogPostsWithTimestamp);
    console.log(`✅ Inserted ${blogPostsWithTimestamp.length} blog posts`);

    // Seed Static Content
    console.log("📄 Seeding static content...");
    const staticContentWithTimestamp = seedData.staticContent.map(
      (content) => ({
        ...content,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );
    await db
      .collection("staticcontents")
      .insertMany(staticContentWithTimestamp);
    console.log(
      `✅ Inserted ${staticContentWithTimestamp.length} static content items`
    );

    console.log("🎉 Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`- Services: ${seedData.services.length}`);
    console.log(`- FAQs: ${seedData.faqs.length}`);
    console.log(`- Testimonials: ${seedData.testimonials.length}`);
    console.log(`- Blog Posts: ${seedData.blogPosts.length}`);
    console.log(`- Static Content: ${seedData.staticContent.length}`);
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
