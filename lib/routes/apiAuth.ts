import ApiClientBase from "@/lib/routes/apiBash";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

// apiAuth.ts:
// - Tạo class ApiAuthClient kế thừa từ ApiClientBase
// - Tạo phương thức login
// - Tạo phương thức register
// - Tạo phương thức getProfile


class ApiAuthClient extends ApiClientBase {

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

  
}

export const apiAuthClient = new ApiAuthClient(API_BASE_URL);
