import { eventsApi } from "../api/endpoints";
import { Event, EventRegistration, CreateEventRequest, UpdateEventRequest } from "../types";

export class EventService {
  static async getAllEvents(params?: any): Promise<Event[]> {
    try {
      return await eventsApi.getAll(params);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      throw error;
    }
  }

  static async getEventById(id: string): Promise<Event> {
    try {
      return await eventsApi.getById(id);
    } catch (error) {
      console.error(`Failed to fetch event ${id}:`, error);
      throw error;
    }
  }

  static async getEventBySlug(slug: string): Promise<Event> {
    try {
      return await eventsApi.getBySlug(slug);
    } catch (error) {
      console.error(`Failed to fetch event by slug ${slug}:`, error);
      throw error;
    }
  }

  static async createEvent(data: CreateEventRequest): Promise<Event> {
    try {
      return await eventsApi.create(data);
    } catch (error) {
      console.error("Failed to create event:", error);
      throw error;
    }
  }

  static async updateEvent(id: string, data: UpdateEventRequest): Promise<Event> {
    try {
      return await eventsApi.update(id, data);
    } catch (error) {
      console.error(`Failed to update event ${id}:`, error);
      throw error;
    }
  }

  static async deleteEvent(id: string): Promise<void> {
    try {
      await eventsApi.delete(id);
    } catch (error) {
      console.error(`Failed to delete event ${id}:`, error);
      throw error;
    }
  }

  static async registerForEvent(eventId: string, registrationData: any): Promise<EventRegistration> {
    try {
      return await eventsApi.register(eventId, registrationData);
    } catch (error) {
      console.error(`Failed to register for event ${eventId}:`, error);
      throw error;
    }
  }

  static async getFeaturedEvents(limit: number = 3): Promise<Event[]> {
    try {
      return await eventsApi.getFeatured(limit);
    } catch (error) {
      console.error("Failed to fetch featured events:", error);
      throw error;
    }
  }

  static async getUpcomingEvents(limit?: number): Promise<Event[]> {
    try {
      return await eventsApi.getUpcoming(limit);
    } catch (error) {
      console.error("Failed to fetch upcoming events:", error);
      throw error;
    }
  }
}