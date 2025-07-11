export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user";
  createdAt: string;
  isActive: boolean;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  cover: string;
  author: string;
  authorId: string;
  date: string;
  category: "training" | "nutrition" | "events" | "tips";
  views: number;
  likes: number;
  featured: boolean;
  status: "published" | "draft";
  tags: string[];
  commentsCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  status: "approved" | "pending" | "rejected";
  parentId?: string;
  replies?: Comment[];
}

export interface Event {
  id: string;
  name: string;
  description: string;
  content: string;
  date: string;
  location: string;
  image: string;
  maxParticipants: number;
  currentParticipants: number;
  price: number;
  category: "marathon" | "half-marathon" | "5k" | "10k" | "fun-run";
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  registrationDeadline: string;
  organizer: string;
  requirements: string[];
  featured: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: "apparel" | "accessories" | "nutrition" | "equipment";
  inStock: boolean;
  stock: number;
  featured: boolean;
  rating: number;
  reviews: number;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  emergencyContact: string;
  emergencyPhone: string;
  medicalConditions?: string;
  experience: "beginner" | "intermediate" | "advanced";
  status: "pending" | "confirmed" | "waitlist" | "cancelled";
  registeredAt: string;
}

// THÔNG TIN ĐĂNG NHẬP DEMO:
// User 1: user1@vsm.org.vn / password
// User 2: user2@vsm.org.vn / password
// Test User: testuser@vsm.org.vn / password

export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Nguyễn Văn A",
    email: "user1@vsm.org.vn",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    role: "user",
    createdAt: "2024-01-03T00:00:00Z",
    isActive: true,
  },
  {
    id: "user-2",
    name: "Trần Thị B",
    email: "user2@vsm.org.vn",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    role: "user",
    createdAt: "2024-01-04T00:00:00Z",
    isActive: true,
  },
  {
    id: "user-3",
    name: "Lê Minh C",
    email: "testuser@vsm.org.vn",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    role: "user",
    createdAt: "2024-01-05T00:00:00Z",
    isActive: true,
  },
];

