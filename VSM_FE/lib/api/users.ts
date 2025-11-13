import ApiClientBase from './base';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'USER' | 'EDITOR' | 'ADMIN';
  isActive: boolean;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  editorUsers: number;
  userUsers: number;
  newUsersThisMonth: number;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role?: 'USER' | 'EDITOR' | 'ADMIN';
  isActive?: boolean;
  phone?: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  avatar?: string;
  phone?: string;
  role?: 'USER' | 'EDITOR' | 'ADMIN';
  isActive?: boolean;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

class UsersApi extends ApiClientBase {
  /**
   * Get all users (requires authentication)
   */
  async getUsers(): Promise<User[]> {
    try {
      return await this.request('/users');
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw new Error('Không thể tải danh sách người dùng');
    }
  }

  /**
   * Get all users for admin management (admin only)
   */
  async getUsersForAdmin(filters?: {
    role?: string;
    isActive?: string;
    keyword?: string;
  }): Promise<User[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.role) params.append('role', filters.role);
      if (filters?.isActive) params.append('isActive', filters.isActive);
      if (filters?.keyword) params.append('keyword', filters.keyword);
      
      const queryString = params.toString();
      const url = queryString ? `/users/admin/all?${queryString}` : '/users/admin/all';
      
      return await this.request(url);
    } catch (error) {
      console.error('Failed to fetch users for admin:', error);
      throw new Error('Không thể tải danh sách người dùng');
    }
  }

  /**
   * Get user statistics (admin only)
   */
  async getUserStats(): Promise<UserStats> {
    try {
      return await this.request('/users/admin/stats');
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      throw new Error('Không thể tải thống kê người dùng');
    }
  }

  /**
   * Get user by ID
   */
  async getUser(id: string): Promise<User> {
    try {
      return await this.request(`/users/${id}`);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw new Error('Không thể tải thông tin người dùng');
    }
  }

  /**
   * Create a new user (admin only)
   */
  async createUser(userData: CreateUserDto): Promise<User> {
    try {
      return await this.request('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    } catch (error) {
      console.error('Failed to create user:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Không thể tạo người dùng mới');
    }
  }

  /**
   * Update user information
   */
  async updateUser(id: string, userData: UpdateUserDto): Promise<User> {
    try {
      return await this.request(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(userData),
      });
    } catch (error) {
      console.error('Failed to update user:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Không thể cập nhật thông tin người dùng');
    }
  }

  /**
   * Update user role (admin only)
   */
  async updateUserRole(id: string, role: 'USER' | 'EDITOR' | 'ADMIN'): Promise<User> {
    try {
      return await this.request(`/users/${id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      });
    } catch (error) {
      console.error('Failed to update user role:', error);
      throw new Error('Không thể cập nhật vai trò người dùng');
    }
  }

  /**
   * Toggle user active status (admin only)
   */
  async toggleUserStatus(id: string): Promise<User> {
    try {
      return await this.request(`/users/${id}/toggle-status`, {
        method: 'PATCH',
      });
    } catch (error) {
      console.error('Failed to toggle user status:', error);
      throw new Error('Không thể thay đổi trạng thái người dùng');
    }
  }

  /**
   * Delete user (admin only)
   */
  async deleteUser(id: string): Promise<{ message: string }> {
    try {
      return await this.request(`/users/admin/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw new Error('Không thể xóa người dùng');
    }
  }

  /**
   * Upload user avatar
   */
  async uploadAvatar(userId: string, file: File): Promise<{ message: string; avatarUrl: string }> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      return await this.request(`/users/${userId}/avatar`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let the browser set it for FormData
        headers: {},
      });
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      throw new Error('Không thể tải lên ảnh đại diện');
    }
  }

  /**
   * Helper method to validate admin permissions on frontend
   */
  static requiresAdminRole(userRole?: string): boolean {
    return userRole === 'ADMIN';
  }

  /**
   * Helper method to check if user can edit another user
   */
  static canEditUser(currentUserRole?: string, currentUserId?: string, targetUserId?: string): boolean {
    // Admin can edit anyone
    if (currentUserRole === 'ADMIN') {
      return true;
    }
    // Users can only edit themselves
    return currentUserId === targetUserId;
  }
}

const usersApi = new UsersApi(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1");
export default usersApi;
