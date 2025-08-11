import ApiClientBase from './base';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

// Backend Event interface matching the Prisma schema
export interface BackendEvent {
  id: string;
  name: string;
  description: string;
  content: string;
  date: string;
  location: string;
  imageEvent?: string;
  maxParticipants: number;
  currentParticipants: number;
  category: 'MARATHON' | 'HALF_MARATHON' | 'FIVE_K' | 'TEN_K' | 'FUN_RUN' | 'TRAIL_RUN' | 'NIGHT_RUN';
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  distance?: string;
  registrationFee?: number;
  requirements?: string;
  published: boolean;
  featured: boolean;
  registrationDeadline?: string;
  organizer?: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author?: {
    id: string;
    name: string;
    email?: string;
  };
  _count?: {
    registrations: number;
  };
}

// Frontend Event interface for the UI
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  participants: number;
  maxParticipants: number;
  image: string;
  status: "upcoming" | "ongoing" | "completed";
  category: "marathon" | "fun-run" | "trail-run";
  distance: string;
  registrationFee?: number;
  requirements?: string;
  featured: boolean;
  registrationDeadline?: string;
  organizer?: string;
}

export interface EventsResponse {
  data: BackendEvent[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface EventFilters {
  category?: string;
  status?: string;
  featured?: string;
  search?: string;
  upcoming?: string;
  limit?: number;
  page?: number;
}

export interface CreateEventDto {
  name: string;
  description: string;
  content: string;
  date: string;
  location: string;
  maxParticipants: number;
  category: string;
  status?: string;
  distance?: string;
  registrationFee?: number;
  requirements?: string;
  published?: boolean;
  featured?: boolean;
  registrationDeadline?: string;
  organizer?: string;
}

export interface UpdateEventDto extends Partial<CreateEventDto> {}

export interface EventStatsResponse {
  totalEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  totalRegistrations: number;
  registrationsByStatus: {
    status: string;
    count: number;
  }[];
  eventsByCategory: {
    category: string;
    count: number;
  }[];
  recentEvents: BackendEvent[];
}

class EventsApi extends ApiClientBase {
  constructor() {
    super(API_BASE_URL);
  }

  // Public API methods with improved error handling
  async getEvents(filters: EventFilters = {}): Promise<EventsResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.featured) queryParams.append('featured', filters.featured);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.upcoming) queryParams.append('upcoming', filters.upcoming);
      if (filters.limit) queryParams.append('limit', filters.limit.toString());
      if (filters.page) queryParams.append('page', filters.page.toString());

      const queryString = queryParams.toString();
      const endpoint = `/events/${queryString ? `?${queryString}` : ''}`;
      
