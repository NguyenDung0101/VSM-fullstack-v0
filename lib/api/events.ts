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

  // Public API methods
  async getEvents(filters: EventFilters = {}): Promise<EventsResponse> {
    const queryParams = new URLSearchParams();
    
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.featured) queryParams.append('featured', filters.featured);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.upcoming) queryParams.append('upcoming', filters.upcoming);
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.page) queryParams.append('page', filters.page.toString());

    const queryString = queryParams.toString();
    const endpoint = `/events/admin${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  async getEvent(id: string): Promise<BackendEvent> {
    return this.request(`/events/${id}`);
  }

  // Admin API methods
  async getAdminEvents(filters: EventFilters = {}): Promise<EventsResponse> {
    const queryParams = new URLSearchParams();
    
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.page) queryParams.append('page', filters.page.toString());

    const queryString = queryParams.toString();
    const endpoint = `/events/admin${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  async createEvent(data: CreateEventDto, image?: File): Promise<BackendEvent> {
    if (!image) {
      return this.request('/events', {
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
  }

  async updateEvent(id: string, data: UpdateEventDto, image?: File): Promise<BackendEvent> {
    if (!image) {
      return this.request(`/events/${id}`, {
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
  }

  async deleteEvent(id: string): Promise<void> {
    return this.request(`/events/${id}`, {
      method: 'DELETE',
    });
  }

  async getEventStats(filters: Partial<EventFilters> = {}): Promise<EventStatsResponse> {
    const queryParams = new URLSearchParams();
    
    if (filters.search) queryParams.append('search', filters.search);
    
    const queryString = queryParams.toString();
    const endpoint = `/events/stats/overview${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }
}

const eventsApi = new EventsApi();
export default eventsApi;
