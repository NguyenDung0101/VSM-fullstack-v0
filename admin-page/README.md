# VSM Admin Page

Trang quản trị cho Vietnam Student Marathon - hệ thống CMS dành cho quản trị viên và biên tập viên.

## Tính năng

- 🏗️ Dashboard tổng quan hệ thống
- 📝 Quản lý bài viết và tin tức
- 📅 Quản lý sự kiện
- 🛍️ Quản lý sản phẩm
- 👥 Quản lý người dùng
- 💬 Quản lý bình luận
- 📊 Báo cáo và thống kê
- ⚙️ Cài đặt hệ thống

## Đặc điểm

- **Chuyên dụng cho Admin** - Tất cả tính năng quản trị
- **CRUD Operations** - Tạo, đọc, cập nhật, xóa tất cả entities
- **Role-based Access** - Phân quyền theo vai trò
- **Analytics Dashboard** - Báo cáo và thống kê chi tiết

## Cài đặt

```bash
cd admin-page
pnpm install
pnpm dev
```

Ứng dụng sẽ chạy trên http://localhost:3001

## Cấu trúc thư mục

```
admin-page/
├── app/           # Next.js App Router pages
│   ├── admin/     # Admin routes
│   │   ├── events/
│   │   ├── posts/
│   │   └── products/
│   └── dashboard/ # Dashboard routes
│       ├── comments/
│       ├── events/
│       ├── posts/
│       ├── settings/
│       ├── uploads/
│       └── users/
├── components/    # React components
│   ├── admin/     # Admin-specific components
│   ├── dashboard/ # Dashboard components
│   └── ui/        # UI components (shadcn/ui)
├── lib/          # Utilities và API helpers
├── hooks/        # Custom React hooks
├── contexts/     # React contexts
└── public/       # Static assets
```

## Quyền truy cập

Chỉ dành cho:

- **Admin** - Toàn quyền truy cập
- **Editor** - Quyền quản lý nội dung
- **Moderator** - Quyền kiểm duyệt

## Chức năng chính

### Dashboard

- Tổng quan số liệu hệ thống
- Biểu đồ thống kê
- Hoạt động gần đây
- Thông báo và alerts

### Quản lý nội dung

- **Posts**: Tạo, chỉnh sửa, xuất bản bài viết
- **Events**: Quản lý sự kiện và đăng ký
- **Products**: Quản lý sản phẩm cửa hàng

### Quản lý người dùng

- Danh sách người dùng
- Phân quyền và vai trò
- Khóa/mở khóa tài khoản
- Thống kê hoạt động

### Quản lý bình luận

- Kiểm duyệt bình luận
- Phê duyệt/từ chối
- Quản lý spam

## Scripts

- `pnpm dev` - Chạy development server (port 3001)
- `pnpm build` - Build production
- `pnpm start` - Chạy production server
- `pnpm lint` - Kiểm tra linting

## Tích hợp với Backend

Admin page kết nối với cùng backend API như frontend để:

- Xác thực admin/editor
- CRUD operations cho tất cả entities
- Upload files và media
- Quản lý permissions

## Security

- JWT-based authentication
- Role-based access control
- CSRF protection
- Input validation và sanitization

## Deployment

Nên deploy riêng biệt với frontend:

- Subdomain riêng (admin.vsm.org.vn)
- Bảo mật cao hơn
- Có thể restrict IP access
- Environment variables riêng

## Lưu ý bảo mật

- Chỉ admin/editor mới có thể truy cập
- Luôn sử dụng HTTPS trong production
- Implement rate limiting
- Regular security audits