      return await this.request(endpoint);
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new Error(`Không thể tải danh sách sự kiện: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    }
  }

  async getEvent(id: string): Promise<BackendEvent> {
    try {
      if (!id) {
        throw new Error('ID sự kiện không hợp lệ');
      }
      return await this.request(`/events/${id}`);
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error);
      throw new Error(`Không thể tải thông tin sự kiện: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    }
  }

  // Admin API methods with improved error handling
  async getAdminEvents(filters: EventFilters = {}): Promise<EventsResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.limit) queryParams.append('limit', filters.limit.toString());
      if (filters.page) queryParams.append('page', filters.page.toString());

      const queryString = queryParams.toString();
      const endpoint = `/events/admin${queryString ? `?${queryString}` : ''}`;
      
      return await this.request(endpoint);
    } catch (error) {
      console.error('Error fetching admin events:', error);
      throw new Error(`Không thể tải danh sách sự kiện admin: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    }
  }

  async createEvent(data: CreateEventDto, image?: File): Promise<BackendEvent> {
    try {
      // Validate required fields
      if (!data.name?.trim()) {
        throw new Error('Tên sự kiện không được để trống');
      }
      if (!data.date) {
        throw new Error('Ngày tổ chức không được để trống');
      }
      if (!data.location?.trim()) {
        throw new Error('Địa điểm không được để trống');
      }
      if (!data.maxParticipants || data.maxParticipants < 1) {
        throw new Error('Số lượng tham gia phải lớn hơn 0');
      }

      if (!image) {
        return await this.request('/events', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      } else {
        // For multipart/form-data with file upload
        const formData = new FormData();
        
        // Add event data as JSON string
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
        
        const response = await fetch(`${this.baseURL}/events`, {
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
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error(`Không thể tạo sự kiện: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    }
  }

  async updateEvent(id: string, data: UpdateEventDto, image?: File): Promise<BackendEvent> {
    try {
      if (!id) {
        throw new Error('ID sự kiện không hợp lệ');
      }

      if (!image) {
        return await this.request(`/events/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        });
      } else {
        // For multipart/form-data with file upload
        const formData = new FormData();
        
        // Add event data
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
        
        const response = await fetch(`${this.baseURL}/events/${id}`, {
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
    } catch (error) {
      console.error(`Error updating event ${id}:`, error);
      throw new Error(`Không thể cập nhật sự kiện: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    }
  }

  async deleteEvent(id: string): Promise<void> {
    try {
      if (!id) {
        throw new Error('ID sự kiện không hợp lệ');
      }
      await this.request(`/events/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(`Error deleting event ${id}:`, error);
      throw new Error(`Không thể xóa sự kiện: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    }
  }

  async getEventStats(filters: Partial<EventFilters> = {}): Promise<EventStatsResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.search) queryParams.append('search', filters.search);
      
      const queryString = queryParams.toString();
      const endpoint = `/events/stats/overview${queryString ? `?${queryString}` : ''}`;
      
      return await this.request(endpoint);
    } catch (error) {
      console.error('Error fetching event stats:', error);
      throw new Error(`Không thể tải thống kê sự kiện: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    }
  }

  // Event registration methods with improved error handling
  async registerForEvent(eventId: string, registrationData: any): Promise<any> {
    try {
      if (!eventId) {
        throw new Error('ID sự kiện không hợp lệ');
      }
      return await this.request(`/events/${eventId}/register`, {
        method: 'POST',
        body: JSON.stringify(registrationData),
      });
    } catch (error) {
      console.error(`Error registering for event ${eventId}:`, error);
      throw new Error(`Không thể đăng ký sự kiện: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    }
  }

  async getEventRegistrations(eventId: string): Promise<any[]> {
    try {
      if (!eventId) {
        throw new Error('ID sự kiện không hợp lệ');
      }
      return await this.request(`/events/${eventId}/registrations`);
    } catch (error) {
      console.error(`Error fetching event registrations ${eventId}:`, error);
      throw new Error(`Không thể tải danh sách đăng ký: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    }
  }

  async updateRegistrationStatus(eventId: string, registrationId: string, status: string): Promise<any> {
    try {
      if (!eventId || !registrationId) {
        throw new Error('ID không hợp lệ');
      }
      return await this.request(`/events/${eventId}/registrations/${registrationId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error(`Error updating registration status:`, error);
      throw new Error(`Không thể cập nhật trạng thái đăng ký: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    }
  }

  // Additional utility methods
  async checkEventAvailability(eventId: string): Promise<{ available: boolean; remainingSpots: number }> {
    try {
      if (!eventId) {
        throw new Error('ID sự kiện không hợp lệ');
      }
      return await this.request(`/events/${eventId}/availability`);
    } catch (error) {
      console.error(`Error checking event availability ${eventId}:`, error);
      throw new Error(`Không thể kiểm tra tình trạng sự kiện: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    }
  }

  async getEventBySlug(slug: string): Promise<BackendEvent> {
    try {
      if (!slug) {
        throw new Error('Slug sự kiện không hợp lệ');
      }
      return await this.request(`/events/slug/${slug}`);
    } catch (error) {
      console.error(`Error fetching event by slug ${slug}:`, error);
      throw new Error(`Không thể tải sự kiện: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    }
  }
}

// Function to map backend event to frontend event model
export const mapBackendEventToFrontend = (backendEvent: BackendEvent): Event => {
  // Map backend event category to frontend category
  const categoryMap: Record<string, string> = {
    MARATHON: "marathon",
    HALF_MARATHON: "marathon",
    FIVE_K: "fun-run",
    TEN_K: "fun-run",
    FUN_RUN: "fun-run",
    TRAIL_RUN: "trail-run",
    NIGHT_RUN: "trail-run",
  };

  // Map backend event status to frontend status
  const statusMap: Record<string, string> = {
    UPCOMING: "upcoming",
    ONGOING: "ongoing",
    COMPLETED: "completed",
    CANCELLED: "completed",
  };

  // Extract distance from category if not provided
  let distance = backendEvent.distance || "";
  if (!distance) {
    switch (backendEvent.category) {
      case "MARATHON":
        distance = "42.2km";
        break;
      case "HALF_MARATHON":
        distance = "21.1km";
        break;
      case "FIVE_K":
        distance = "5km";
        break;
      case "TEN_K":
        distance = "10km";
        break;
      default:
        distance = "";
    }
  }

  return {
    id: backendEvent.id,
    title: backendEvent.name,
    description: backendEvent.description,
    date: backendEvent.date,
    location: backendEvent.location,
    participants: backendEvent.currentParticipants,
    maxParticipants: backendEvent.maxParticipants,
    image: backendEvent.imageEvent || "/placeholder.svg",
    status: statusMap[backendEvent.status] as "upcoming" | "ongoing" | "completed",
    category: categoryMap[backendEvent.category] as "marathon" | "fun-run" | "trail-run",
    distance: distance,
    registrationFee: backendEvent.registrationFee,
    requirements: backendEvent.requirements,
    featured: backendEvent.featured,
    registrationDeadline: backendEvent.registrationDeadline,
    organizer: backendEvent.organizer,
  };
};

const eventsApi = new EventsApi();
export default eventsApi;
