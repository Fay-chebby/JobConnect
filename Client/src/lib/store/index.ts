import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  User,
  UserRole,
  JobSeeker,
  Employer,
  Job,
  JobApplication,
  Notification,
} from "../types";
import { v4 as uuidv4 } from "uuid";

interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  register: (user: Partial<User>) => Promise<User | null>;

  // Users
  users: User[];
  jobSeekers: JobSeeker[];
  employers: Employer[];
  addUser: (user: User) => void;
  updateUser: (userId: string, userData: Partial<User>) => void;
  getUserById: (userId: string) => User | undefined;

  // Jobs
  jobs: Job[];
  addJob: (job: Partial<Job>) => Job;
  updateJob: (jobId: string, jobData: Partial<Job>) => void;
  deleteJob: (jobId: string) => void;
  getJobById: (jobId: string) => Job | undefined;
  getJobsByEmployerId: (employerId: string) => Job[];

  // Applications
  applications: JobApplication[];
  addApplication: (application: Partial<JobApplication>) => JobApplication;
  updateApplication: (
    applicationId: string,
    applicationData: Partial<JobApplication>
  ) => void;
  getApplicationById: (applicationId: string) => JobApplication | undefined;
  getApplicationsByJobId: (jobId: string) => JobApplication[];
  getApplicationsByJobSeekerId: (jobSeekerId: string) => JobApplication[];

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Partial<Notification>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  getNotificationsByUserId: (userId: string) => Notification[];
}

