import ApiClientBase from './base';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

// Backend News interface matching the Prisma schema
export interface BackendNews {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  cover?: string;
  category: 'training' | 'nutrition' | 'events' | 'tips';
  status: 'published' | 'draft';
  featured: boolean;
  views: number;
  likes?: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author?: {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
  };
  tags?: string;
  _count?: {
    comments: number;
  };
}

// Frontend News interface for the UI
export interface News {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  cover: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  date: string;
  category: "training" | "nutrition" | "events" | "tips";
  views: number;
  featured: boolean;
  likes?: number;
  commentsCount?: number;
  tags?: string;
  status?: "published" | "draft";
}

export interface NewsResponse {
  data: BackendNews[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface NewsFilters {
  category?: string;
  status?: string;
  featured?: string;
  search?: string;
  author?: string;
  limit?: number;
  page?: number;
}

export interface CreateNewsDto {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  featured?: boolean;
  cover?: string;
  tags?: string;
  status?: string;
  publishedAt?: string;
}

export interface UpdateNewsDto extends Partial<CreateNewsDto> {}

export interface NewsStatsResponse {
  totalNews: number;
  publishedNews: number;
  draftNews: number;
  totalViews: number;
  totalLikes: number;
  newsByCategory: {
    category: string;
    count: number;
  }[];
  recentNews: BackendNews[];
  popularNews: BackendNews[];
}

class NewsApi extends ApiClientBase {
  constructor() {
    super(API_BASE_URL);
  }

  // Public API methods
  async getNews(filters: NewsFilters = {}): Promise<NewsResponse> {
    const queryParams = new URLSearchParams();
    
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.featured) queryParams.append('featured', filters.featured);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.author) queryParams.append('author', filters.author);
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.page) queryParams.append('page', filters.page.toString());

    const queryString = queryParams.toString();
    const endpoint = `/news${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  async getNewsArticle(id: string): Promise<BackendNews> {
    return this.request(`/news/${id}`);
  }

  async getNewsArticleBySlug(slug: string): Promise<BackendNews> {
    return this.request(`/news/slug/${slug}`);
  }

  // Admin API methods
  async getAdminNews(filters: NewsFilters = {}): Promise<NewsResponse> {
    const queryParams = new URLSearchParams();
    
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.page) queryParams.append('page', filters.page.toString());

    const queryString = queryParams.toString();
    const endpoint = `/news${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  async createNews(data: CreateNewsDto, image?: File): Promise<BackendNews> {
    if (!image) {
      return this.request('/news', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } else {
      // For multipart/form-data with file upload
      const formData = new FormData();
      
      // Add news data as JSON string
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        }
      });
      
      // Add image file
      formData.append('image', image);
      
      // Custom fetch for multipart/form-data
      const headers: HeadersInit = {};
      this.updateToken();
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }
      
      const response = await fetch(`${this.baseURL}/news`, {
        method: 'POST',
        headers,
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    }
  }

  async updateNews(id: string, data: UpdateNewsDto, image?: File): Promise<BackendNews> {
    if (!image) {
      return this.request(`/news/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    } else {
      // For multipart/form-data with file upload
      const formData = new FormData();
      
      // Add news data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        }
      });
      
      // Add image file
      formData.append('image', image);
      
      // Custom fetch for multipart/form-data
      const headers: HeadersInit = {};
      this.updateToken();
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }
      
      const response = await fetch(`${this.baseURL}/news/${id}`, {
        method: 'PATCH',
        headers,
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    }
  }

  async deleteNews(id: string): Promise<void> {
    return this.request(`/news/${id}`, {
      method: 'DELETE',
    });
  }

  async getNewsStats(filters: Partial<NewsFilters> = {}): Promise<NewsStatsResponse> {
    const queryParams = new URLSearchParams();
    
    if (filters.search) queryParams.append('search', filters.search);
    
    const queryString = queryParams.toString();
    const endpoint = `/news/stats/overview${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  async incrementNewsViews(id: string): Promise<void> {
    return this.request(`/news/${id}/views`, {
      method: 'POST',
    });
  }

  async likeNews(id: string): Promise<{ likes: number }> {
    return this.request(`/news/${id}/like`, {
      method: 'POST',
    });
  }

  async unlikeNews(id: string): Promise<{ likes: number }> {
    return this.request(`/news/${id}/unlike`, {
      method: 'POST',
    });
  }

  // Comments related methods for news
  async getNewsComments(newsId: string): Promise<any[]> {
    return this.request(`/news/${newsId}/comments`);
  }

  async createNewsComment(newsId: string, content: string): Promise<any> {
    return this.request(`/news/${newsId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }
}

// Function to map backend news to frontend news model
export const mapBackendNewsToFrontend = (backendNews: BackendNews): News => {
  return {
    id: backendNews.id,
    title: backendNews.title,
    excerpt: backendNews.excerpt,
    content: backendNews.content,
    cover: backendNews.cover || "/placeholder.svg",
    author: {
      id: backendNews.author?.id || backendNews.authorId,
      name: backendNews.author?.name || "Unknown Author",
      avatar: backendNews.author?.avatar,
    },
    date: backendNews.publishedAt || backendNews.createdAt,
    category: backendNews.category,
    views: backendNews.views,
    featured: backendNews.featured,
    likes: backendNews.likes,
    commentsCount: backendNews._count?.comments,
    tags: backendNews.tags,
    status: backendNews.status,
  };
};

const newsApi = new NewsApi();
export default newsApi;
