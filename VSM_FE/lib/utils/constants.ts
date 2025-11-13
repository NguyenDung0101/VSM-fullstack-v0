 // API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// App Configuration
export const APP_NAME = "VSM";
export const APP_VERSION = "1.0.0";

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Validation
export const PASSWORD_MIN_LENGTH = 8;
export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 50;

// Date Formats
export const DATE_FORMAT = "YYYY-MM-DD";
export const DATETIME_FORMAT = "YYYY-MM-DD HH:mm:ss";

// Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  EVENTS: "/events",
  NEWS: "/news",
  PROFILE: "/profile",
  ADMIN: "/admin",
} as const;