export interface Event {
  id: string;
  name: string;
  description: string;
  content: string;
  date: string;
  location: string;
  image: string;
  maxParticipants: number;
  currentParticipants: number;
  registeredUsers: string[];
  category:
    | "marathon"
    | "half-marathon"
    | "5k"
    | "10k"
    | "fun-run"
    | "trail-run"
    | "night-run";
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  distance?: string;
  registrationFee?: number;
  requirements?: string;
  published: boolean;
  authorId: string;
  createdAt: string;
  registrationDeadline?: string;
  organizer?: string;
  featured?: boolean;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  phone: string;
  emergencyContact: string;
  medicalConditions?: string;
  experience: "beginner" | "intermediate" | "advanced";
  createdAt: string;
  status: "pending" | "confirmed" | "cancelled";
}

export interface CreateEventRequest {
  name: string;
  description: string;
  content: string;
  date: string;
  location: string;
  image: string;
  maxParticipants: number;
  category: Event["category"];
  distance?: string;
  registrationFee?: number;
  requirements?: string;
  organizer?: string;
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  published?: boolean;
  featured?: boolean;
}