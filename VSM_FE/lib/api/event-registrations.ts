import ApiClientBase from './base';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export interface RegisterEventDto {
  fullName: string;
  email: string;
  phone: string;
  emergencyContact: string;
  medicalConditions?: string;
  experience: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
}

export interface EventRegistration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  emergencyContact: string;
  emergencyPhone?: string;
  medicalConditions?: string;
  experience: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  status: 'PENDING' | 'CONFIRMED' | 'WAITLIST' | 'CANCELLED';
  registeredAt: string;
  updatedAt: string;
  eventId: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface RegistrationStats {
  totalRegistrations: number;
  pendingRegistrations: number;
  confirmedRegistrations: number;
  waitlistRegistrations: number;
  cancelledRegistrations: number;
  registrationsByStatus: {
    status: string;
    count: number;
  }[];
  registrationsByEvent?: {
    eventId: string;
    eventName: string;
    count: number;
  }[];
}

class EventRegistrationsApi extends ApiClientBase {
  constructor() {
    super(API_BASE_URL);
  }

  // Register for an event
  async registerForEvent(eventId: string, registrationData: RegisterEventDto): Promise<EventRegistration> {
    try {
      return await this.request(`/event-registrations/events/${eventId}/register`, {
        method: 'POST',
        body: JSON.stringify(registrationData),
      });
    } catch (error) {
      console.error(`Error registering for event ${eventId}:`, error);
      throw new Error(`Không thể đăng ký sự kiện: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    }
  }

  // Get my registrations
  async getMyRegistrations(): Promise<EventRegistration[]> {
    try {
      return await this.request('/event-registrations/my-registrations');
    } catch (error) {
      console.error('Error fetching my registrations:', error);
      throw new Error(`Không thể tải danh sách đăng ký của bạn: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    }
  }

  // Get event registrations (Admin/Editor only)
  async getEventRegistrations(eventId: string): Promise<EventRegistration[]> {
    try {
      if (!eventId) {
        throw new Error('ID sự kiện không hợp lệ');
      }
      return await this.request(`/event-registrations/events/${eventId}`);
    } catch (error) {
      console.error(`Error fetching registrations for event ${eventId}:`, error);
      throw new Error(`Không thể tải danh sách đăng ký: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    }
  }

  // Update registration status (Admin/Editor only)
  async updateRegistrationStatus(registrationId: string, status: 'PENDING' | 'CONFIRMED' | 'WAITLIST' | 'CANCELLED'): Promise<EventRegistration> {
    try {
      if (!registrationId) {
        throw new Error('ID đăng ký không hợp lệ');
      }
      return await this.request(`/event-registrations/${registrationId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error(`Error updating registration status ${registrationId}:`, error);
      throw new Error(`Không thể cập nhật trạng thái đăng ký: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    }
  }

  // Cancel registration
  async cancelRegistration(registrationId: string): Promise<EventRegistration> {
    try {
      if (!registrationId) {
        throw new Error('ID đăng ký không hợp lệ');
      }
      return await this.request(`/event-registrations/${registrationId}/cancel`, {
        method: 'PATCH',
      });
    } catch (error) {
      console.error(`Error cancelling registration ${registrationId}:`, error);
      throw new Error(`Không thể hủy đăng ký: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    }
  }

  // Get registration statistics (Admin/Editor only)
  async getRegistrationStats(eventId?: string): Promise<RegistrationStats> {
    try {
      const queryParams = new URLSearchParams();
      if (eventId) {
        queryParams.append('eventId', eventId);
      }
      const queryString = queryParams.toString();
      const endpoint = `/event-registrations/stats${queryString ? `?${queryString}` : ''}`;
      
      return await this.request(endpoint);
    } catch (error) {
      console.error('Error fetching registration stats:', error);
      throw new Error(`Không thể tải thống kê đăng ký: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    }
  }
}

const eventRegistrationsApi = new EventRegistrationsApi();
export default eventRegistrationsApi;
