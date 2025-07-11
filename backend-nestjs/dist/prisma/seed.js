"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("🌱 Starting database seed...");
    await prisma.eventRegistration.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.product.deleteMany();
    await prisma.event.deleteMany();
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();
    console.log("🗑️  Cleared existing data");
    const hashedPassword = await bcrypt.hash("password", 10);
    const admin = await prisma.user.create({
        data: {
            name: "Admin VSM",
            email: "admin@vsm.org.vn",
            password: hashedPassword,
            avatar: "https://randomuser.me/api/portraits/men/1.jpg",
            role: client_1.Role.ADMIN,
            isActive: true,
        },
    });
    const editor = await prisma.user.create({
        data: {
            name: "Biên tập viên VSM",
            email: "editor@vsm.org.vn",
            password: hashedPassword,
            avatar: "https://randomuser.me/api/portraits/women/2.jpg",
            role: client_1.Role.EDITOR,
            isActive: true,
        },
    });
    const user1 = await prisma.user.create({
        data: {
            name: "Nguyễn Văn A",
            email: "user1@vsm.org.vn",
            password: hashedPassword,
            avatar: "https://randomuser.me/api/portraits/men/3.jpg",
            role: client_1.Role.USER,
            isActive: true,
        },
    });
    const user2 = await prisma.user.create({
        data: {
            name: "Trần Thị B",
            email: "user2@vsm.org.vn",
            password: hashedPassword,
            avatar: "https://randomuser.me/api/portraits/women/4.jpg",
            role: client_1.Role.USER,
            isActive: true,
        },
    });
    const user3 = await prisma.user.create({
        data: {
            name: "Lê Minh C",
            email: "testuser@vsm.org.vn",
            password: hashedPassword,
            avatar: "https://randomuser.me/api/portraits/men/5.jpg",
            role: client_1.Role.USER,
            isActive: true,
        },
    });
    console.log("👥 Created users");
    const post1 = await prisma.post.create({
        data: {
            title: "10 Bí quyết để hoàn thành Marathon đầu tiên",
            excerpt: "Những lời khuyên quan trọng nhất cho người mới bắt đầu chạy marathon từ các vận động viên chuyên nghiệp.",
            content: `# 10 Bí quyết để hoàn thành Marathon đầu tiên

Marathon là một thử thách tuyệt vời, đòi hỏi sự chuẩn bị kỹ lưỡng về cả thể chất và tinh thần. Dưới đây là 10 bí quyết giúp bạn hoàn thành marathon đầu tiên một cách an toàn và hiệu quả.

## 1. Xây dựng kế hoạch tập luyện dài hạn

Một kế hoạch tập luyện marathon thường kéo dài 16-20 tuần. Điều quan trọng là tăng dần cường độ và khoảng cách một cách từ từ để tránh chấn thương.

## 2. Chú trọng vào chạy chậm

80% thời gian tập luyện nên ở cường độ nhẹ nhàng. Điều này giúp xây dựng nền tảng sức bền mà không gây quá tải cho cơ thể.

## 3. Thực hành dinh dưỡng trong khi chạy

Hãy thử nghiệm các loại gel năng lượng, đồ uống thể thao trong quá trình tập luyện để tìm ra phương án phù hợp nhất với cơ thể bạn.

## 4. Đầu tư vào giày chạy bộ chất lượng

Một đôi giày phù hợp có thể ngăn ngừa nhiều chấn thương và mang lại cảm giác thoải mái suốt quá trình chạy.

## 5. Nghe cơ thể mình

Học cách phân biệt giữa mệt mỏi bình thường và dấu hiệu chấn thương. Khi cần thiết, hãy nghỉ ngơi để phục hồi.

## 6. Luyện tập tinh thần

Marathon không chỉ là thử thách thể chất mà còn là thử thách tinh thần. Hãy chuẩn bị tâm lý cho những khoảnh khắc khó khăn trong cuộc đua.

## 7. Tham gia các cuộc thi nhỏ hơn

Chạy thử ở các giải 5K, 10K hoặc half-marathon để làm quen với bầu không khí thi đấu.

## 8. Chú ý đến việc phục hồi

Ngủ đủ giấc, massage, và các hoạt động phục hồi khác cũng quan trọng như việc tập luyện.

## 9. Có kế hoạch B

Luôn có một kế hoạch dự phòng cho ngày thi đấu, bao gồm cả việc điều chỉnh tốc độ nếu cần thiết.

## 10. Tận hưởng trải nghiệm

Cuối cùng, hãy nhớ rằng hoàn thành marathon đầu tiên là một thành tựu đáng tự hào. Tận hưởng từng khoảnh khắc!`,
            cover: "/placeholder.svg?height=400&width=800",
            category: client_1.PostCategory.TRAINING,
            views: 1250,
            likes: 89,
            featured: true,
            status: client_1.PostStatus.PUBLISHED,
            tags: JSON.stringify(["marathon", "training", "beginner", "tips"]),
            publishedAt: new Date("2024-01-10"),
            authorId: user1.id,
        },
    });
    const post2 = await prisma.post.create({
        data: {
            title: "Dinh dưỡng cho runner: Ăn gì trước và sau khi chạy?",
            excerpt: "Hướng dẫn chi tiết về chế độ dinh dưỡng phù hợp cho người chạy bộ, giúp tăng hiệu suất và hồi phục nhanh chóng.",
            content: `# Dinh dưỡng cho runner: Ăn gì trước và sau khi chạy?

Dinh dưỡng đóng vai trò cực kỳ quan trọng trong việc tối ưu hóa hiệu suất chạy bộ và quá trình phục hồi.`,
            cover: "/placeholder.svg?height=400&width=800",
            category: client_1.PostCategory.NUTRITION,
            views: 890,
            likes: 67,
            featured: false,
            status: client_1.PostStatus.PUBLISHED,
            tags: JSON.stringify([
                "nutrition",
                "hydration",
                "performance",
                "recovery",
            ]),
            publishedAt: new Date("2024-01-08"),
            authorId: user2.id,
        },
    });
    const post3 = await prisma.post.create({
        data: {
            title: "VSM 2024: Chuẩn bị cho giải chạy lớn nhất năm",
            excerpt: "Thông tin chi tiết về giải Vietnam Student Marathon 2024, các hạng mục thi đấu và cách đăng ký tham gia.",
            content: `# VSM 2024: Chuẩn bị cho giải chạy lớn nhất năm

Vietnam Student Marathon 2024 đang đến gần! Đây là sự kiện chạy bộ lớn nhất dành cho sinh viên Việt Nam.`,
            cover: "/placeholder.svg?height=400&width=800",
            category: client_1.PostCategory.EVENTS,
            views: 2100,
            likes: 156,
            featured: true,
            status: client_1.PostStatus.PUBLISHED,
            tags: JSON.stringify(["VSM", "marathon", "event", "registration"]),
            publishedAt: new Date("2024-01-05"),
            authorId: user3.id,
        },
    });
    console.log("📝 Created posts");
    const event1 = await prisma.event.create({
        data: {
            name: "Vietnam Student Marathon 2024",
            description: "Giải chạy marathon lớn nhất dành cho sinh viên Việt Nam",
            content: "Sự kiện chạy bộ thường niên lớn nhất dành cho cộng đồng sinh viên với cự ly marathon đầy thử thách 42.195km.",
            date: new Date("2024-03-15T06:00:00Z"),
            location: "TP. Hồ Chí Minh",
            image: "/placeholder.svg?height=400&width=800",
            maxParticipants: 5000,
            currentParticipants: 3420,
            category: client_1.EventCategory.MARATHON,
            status: client_1.EventStatus.UPCOMING,
            distance: "42.195km",
            registrationFee: 500000,
            requirements: "Sinh viên đang học tại Việt Nam, Giấy khám sức khỏe, Bảo hiểm y tế",
            published: true,
            featured: true,
            registrationDeadline: new Date("2024-03-01T23:59:59Z"),
            organizer: "Vietnam Student Marathon",
            authorId: admin.id,
        },
    });
    const event2 = await prisma.event.create({
        data: {
            name: "Ho Chi Minh City Half Marathon",
            description: "Giải chạy bán marathon xuyên qua trung tâm thành phố",
            content: "Chạy qua những con đường đẹp nhất của Sài Gòn với cự ly half marathon 21.1km.",
            date: new Date("2024-02-18T06:00:00Z"),
            location: "TP. Hồ Chí Minh",
            image: "/placeholder.svg?height=400&width=800",
            maxParticipants: 3000,
            currentParticipants: 2850,
            category: client_1.EventCategory.HALF_MARATHON,
            status: client_1.EventStatus.UPCOMING,
            distance: "21.1km",
            registrationFee: 300000,
            requirements: "Tuổi từ 16 trở lên, Giấy khám sức khỏe",
            published: true,
            featured: true,
            registrationDeadline: new Date("2024-02-10T23:59:59Z"),
            organizer: "HCMC Running Club",
            authorId: editor.id,
        },
    });
    console.log("🏃 Created events");
    await prisma.product.create({
        data: {
            name: "Áo chạy bộ VSM 2024",
            description: "Áo chạy bộ chính thức của Vietnam Student Marathon 2024",
            price: 299000,
            originalPrice: 399000,
            images: JSON.stringify(["/placeholder.svg?height=400&width=400"]),
            category: client_1.ProductCategory.APPAREL,
            inStock: true,
            stock: 250,
            featured: true,
            rating: 4.8,
            reviews: 89,
        },
    });
    await prisma.product.create({
        data: {
            name: "Giày chạy bộ VSM Pro",
            description: "Giày chạy bộ chuyên nghiệp dành cho runner",
            price: 1299000,
            images: JSON.stringify(["/placeholder.svg?height=400&width=400"]),
            category: client_1.ProductCategory.EQUIPMENT,
            inStock: true,
            stock: 45,
            featured: true,
            rating: 4.9,
            reviews: 156,
        },
    });
    console.log("🛍️  Created products");
    await prisma.post.update({
        where: { id: post1.id },
        data: { commentsCount: 23 },
    });
    await prisma.post.update({
        where: { id: post2.id },
        data: { commentsCount: 18 },
    });
    await prisma.post.update({
        where: { id: post3.id },
        data: { commentsCount: 45 },
    });
    console.log("✅ Database seeded successfully!");
}
main()
    .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map