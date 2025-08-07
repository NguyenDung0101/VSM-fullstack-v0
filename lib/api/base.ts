const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

class ApiClientBase {
  protected baseURL: string;
  protected token: string | null = null;

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

  protected updateToken() {
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

  protected async request(endpoint: string, options: RequestInit = {}) {
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
}

export default ApiClientBase;