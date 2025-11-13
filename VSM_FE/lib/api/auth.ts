//     base.ts         // Chứa logic cơ bản của ApiClient
//     auth.ts         // Chứa các phương thức auth
//     events.ts       // Chứa các phương thức events
//     posts.ts        // Chứa các phương thức posts
//     comments.ts     // Chứa các phương thức comments
//     products.ts     // Chứa các phương thức products
//     users.ts        // Chứa các phương thức users
//     uploads.ts      // Chứa các phương thức uploads
//     index.ts        // Xuất tất cả các module

import ApiClientBase from "./base";
import { API_BASE_URL } from "./config";

class AuthApiClient extends ApiClientBase {
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

export const authApi = new AuthApiClient(API_BASE_URL);