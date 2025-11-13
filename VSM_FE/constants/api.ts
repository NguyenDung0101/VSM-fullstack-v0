// =============================================================================
// API CONSTANTS
// =============================================================================

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  HEADERS: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    PROFILE: "/auth/profile",
    CHANGE_PASSWORD: "/auth/change-password",
  },
  
  // User endpoints
  USERS: {
    BASE: "/users",
    PROFILE: "/users/profile",
    AVATAR: "/users/avatar",
    PASSWORD: "/users/password",
  },
  
  // Event endpoints
  EVENTS: {
    BASE: "/events",
    FEATURED: "/events/featured",
    UPCOMING: "/events/upcoming",
    REGISTRATIONS: "/events/registrations",
  },
  
  // Event registration endpoints
  EVENT_REGISTRATIONS: {
    BASE: "/event-registrations",
    BY_EVENT: "/event-registrations/event",
    BY_USER: "/event-registrations/user",
  },
  
  // News/Post endpoints
  NEWS: {
    BASE: "/news",
    FEATURED: "/news/featured",
    CATEGORIES: "/news/categories",
    COMMENTS: "/news/comments",
  },
  
  // Product endpoints
  PRODUCTS: {
    BASE: "/products",
    FEATURED: "/products/featured",
    CATEGORIES: "/products/categories",
    IN_STOCK: "/products/in-stock",
  },
  
  // Upload endpoints
  UPLOADS: {
    BASE: "/uploads",
    IMAGE: "/uploads/image",
    DOCUMENT: "/uploads/document",
    AVATAR: "/uploads/avatar",
  },
  
  // Contact endpoints
  CONTACTS: {
    BASE: "/contacts",
    SUBMIT: "/contacts/submit",
  },
  
  // Homepage endpoints
  HOMEPAGE: {
    BASE: "/homepage",
    SECTIONS: "/homepage/sections",
    PREVIEW: "/homepage/preview",
  },
  
  // Homepage sections endpoints
  HOMEPAGE_SECTIONS: {
    BASE: "/homepage-sections",
    BY_TYPE: "/homepage-sections/type",
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  // Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  
  // Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  
  // Server Errors
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

// API Response Messages
export const API_MESSAGES = {
  SUCCESS: {
    CREATED: "Tạo thành công",
    UPDATED: "Cập nhật thành công",
    DELETED: "Xóa thành công",
    FETCHED: "Lấy dữ liệu thành công",
  },
  ERROR: {
    NETWORK: "Lỗi kết nối mạng",
    TIMEOUT: "Yêu cầu hết thời gian chờ",
    SERVER: "Lỗi máy chủ",
    VALIDATION: "Dữ liệu không hợp lệ",
    NOT_FOUND: "Không tìm thấy dữ liệu",
    UNAUTHORIZED: "Không có quyền truy cập",
    FORBIDDEN: "Truy cập bị từ chối",
  },
} as const;

// Query Parameters
export const QUERY_PARAMS = {
  PAGE: "page",
  LIMIT: "limit",
  SEARCH: "search",
  CATEGORY: "category",
  STATUS: "status",
  FEATURED: "featured",
  SORT: "sort",
  ORDER: "order",
  DATE_FROM: "dateFrom",
  DATE_TO: "dateTo",
} as const;

// Sort Options
export const SORT_OPTIONS = {
  ASC: "asc",
  DESC: "desc",
  NEWEST: "newest",
  OLDEST: "oldest",
  NAME: "name",
  DATE: "date",
  PRICE: "price",
  POPULARITY: "popularity",
} as const;

// Pagination Defaults
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
  PAGE_SIZES: [10, 20, 50, 100],
} as const;

// File Upload
export const UPLOAD_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  ALLOWED_DOCUMENT_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ],
  IMAGE_QUALITY: 0.8,
  THUMBNAIL_SIZE: 300,
} as const;

export default {
  API_CONFIG,
  API_ENDPOINTS,
  HTTP_STATUS,
  API_MESSAGES,
  QUERY_PARAMS,
  SORT_OPTIONS,
  PAGINATION_DEFAULTS,
  UPLOAD_CONFIG,
}; 