export const mockPosts: Post[] = [
  {
    id: "post-1",
    title: "10 Bí quyết để hoàn thành Marathon đầu tiên",
    excerpt:
      "Những lời khuyên quan trọng nhất cho người mới bắt đầu chạy marathon từ các vận động viên chuyên nghiệp.",
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
    author: "Nguyễn Văn A",
    authorId: "user-1",
    date: "2024-01-10",
    category: "training",
    views: 1250,
    likes: 89,
    featured: true,
    status: "published",
    tags: ["marathon", "training", "beginner", "tips"],
    commentsCount: 23,
  },
  {
    id: "post-2",
    title: "Dinh dưỡng cho runner: Ăn gì trước và sau khi chạy?",
    excerpt:
      "Hướng dẫn chi tiết về chế độ dinh dưỡng phù hợp cho người chạy bộ, giúp tăng hiệu suất và hồi phục nhanh ch��ng.",
    content: `# Dinh dưỡng cho runner: Ăn gì trước và sau khi chạy?

Dinh dưỡng đóng vai trò cực kỳ quan trọng trong việc tối ưu hóa hiệu suất chạy bộ và quá trình phục hồi. Dưới đây là hướng dẫn chi tiết về chế độ ăn uống cho runner.

## Trước khi chạy (2-3 giờ)

### Bữa ăn chính
- **Carbohydrate phức hợp**: Yến mạch, bánh mì nguyên cám, cơm gạo lứt
- **Protein nhẹ**: Trứng, sữa chua Hy Lạp, cá
- **Ít chất béo và chất xơ**: Để tránh khó tiêu

### 30-60 phút trước khi chạy
- **Carbohydrate đơn giản**: Chuối, mật ong, bánh quy giòn
- **Nước**: 150-250ml nước lọc

## Trong khi chạy

### Chạy dưới 60 phút
- Chỉ cần nước lọc

### Chạy trên 60 phút
- **Carbohydrate**: 30-60g mỗi giờ
- **Điện giải**: Đồ uống thể thao
- **Nước**: 150-250ml mỗi 15-20 phút

## Sau khi chạy

### 30 phút đầu (Golden Hour)
- **Carbohydrate + Protein**: Tỷ lệ 3:1 hoặc 4:1
- **Ví dụ**: Sữa chocolate, chuối + sữa chua, bánh mì + thịt

### 2 giờ sau khi chạy
- **Bữa ăn đầy đủ dinh dưỡng**
- **Protein**: 20-25g để phục hồi cơ bắp
- **Carbohydrate**: Để nạp lại glycogen
- **Rau xanh**: Cung cấp vitamin và khoáng chất

## Lưu ý quan trọng

1. **Hydration**: Uống nước thường xuyên, không chờ đến khi khát
2. **Thử nghiệm**: Test mọi thứ trong lúc tập, không thử mới trong ngày thi
3. **Cá nhân hóa**: Mỗi người có nhu cầu khác nhau
4. **Timing**: Thời điểm ăn uống rất quan trọng

Nhớ rằng, dinh dưỡng tốt sẽ giúp bạn chạy tốt hơn và phục hồi nhanh hơn!`,
    cover: "/placeholder.svg?height=400&width=800",
    author: "Trần Thị B",
    authorId: "user-2",
    date: "2024-01-08",
    category: "nutrition",
    views: 890,
    likes: 67,
    featured: false,
    status: "published",
    tags: ["nutrition", "hydration", "performance", "recovery"],
    commentsCount: 18,
  },
  {
    id: "post-3",
    title: "VSM 2024: Chuẩn bị cho giải chạy lớn nhất năm",
    excerpt:
      "Thông tin chi tiết về giải Vietnam Student Marathon 2024, các hạng mục thi đấu và cách đăng ký tham gia.",
    content: `# VSM 2024: Chuẩn bị cho giải chạy lớn nhất năm

Vietnam Student Marathon 2024 đang đến gần! Đây là sự kiện chạy bộ lớn nhất dành cho sinh viên Việt Nam với nhiều hạng mục đa dạng và hấp dẫn.

## Thông tin cơ bản

- **Thời gian**: 15/03/2024
- **Địa điểm**: Thành phố Hồ Chí Minh
- **Chủ đề**: "Chạy vì tương lai"

## Các hạng mục thi đấu

### 1. Full Marathon (42.195km)
- **Thời gian giới hạn**: 6 giờ
- **Lệ phí**: 500,000 VNĐ
- **Giải thưởng**: Top 3 nam/nữ

### 2. Half Marathon (21.1km)
- **Thời gian giới hạn**: 3 giờ
- **Lệ phí**: 300,000 VNĐ
- **Hạng mục phổ biến nhất**

### 3. 10K Run
- **Thời gian giới hạn**: 1.5 giờ
- **Lệ phí**: 200,000 VNĐ
- **Dành cho người mới bắt đầu**

### 4. 5K Fun Run
- **Thời gian giới hạn**: 45 phút
- **Lệ phí**: 150,000 VNĐ
- **Phù hợp cho mọi lứa tuổi**

## Phần thưởng

- **Huy chương hoàn thành** cho tất cả VĐV về đích
- **Áo kỷ niệm** độc quyền VSM 2024
- **Giải thưởng tiền mặt** cho Top 3 mỗi hạng mục
- **Cơ hội suất tham dự Boston Marathon**

## Cách đăng ký

1. Truy cập website vsm.org.vn
2. Chọn hạng mục thi đấu
3. Điền thông tin cá nhân
4. Thanh toán lệ phí
5. Nhận xác nhận qua email

## Chuẩn bị cho cuộc đua

### Tập luyện
- Bắt đầu kế hoạch tập luyện từ 12-16 tuần trước
- Tăng dần khoảng cách và cường độ
- Không quên nghỉ ngơi phục hồi

### Dinh dưỡng
- Chế độ ăn cân bằng, đầy đủ dinh dưỡng
- Thực hành chiến lược dinh dưỡng trong ngày thi
- Uống đủ nước hàng ngày

### Tinh thần
- Đặt mục tiêu thực tế
- Tìm hiểu về đường chạy
- Chuẩn bị tâm lý cho những khó khăn

Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia sự kiện đáng nhớ này!`,
    cover: "/placeholder.svg?height=400&width=800",
    author: "Lê Minh C",
    authorId: "user-3",
    date: "2024-01-05",
    category: "events",
    views: 2100,
    likes: 156,
    featured: true,
    status: "published",
    tags: ["VSM", "marathon", "event", "registration"],
    commentsCount: 45,
  },
];

