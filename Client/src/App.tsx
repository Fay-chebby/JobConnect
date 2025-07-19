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

// Import bootstrap styles
import "bootstrap/dist/css/bootstrap.min.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
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
              <Route
                path="/applications"
                element={<div>My Applications</div>}
              />
              <Route path="/jobs" element={<div>Browse Jobs</div>} />
              <Route path="/jobs/:id" element={<div>Job Details</div>} />
            </Route>

            {/* Protected Routes - Employer Only */}
            <Route element={<ProtectedRoute requiredRole="employer" />}>
              <Route path="/manage-jobs" element={<div>Manage Jobs</div>} />
              <Route path="/post-job" element={<div>Post a New Job</div>} />
              <Route path="/jobs/:id/edit" element={<div>Edit Job</div>} />
              <Route
                path="/jobs/:id/applications"
                element={<div>View Job Applications</div>}
              />
              <Route
                path="/applications/received"
                element={<div>All Received Applications</div>}
              />
            </Route>

            {/* 404 - Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
