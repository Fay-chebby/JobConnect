export interface AppUser {
  id: string;
  role: "job-seeker" | "employer" | "admin";
  firstName?: string;
  lastName?: string;
  companyName?: string;
  email: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
