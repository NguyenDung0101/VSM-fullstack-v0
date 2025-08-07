import ApiClientBase from './base';

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

export interface CreateSectionDto {
  name?: string;
  component?: string;
  enabled: boolean;
  order: number;
  authorId?: string;
  type: string;
  homepageId?: string;
  sectionData?: any;
}

export interface UpdateSectionDto {
  name?: string;
  component?: string;
  enabled?: boolean;
  order?: number;
  sectionData?: any;
}

export interface SectionOrderItem {
  id: string;
  order: number;
}

class HomepageSectionsApi extends ApiClientBase {
  /**
   * Get all homepage sections
   */
  async getAllSections(): Promise<HomepageSection[]> {
    try {
      return await this.request('/homepage-sections');
    } catch (error) {
      console.error('Failed to fetch homepage sections:', error);
      throw new Error('Không thể tải danh sách sections');
    }
  }

  /**
   * Get sections by type
   */
  async getSectionsByType(type: string): Promise<HomepageSection[]> {
    try {
      return await this.request(`/homepage-sections/types/${type}`);
    } catch (error) {
      console.error('Failed to fetch sections by type:', error);
      throw new Error('Không thể tải sections theo loại');
    }
  }

  /**
   * Get hero section
   */
  async getHeroSection(): Promise<HomepageSection | null> {
    try {
      return await this.request('/homepage-sections/hero');
    } catch (error) {
      console.error('Failed to fetch hero section:', error);
      throw new Error('Không thể tải phần hero');
    }
  }

  /**
   * Create a new section
   */
  async createSection(sectionData: CreateSectionDto): Promise<HomepageSection> {
    try {
      return await this.request('/homepage-sections', {
        method: 'POST',
        body: JSON.stringify(sectionData),
      });
    } catch (error) {
      console.error('Failed to create section:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Không thể tạo section mới');
    }
  }

  /**
   * Update an existing section
   */
  async updateSection(id: string, sectionData: UpdateSectionDto): Promise<HomepageSection> {
    try {
      return await this.request(`/homepage-sections/${id}`, {
        method: 'PUT',
        body: JSON.stringify(sectionData),
      });
    } catch (error) {
      console.error('Failed to update section:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Không thể cập nhật section');
    }
  }

  /**
   * Update hero section
   */
  async updateHeroSection(sectionData: any): Promise<HomepageSection | null> {
    try {
      return await this.request('/homepage-sections/hero', {
        method: 'PUT',
        body: JSON.stringify(sectionData),
      });
    } catch (error) {
      console.error('Failed to update hero section:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Không thể cập nhật phần hero');
    }
  }

  /**
   * Delete a section
   */
  async deleteSection(id: string): Promise<HomepageSection> {
    try {
      return await this.request(`/homepage-sections/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Failed to delete section:', error);
      throw new Error('Không thể xóa section');
    }
  }

  /**
   * Reorder sections
   */
  async reorderSections(sections: SectionOrderItem[]): Promise<void> {
    try {
      await this.request('/homepage-sections/reorder', {
        method: 'POST',
        body: JSON.stringify({ sections }),
      });
    } catch (error) {
      console.error('Failed to reorder sections:', error);
      throw new Error('Không thể sắp xếp lại thứ tự sections');
    }
  }

  /**
   * Upload hero image for a section
   */
  async uploadHeroImage(id: string, file: File): Promise<HomepageSection> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      return await this.request(`/homepage-sections/${id}/upload-hero-image`, {
        method: 'POST',
        body: formData,
        headers: {},
      });
    } catch (error) {
      console.error('Failed to upload hero image:', error);
      throw new Error('Không thể tải lên ảnh hero');
    }
  }

  /**
   * Upload story image for a section
   */
  async uploadStoryImage(id: string, file: File): Promise<HomepageSection> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      return await this.request(`/homepage-sections/${id}/upload-story-image`, {
        method: 'POST',
        body: formData,
        headers: {},
      });
    } catch (error) {
      console.error('Failed to upload story image:', error);
      throw new Error('Không thể tải lên ảnh story');
    }
  }
}

const homepageSectionsApi = new HomepageSectionsApi(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1");
export default homepageSectionsApi;