export const mockEvents: Event[] = [
  {
    id: "event-1",
    name: "Vietnam Student Marathon 2024",
    description: "Giải chạy marathon lớn nhất dành cho sinh viên Việt Nam",
    content:
      "Sự kiện chạy bộ thường niên lớn nhất dành cho cộng đồng sinh viên...",
    date: "2024-03-15T06:00:00Z",
    location: "TP. Hồ Chí Minh",
    image: "/placeholder.svg?height=400&width=800",
    maxParticipants: 5000,
    currentParticipants: 3420,
    price: 500000,
    category: "marathon",
    status: "upcoming",
    registrationDeadline: "2024-03-01T23:59:59Z",
    organizer: "Vietnam Student Marathon",
    requirements: [
      "Sinh viên đang học tại Việt Nam",
      "Giấy khám sức khỏe",
      "Bảo hiểm y tế",
    ],
    featured: true,
  },
  {
    id: "event-2",
    name: "Ho Chi Minh City Half Marathon",
    description: "Giải chạy bán marathon xuyên qua trung tâm thành phố",
    content: "Chạy qua những con đường đẹp nhất của Sài Gòn...",
    date: "2024-02-18T06:00:00Z",
    location: "TP. Hồ Chí Minh",
    image: "/placeholder.svg?height=400&width=800",
    maxParticipants: 3000,
    currentParticipants: 2850,
    price: 300000,
    category: "half-marathon",
    status: "upcoming",
    registrationDeadline: "2024-02-10T23:59:59Z",
    organizer: "HCMC Running Club",
    requirements: ["Tuổi từ 16 trở lên", "Giấy khám sức khỏe"],
    featured: true,
  },
];

export const mockProducts: Product[] = [
  {
    id: "product-1",
    name: "Áo chạy bộ VSM 2024",
    description: "Áo chạy bộ chính thức của Vietnam Student Marathon 2024",
    price: 299000,
    originalPrice: 399000,
    image: "/placeholder.svg?height=400&width=400",
    images: ["/placeholder.svg?height=400&width=400"],
    category: "apparel",
    inStock: true,
    stock: 250,
    featured: true,
    rating: 4.8,
    reviews: 89,
  },
  {
    id: "product-2",
    name: "Giày chạy bộ VSM Pro",
    description: "Giày chạy bộ chuyên nghiệp dành cho runner",
    price: 1299000,
    image: "/placeholder.svg?height=400&width=400",
    images: ["/placeholder.svg?height=400&width=400"],
    category: "equipment",
    inStock: true,
    stock: 45,
    featured: true,
    rating: 4.9,
    reviews: 156,
  },
];

export const mockEventRegistrations: EventRegistration[] = [
  {
    id: "reg-1",
    eventId: "event-1",
    userId: "user-1",
    fullName: "Nguyễn Văn A",
    email: "user1@vsm.org.vn",
    phone: "0901234567",
    emergencyContact: "Nguyễn Văn B",
    emergencyPhone: "0909876543",
    experience: "intermediate",
    status: "confirmed",
    registeredAt: "2024-01-15T10:00:00Z",
  },
];

export const mockComments: Comment[] = [
  {
    id: "comment-1",
    postId: "post-1",
    userId: "user-2",
    userName: "Trần Thị B",
    userAvatar: "https://randomuser.me/api/portraits/women/4.jpg",
    content: "Bài viết rất hữu ích! Cảm ơn bạn đã chia sẻ.",
    createdAt: "2024-01-11T08:30:00Z",
    status: "approved",
  },
];
