import { Toaster } from "@/ui/sonner";
import { TooltipProvider } from "@/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Profile from "./components/auth/Profile";
import Dashboard from "./components/dashboard/Dashboard";
import Unauthorized from "./components/auth/Unauthorized";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import MyApplications from "./pages/jobseeker/MyApplications";

import "bootstrap/dist/css/bootstrap.min.css";
import BrowseJobs from "./pages/jobseeker/BrowseJobs";
import PostJob from "./pages/employer/PostJob";
import JobApplications from "./pages/employer/JobApplications";
import MyPostedJobs from "./pages/employer/MyPostedJobs";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Routes - Any authenticated user */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Protected Routes - Job Seeker Only */}
            <Route element={<ProtectedRoute requiredRole="jobSeeker" />}>
              <Route path="/applications" element={<MyApplications />} />
              <Route path="/jobs" element={<BrowseJobs />} />
              <Route path="/jobs/:id" element={<div>Job Details</div>} />
            </Route>

            {/* Protected Routes - Employer Only */}
            <Route element={<ProtectedRoute requiredRole="employer" />}>
              <Route path="/manage-jobs" element={<MyPostedJobs />} />
              <Route path="/post-job" element={<PostJob />} />
              <Route path="/jobs/:id/edit" element={<div>Edit Job</div>} />
              <Route
                path="/jobs/:id/applications"
                element={<JobApplications />}
              />
              <Route
                path="/applications/received"
                element={<div>All Received Applications</div>}
              />
            </Route>

            {/* 404 - Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
