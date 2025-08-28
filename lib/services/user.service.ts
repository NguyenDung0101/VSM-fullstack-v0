import { usersApi } from "../api/endpoints";
import { User, UpdateUserRequest, UserQuery } from "../types";

export class UserService {
  static async getAllUsers(params?: UserQuery): Promise<User[]> {
    try {
      return await usersApi.getAll(params);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      throw error;
    }
  }

  static async getUserById(id: string): Promise<User> {
    try {
      return await usersApi.getById(id);
    } catch (error) {
      console.error(`Failed to fetch user ${id}:`, error);
      throw error;
    }
  }

  static async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    try {
      return await usersApi.update(id, data);
    } catch (error) {
      console.error(`Failed to update user ${id}:`, error);
      throw error;
    }
  }

  static async deleteUser(id: string): Promise<void> {
    try {
      await usersApi.delete(id);
    } catch (error) {
      console.error(`Failed to delete user ${id}:`, error);
      throw error;
    }
  }

  static async activateUser(id: string): Promise<User> {
    try {
      return await usersApi.activate(id);
    } catch (error) {
      console.error(`Failed to activate user ${id}:`, error);
      throw error;
    }
  }

  static async deactivateUser(id: string): Promise<User> {
    try {
      return await usersApi.deactivate(id);
    } catch (error) {
      console.error(`Failed to deactivate user ${id}:`, error);
      throw error;
    }
  }

  static async changeUserRole(id: string, role: string): Promise<User> {
    try {
      return await usersApi.changeRole(id, role);
    } catch (error) {
      console.error(`Failed to change role for user ${id}:`, error);
      throw error;
    }
  }
} 