// Function to generate mock data if none exists
const generateMockData = () => {
  const users: User[] = [];
  const jobSeekers: JobSeeker[] = [];
  const employers: Employer[] = [];
  const jobs: Job[] = [];
  const applications: JobApplication[] = [];
  const notifications: Notification[] = [];

  // Create sample employer
  const employer: Employer = {
    id: uuidv4(),
    email: "employer@example.com",
    password: "password123", // In real app, this would be hashed
    role: "employer",
    createdAt: new Date().toISOString(),
    companyName: "Tech Solutions Inc.",
    industry: "Technology",
    description: "Leading technology solutions provider",
    website: "https://techsolutions.example.com",
    location: "New York, NY",
    size: "51-200",
  };

  users.push(employer);
  employers.push(employer);

  // Create sample job seeker
  const jobSeeker: JobSeeker = {
    id: uuidv4(),
    email: "jobseeker@example.com",
    password: "password123", // In real app, this would be hashed
    role: "job-seeker",
    createdAt: new Date().toISOString(),
    firstName: "John",
    lastName: "Doe",
    bio: "Experienced software developer with 5 years of experience",
    skills: ["JavaScript", "React", "Node.js", "TypeScript"],
    education: [
      {
        id: uuidv4(),
        institution: "University of Technology",
        degree: "Bachelor of Science",
        field: "Computer Science",
        startDate: "2015-09-01",
        endDate: "2019-06-30",
        current: false,
        description: "Graduated with honors",
      },
    ],
    workHistory: [
      {
        id: uuidv4(),
        company: "Previous Tech Co.",
        position: "Software Developer",
        startDate: "2019-07-15",
        endDate: "2022-12-31",
        current: false,
        description: "Developed web applications using React and Node.js",
      },
    ],
    contactInfo: {
      phone: "555-123-4567",
      address: "Boston, MA",
      website: "https://johndoe.example.com",
    },
  };

  users.push(jobSeeker);
  jobSeekers.push(jobSeeker);

  // Create sample admin user
  const admin: User = {
    id: uuidv4(),
    email: "admin@example.com",
    password: "admin123", // In real app, this would be hashed
    role: "admin",
    createdAt: new Date().toISOString(),
  };

  users.push(admin);

  // Create sample jobs
  const sampleJobs = [
    {
      title: "Frontend Developer",
      description:
        "We are looking for a skilled Frontend Developer to join our team. The ideal candidate has experience with React and TypeScript.",
      location: "New York, NY",
      type: "full-time",
      category: "Development",
      skills: ["React", "TypeScript", "CSS", "HTML"],
    },
    {
      title: "Backend Developer",
      description:
        "Seeking an experienced Backend Developer proficient in Node.js and databases. Experience with AWS is a plus.",
      location: "Remote",
      type: "full-time",
      category: "Development",
      skills: ["Node.js", "Express", "MongoDB", "AWS"],
    },
    {
      title: "UX Designer",
      description:
        "Join our design team to create beautiful, intuitive interfaces. Experience with Figma required.",
      location: "San Francisco, CA",
      type: "full-time",
      category: "Design",
      skills: ["Figma", "UI Design", "User Research", "Prototyping"],
    },
  ];

  sampleJobs.forEach((jobData) => {
    const job: Job = {
      id: uuidv4(),
      employerId: employer.id,
      companyName: employer.companyName,
      title: jobData.title,
      description: jobData.description,
      location: jobData.location,
      salary: {
        min: 80000,
        max: 120000,
        currency: "USD",
      },
      type: jobData.type as "full-time",
      category: jobData.category,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "active",
      skills: jobData.skills,
    };

    jobs.push(job);

    // Create a sample application for the first job
    if (jobData.title === "Frontend Developer") {
      const application: JobApplication = {
        id: uuidv4(),
        jobId: job.id,
        jobSeekerId: jobSeeker.id,
        resume: "base64encodedstring", // This would be a real base64 encoded file
        coverLetter:
          "I am very interested in this position and believe my skills match your requirements.",
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      applications.push(application);

      // Create a notification for the employer
      const notification: Notification = {
        id: uuidv4(),
        userId: employer.id,
        title: "New Application",
        message: `${jobSeeker.firstName} ${jobSeeker.lastName} has applied for the Frontend Developer position.`,
        read: false,
        createdAt: new Date().toISOString(),
        type: "application",
        relatedId: application.id,
      };

      notifications.push(notification);
    }
  });

  return { users, jobSeekers, employers, jobs, applications, notifications };
};

export const useAppStore = create(
  persist<AppState>(
    (set, get) => {
      // Initialize with mock data if empty
      const initialData = generateMockData();

      return {
        // Auth state
        currentUser: null,
        isAuthenticated: false,

        // Data collections
        users: initialData.users,
        jobSeekers: initialData.jobSeekers,
        employers: initialData.employers,
        jobs: initialData.jobs,
        applications: initialData.applications,
        notifications: initialData.notifications,

        // Auth methods
        login: async (email: string, password: string) => {
          const user = get().users.find(
            (u) => u.email === email && u.password === password
          );
          if (user) {
            set({ currentUser: user, isAuthenticated: true });
            return user;
          }
          return null;
        },

        logout: () => {
          set({ currentUser: null, isAuthenticated: false });
        },

        register: async (userData: Partial<User>) => {
          const existingUser = get().users.find(
            (u) => u.email === userData.email
          );
          if (existingUser) {
            return null;
          }

          const newUser = {
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            ...userData,
          } as User;

          set((state) => ({
            users: [...state.users, newUser],
            ...(newUser.role === "job-seeker"
              ? {
                  jobSeekers: [...state.jobSeekers, newUser as JobSeeker],
                }
              : {}),
            ...(newUser.role === "employer"
              ? {
                  employers: [...state.employers, newUser as Employer],
                }
              : {}),
          }));

          return newUser;
        },

        // User methods
        addUser: (user: User) => {
          set((state) => ({ users: [...state.users, user] }));

          if (user.role === "job-seeker") {
            set((state) => ({
              jobSeekers: [...state.jobSeekers, user as JobSeeker],
            }));
          } else if (user.role === "employer") {
            set((state) => ({
              employers: [...state.employers, user as Employer],
            }));
          }
        },

        updateUser: (userId: string, userData: Partial<User>) => {
          set((state) => {
            // Update in users array
            const updatedUsers = state.users.map((user) =>
              user.id === userId ? { ...user, ...userData } : user
            );

            // Update in specific role array if applicable
            const updatedJobSeekers = state.jobSeekers.map((js) =>
              js.id === userId ? ({ ...js, ...userData } as JobSeeker) : js
            );

            const updatedEmployers = state.employers.map((emp) =>
              emp.id === userId ? ({ ...emp, ...userData } as Employer) : emp
            );

            // Also update currentUser if it's the same user
            const updatedCurrentUser =
              state.currentUser?.id === userId
                ? { ...state.currentUser, ...userData }
                : state.currentUser;

            return {
              users: updatedUsers,
              jobSeekers: updatedJobSeekers,
              employers: updatedEmployers,
              currentUser: updatedCurrentUser,
            };
          });
        },

        getUserById: (userId: string) => {
          return get().users.find((user) => user.id === userId);
        },

        // Job methods
        addJob: (jobData: Partial<Job>) => {
          const newJob: Job = {
            id: uuidv4(),
            employerId: get().currentUser?.id || "",
            companyName: (get().currentUser as Employer)?.companyName || "",
            title: "",
            description: "",
            location: "",
            type: "full-time",
            category: "",
            deadline: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: "active",
            ...jobData,
          };

          set((state) => ({ jobs: [...state.jobs, newJob] }));
          return newJob;
        },

        updateJob: (jobId: string, jobData: Partial<Job>) => {
          set((state) => ({
            jobs: state.jobs.map((job) =>
              job.id === jobId
                ? { ...job, ...jobData, updatedAt: new Date().toISOString() }
                : job
            ),
          }));
        },

        deleteJob: (jobId: string) => {
          set((state) => ({
            jobs: state.jobs.filter((job) => job.id !== jobId),
            // Also remove related applications
            applications: state.applications.filter(
              (app) => app.jobId !== jobId
            ),
          }));
        },

        getJobById: (jobId: string) => {
          return get().jobs.find((job) => job.id === jobId);
        },

        getJobsByEmployerId: (employerId: string) => {
          return get().jobs.filter((job) => job.employerId === employerId);
        },

        // Application methods
        addApplication: (applicationData: Partial<JobApplication>) => {
          const newApplication: JobApplication = {
            id: uuidv4(),
            jobId: "",
            jobSeekerId: get().currentUser?.id || "",
            resume: "",
            status: "pending",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...applicationData,
          };

          set((state) => ({
            applications: [...state.applications, newApplication],
          }));

          // Create notification for the employer
          const job = get().getJobById(newApplication.jobId);
          if (job) {
            const jobSeeker = get().getUserById(
              newApplication.jobSeekerId
            ) as JobSeeker;
            const notification: Notification = {
              id: uuidv4(),
              userId: job.employerId,
              title: "New Application",
              message: `${jobSeeker?.firstName || "Someone"} ${
                jobSeeker?.lastName || ""
              } has applied for the ${job.title} position.`,
              read: false,
              createdAt: new Date().toISOString(),
              type: "application",
              relatedId: newApplication.id,
            };

            get().addNotification(notification);
          }

          return newApplication;
        },

        updateApplication: (
          applicationId: string,
          applicationData: Partial<JobApplication>
        ) => {
          set((state) => ({
            applications: state.applications.map((app) =>
              app.id === applicationId
                ? {
                    ...app,
                    ...applicationData,
                    updatedAt: new Date().toISOString(),
                  }
                : app
            ),
          }));

          // Create notification for the job seeker if status changed
          if (applicationData.status) {
            const application = get().getApplicationById(applicationId);
            if (application) {
              const job = get().getJobById(application.jobId);
              if (job) {
                const notification: Notification = {
                  id: uuidv4(),
                  userId: application.jobSeekerId,
                  title: "Application Status Updated",
                  message: `Your application for ${job.title} at ${job.companyName} has been ${applicationData.status}.`,
                  read: false,
                  createdAt: new Date().toISOString(),
                  type: "status",
                  relatedId: applicationId,
                };

                get().addNotification(notification);
              }
            }
          }
        },

        getApplicationById: (applicationId: string) => {
          return get().applications.find((app) => app.id === applicationId);
        },

        getApplicationsByJobId: (jobId: string) => {
          return get().applications.filter((app) => app.jobId === jobId);
        },

        getApplicationsByJobSeekerId: (jobSeekerId: string) => {
          return get().applications.filter(
            (app) => app.jobSeekerId === jobSeekerId
          );
        },

        // Notification methods
        addNotification: (notificationData: Partial<Notification>) => {
          const newNotification: Notification = {
            id: uuidv4(),
            userId: "",
            title: "",
            message: "",
            read: false,
            createdAt: new Date().toISOString(),
            type: "system",
            ...notificationData,
          };

          set((state) => ({
            notifications: [...state.notifications, newNotification],
          }));
        },

        markNotificationAsRead: (notificationId: string) => {
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.id === notificationId ? { ...n, read: true } : n
            ),
          }));
        },

        getNotificationsByUserId: (userId: string) => {
          return get().notifications.filter((n) => n.userId === userId);
        },
      };
    },
    {
      name: "job-portal-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
