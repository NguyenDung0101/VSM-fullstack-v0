import ApiClientBase from './base';


export interface Homepage {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  sections?: HomepageSection[];
}

export interface HomepageSection {
  id: string;
  name?: string;
  component?: string;
  enabled: boolean;
  order: number;
  type: string;
  homepageId: string;
  authorId?: string;
  sectionData?: any;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHomepageDto {
  name: string;
}

export interface UpdateHomepageDto {
  name?: string;
}

class HomepagesApi extends ApiClientBase {
  /**
   * Get all homepages
   */
  async getHomepages(): Promise<Homepage[]> {
    try {
      return await this.request('/homepages');
    } catch (error) {
      console.error('Failed to fetch homepages:', error);
      throw new Error('Không thể tải danh sách trang chủ');
    }
  }

  /**
   * Get default homepage
   */
  async getDefaultHomepage(): Promise<Homepage> {
    try {
      return await this.request('/homepages/default');
    } catch (error) {
      console.error('Failed to fetch default homepage:', error);
      throw new Error('Không thể tải trang chủ mặc định');
    }
  }

  /**
   * Get homepage by ID
   */
  async getHomepage(id: string): Promise<Homepage> {
    try {
      return await this.request(`/homepages/${id}`);
    } catch (error) {
      console.error('Failed to fetch homepage:', error);
      throw new Error('Không thể tải trang chủ');
    }
  }

  /**
   * Create a new homepage
   */
  async createHomepage(homepageData: CreateHomepageDto): Promise<Homepage> {
    try {
      return await this.request('/homepages', {
        method: 'POST',
        body: JSON.stringify(homepageData),
      });
    } catch (error) {
      console.error('Failed to create homepage:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Không thể tạo trang chủ mới');
    }
  }

  /**
   * Update an existing homepage
   */
  async updateHomepage(id: string, homepageData: UpdateHomepageDto): Promise<Homepage> {
    try {
      return await this.request(`/homepages/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(homepageData),
      });
    } catch (error) {
      console.error('Failed to update homepage:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Không thể cập nhật trang chủ');
    }
  }

  /**
   * Delete a homepage
   */
  async deleteHomepage(id: string): Promise<Homepage> {
    try {
      return await this.request(`/homepages/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Failed to delete homepage:', error);
      throw new Error('Không thể xóa trang chủ');
    }
  }
}

const homepagesApi = new HomepagesApi(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1");
export default homepagesApi;
