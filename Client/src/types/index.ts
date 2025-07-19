// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "jobSeeker" | "employer";
  createdAt: string;
}

export interface JobSeekerProfile {
  _id: string;
  user: string;
  resume?: string;
  skills: string[];
  education: Education[];
  experience: Experience[];
  bio?: string;
  location?: string;
  website?: string;
  createdAt: string;
}

export interface EmployerProfile {
  _id: string;
  user: string;
  companyName: string;
  industry: string;
  description: string;
  website?: string;
  location: string;
  logo?: string;
  companySize: string;
  createdAt: string;
}

export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  fromDate: string;
  toDate?: string;
  current: boolean;
  description?: string;
}

export interface Experience {
  company: string;
  title: string;
  location?: string;
  fromDate: string;
  toDate?: string;
  current: boolean;
  description?: string;
}

// Job related types
export interface Job {
  _id: string;
  title: string;
  description: string;
  employer: EmployerProfile;
  location: string;
  jobType: "Full-time" | "Part-time" | "Contract" | "Internship" | "Temporary";
  experienceLevel:
    | "Entry"
    | "Associate"
    | "Mid-Senior"
    | "Director"
    | "Executive";
  salary?: {
    min?: number;
    max?: number;
    currency: string;
    period: "hourly" | "monthly" | "yearly";
  };
  skills: string[];
  responsibilities: string[];
  qualifications: string[];
  benefits: string[];
  applicationDeadline?: string;
  status: "open" | "closed" | "draft";
  createdAt: string;
  applications?: Application[];
}

export interface Application {
  _id: string;
  job: Job;
  jobSeeker: JobSeekerProfile;
  coverLetter?: string;
  resume: string;
  status: "pending" | "reviewed" | "interviewed" | "offered" | "rejected";
  appliedDate: string;
  updatedAt: string;
}

// Stats types
export interface JobSeekerStats {
  totalApplications: number;
  pendingApplications: number;
  interviewedApplications: number;
}

export interface EmployerStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
}

export type Stats = JobSeekerStats | EmployerStats;

// Form data types
export interface ProfileUpdateData {
  [key: string]: string | string[] | boolean;
}
