const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.updateToken();
    
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("vsm_token", token);
    }
  }

  private updateToken() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("vsm_token");
    }
  }

  removeToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("vsm_token");
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    this.updateToken();
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
};

if (this.token) {
  headers["Authorization"] = `Bearer ${this.token}`;
}

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "An error occurred" }));
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`,
      );
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string) {
    return this.request("/auth/register/self", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  }

  async getProfile() {
    return this.request("/auth/profile");
  }

  // Events endpoints
  async getEvents(params?: any) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return this.request(`/events${query}`);
  }

  async getEvent(id: string) {
    return this.request(`/events/${id}`);
  }

  async getEventBySlug(slug: string) {
    return this.request(`/events/slug/${slug}`);
  }

  async createEvent(data: any) {
    return this.request("/events", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateEvent(id: string, data: any) {
    return this.request(`/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteEvent(id: string) {
    return this.request(`/events/${id}`, {
      method: "DELETE",
    });
  }

  async getEventStats(params?: any) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return this.request(`/events/stats/overview${query}`);
  }

  async registerForEvent(eventId: string, data: any) {
    return this.request(`/events/${eventId}/register`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getEventRegistrations(eventId: string): Promise<Registration[]> {
    const event = await this.getEvent(eventId); // Lấy toàn bộ event
    return event.registrations; // Trả về mảng registrations từ event
  }

  async updateRegistrationStatus(
    eventId: string,
    registrationId: string,
    status: string,
  ) {
    return this.request(`/events/${eventId}/registrations/${registrationId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  // Posts endpoints
  async getPosts(params?: any) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return this.request(`/posts${query}`);
  }

  async getPost(id: string) {
    return this.request(`/posts/${id}`);
  }

  async createPost(data: any) {
    return this.request("/posts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updatePost(id: string, data: any) {
    return this.request(`/posts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deletePost(id: string) {
    return this.request(`/posts/${id}`, {
      method: "DELETE",
    });
  }

  // Comments endpoints
  async getPostComments(postId: string) {
    return this.request(`/posts/${postId}/comments`);
  }

  async createComment(postId: string, content: string) {
    return this.request(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });
  }

  async getComments() {
    return this.request("/comments");
  }

  async updateCommentStatus(commentId: string, status: string) {
    return this.request(`/comments/${commentId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  // Products endpoints
  async getProducts(params?: any) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return this.request(`/products${query}`);
  }

  async getProduct(id: string) {
    return this.request(`/products/${id}`);
  }

  // Users endpoints
  async getUsers(params?: any) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return this.request(`/users${query}`);
  }

  async getUser(id: string) {
    return this.request(`/users/${id}`);
  }

  // Upload endpoints
  async uploadFile(file: File, folder?: string) {
    const formData = new FormData();
    formData.append("file", file);
    if (folder) {
      formData.append("folder", folder);
    }

    const headers: HeadersInit = {};
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}/uploads`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Upload failed" }));
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`,
      );
    }

    return response.json();
  }

  async getUploads(params?: any) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return this.request(`/uploads${query}`);
  }

  async deleteUpload(id: string) {
    return this.request(`/uploads/${id}`, {
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
