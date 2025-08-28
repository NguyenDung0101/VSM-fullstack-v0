import { authApi } from "../api/endpoints";
import { User, LoginRequest, RegisterRequest } from "../types";

export class AuthService {
  static async login(credentials: LoginRequest) {
    try {
      const response = await authApi.login(credentials);
      authApi.logout(); // Clear any existing token
      return response;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  static async register(userData: RegisterRequest) {
    try {
      const response = await authApi.register(userData);
      return response;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  }

  static async getProfile(): Promise<User> {
    try {
      return await authApi.getProfile();
    } catch (error) {
      console.error("Failed to get profile:", error);
      throw error;
    }
  }

  static async logout() {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  static async refreshToken() {
    try {
      const response = await authApi.refreshToken();
      return response;
    } catch (error) {
      console.error("Token refresh failed:", error);
      throw error;
    }
  }
}