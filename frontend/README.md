# VSM Frontend

Ứng dụng frontend cho Vietnam Student Marathon - giao diện công cộng dành cho người dùng cuối.

## Tính năng

- 🏠 Trang chủ với thông tin giới thiệu
- 👥 Đăng ký và đăng nhập người dùng
- 📅 Xem danh sách và chi tiết sự kiện
- 📰 Đọc tin tức và bài viết
- 🛒 Cửa hàng sản phẩm
- 👤 Trang cá nhân người dùng
- 💬 Bình luận và tương tác

## Đặc điểm

- **Chỉ dành cho người dùng thông thường** - Không có tính năng admin
- **Clean Interface** - Giao diện sạch sẽ, dễ sử dụng
- **Responsive Design** - Tương thích tất cả thiết bị
- **Performance Optimized** - Tối ưu tốc độ tải trang

## Cài đặt

```bash
cd frontend
pnpm install
pnpm dev
```

Ứng dụng sẽ chạy trên http://localhost:3000

## Cấu trúc thư mục

```
frontend/
├── app/           # Next.js App Router pages
│   ├── about/     # Trang giới thiệu
│   ├── events/    # Danh sách và chi tiết sự kiện
│   ├── login/     # Đăng nhập
│   ├── news/      # Tin tức và bài viết
│   ├── profile/   # Trang cá nhân
│   ├── register/  # Đăng ký
│   └── shop/      # Cửa hàng
├── components/    # React components
│   ├── home/      # Components cho trang chủ
│   ├── layout/    # Header, footer, navigation
│   └── ui/        # UI components (shadcn/ui)
├── lib/          # Utilities và API helpers
├── hooks/        # Custom React hooks
├── contexts/     # React contexts (auth, theme)
└── public/       # Static assets
```

## Tài khoản demo

Để test ứng dụng, sử dụng các tài khoản sau:

- **User 1**: `user1@vsm.org.vn` / `password`
- **User 2**: `user2@vsm.org.vn` / `password`
- **Test User**: `testuser@vsm.org.vn` / `password`

## Scripts

- `pnpm dev` - Chạy development server
- `pnpm build` - Build production
- `pnpm start` - Chạy production server
- `pnpm lint` - Kiểm tra linting

## Tích hợp với Backend

Frontend này kết nối với backend API để:

- Xác thực người dùng
- Lấy dữ liệu sự kiện, tin tức
- Quản lý profile người dùng
- Xử lý đăng ký sự kiện

API base URL có thể được cấu hình trong file environment variables.

## Deployment

Có thể deploy trên các platform như:

- Vercel (recommended)
- Netlify
- AWS Amplify
- Docker containers

## Lưu ý

- Không chứa tính năng admin - dành riêng cho admin-page
- Chỉ hỗ trợ user role
- Tối ưu cho trải nghiệm người dùng cuối
