export type UserRole = "job-seeker" | "employer" | "admin";

export interface User {
  id: string;
  email: string;
  password: string; // This would be hashed in a real backend
  role: UserRole;
  createdAt: string;
}

export interface JobSeeker extends User {
  role: "job-seeker";
  firstName: string;
  lastName: string;
  bio?: string;
  skills: string[];
  education: Education[];
  workHistory: WorkExperience[];
  resume?: string; // Base64 encoded file
  contactInfo: {
    phone?: string;
    address?: string;
    website?: string;
  };
}

export interface Employer extends User {
  role: "employer";
  companyName: string;
  industry: string;
  description?: string;
  logo?: string; // URL or Base64
  website?: string;
  location?: string;
  size?: string; // e.g. "1-10", "11-50", etc.
}

export interface Admin extends User {
  role: "admin";
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Job {
  id: string;
  employerId: string;
  companyName: string;
  title: string;
  description: string;
  location: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  type: "full-time" | "part-time" | "contract" | "internship" | "remote";
  category: string;
  deadline: string;
  createdAt: string;
  updatedAt: string;
  status: "active" | "closed";
  skills?: string[];
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobSeekerId: string;
  resume: string; // Base64 encoded file
  coverLetter?: string;
  status: "pending" | "reviewed" | "shortlisted" | "rejected" | "hired";
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: "application" | "status" | "message" | "system";
  relatedId?: string; // Could be jobId, applicationId, etc.
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  read: boolean;
  createdAt: string;
}
