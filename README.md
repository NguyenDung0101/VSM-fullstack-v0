# VSM - Vietnam Student Marathon

Hệ thống hoàn chỉnh cho Vietnam Student Marathon, bao gồm ứng dụng frontend cho người dùng, trang quản trị admin và backend API.

## Cấu trúc dự án

```
vsm/
├── frontend/     # Ứng dụng người dùng (Frontend công cộng)
├── admin-page/   # Trang quản trị (Admin CMS)
└── backend/      # API Backend (NestJS)
```

## Ứng dụng

### 🌐 Frontend (Port 3000)

Giao diện công cộng dành cho người dùng cuối:

- Trang chủ giới thiệu
- Đăng ký/Đăng nhập người dùng
- Xem sự kiện và tin tức
- Cửa hàng sản phẩm
- Trang cá nhân người dùng

### 🏗️ Admin Page (Port 3001)

Trang quản trị hệ thống:

- Dashboard quản trị
- Quản lý bài viết, sự kiện, sản phẩm
- Quản lý người dùng và bình luận
- Báo cáo và thống kê

### ⚙️ Backend API (Port 3002)

API backend sử dụng NestJS:

- Authentication & Authorization
- CRUD operations
- File upload
- Database management

## Cài đặt và chạy

### Chạy tất cả ứng dụng

```bash
# Cài đặt dependencies cho tất cả apps
pnpm install:all

# Chạy development servers
pnpm dev:all
```

### Chạy từng ứng dụng riêng

#### Frontend (Người dùng)

```bash
cd frontend
pnpm install
pnpm dev  # http://localhost:3000
```

#### Admin Page (Quản trị)

```bash
cd admin-page
pnpm install
pnpm dev  # http://localhost:3001
```

#### Backend API

```bash
cd backend
pnpm install
pnpm start:dev  # http://localhost:3002
```

## Công nghệ sử dụng

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Framework**: Tailwind CSS, Radix UI
- **Backend**: NestJS, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT, Passport.js

## Scripts hữu ích

### Root Scripts

- `pnpm dev:all` - Chạy tất cả ứng dụng
- `pnpm build:all` - Build tất cả ứng dụng
- `pnpm lint:all` - Lint tất cả ứng dụng
- `pnpm install:all` - Cài dependencies cho tất cả

### Frontend Scripts

- `pnpm dev:frontend` - Development server
- `pnpm build:frontend` - Production build
- `pnpm lint:frontend` - Lint checking

### Admin Scripts

- `pnpm dev:admin` - Development server
- `pnpm build:admin` - Production build
- `pnpm lint:admin` - Lint checking

### Backend Scripts

- `pnpm dev:backend` - Development server
- `pnpm build:backend` - Production build
- `pnpm lint:backend` - Lint checking

## Phát triển

1. **Frontend**: Phát triển giao diện người dùng cuối
2. **Admin Page**: Phát triển hệ thống quản trị
3. **Backend**: Phát triển API và business logic

Mỗi ứng dụng có thể được phát triển độc lập với nhau.

## Cấu trúc chi tiết

### Frontend (/frontend)

- Trang chủ và landing pages
- Xác thực người dùng (chỉ user role)
- Quản lý profile cá nhân
- Đăng ký sự kiện
- Đọc tin tức và bài viết

### Admin Page (/admin-page)

- Dashboard tổng quan
- Quản lý CRUD cho tất cả entities
- Hệ thống phân quyền admin
- Báo cáo và analytics

### Backend (/backend)

- RESTful API
- Database với Prisma ORM
- Authentication với JWT
- File upload và storage
