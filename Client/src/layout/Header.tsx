import { Link, useNavigate } from "react-router-dom";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/ui/button";
import { useAppStore } from "@/lib/store";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/ui/sheet";
import { Avatar, AvatarFallback } from "@/ui/avatar";
import { Badge } from "@/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { AppUser, Notification } from "@/types/app";

export default function Header() {
  const { currentUser, isAuthenticated, logout, notifications } = useAppStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const unreadNotifications = notifications.filter(
    (n: Notification) => n.userId === currentUser?.id && !n.read
  );

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getInitials = () => {
    if (!currentUser) return "U";

    if (currentUser.role === "job-seeker") {
      const jobSeeker = currentUser as AppUser;
      return `${jobSeeker.firstName?.charAt(0) || ""}${
        jobSeeker.lastName?.charAt(0) || ""
      }`;
    } else if (currentUser.role === "employer") {
      const employer = currentUser as AppUser;
      return employer.companyName?.charAt(0) || "E";
    }

    return "A";
  };

  const getDashboardLink = () => {
    switch (currentUser?.role) {
      case "job-seeker":
        return "/job-seeker/dashboard";
      case "employer":
        return "/employer/dashboard";
      case "admin":
        return "/admin/dashboard";
      default:
        return "/";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">JobPortal</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/jobs" className="text-sm font-medium hover:text-primary">
            Browse Jobs
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to={getDashboardLink()}
                className="text-sm font-medium hover:text-primary"
              >
                Dashboard
              </Link>

              {currentUser?.role === "employer" && (
                <Link
                  to="/employer/post-job"
                  className="text-sm font-medium hover:text-primary"
                >
                  Post a Job
                </Link>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    {unreadNotifications.length > 0 && (
                      <Badge
                        variant="destructive"
                        className="h-4 w-4 p-0 flex items-center justify-center absolute -top-1 -right-1 text-[10px]"
                      >
                        {unreadNotifications.length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="px-4 py-2 font-medium">Notifications</div>
                  <DropdownMenuSeparator />
                  <div className="max-h-80 overflow-auto">
                    {notifications.filter(
                      (n: Notification) => n.userId === currentUser?.id
                    ).length === 0 ? (
                      <div className="px-4 py-2 text-sm text-muted-foreground">
                        No notifications
                      </div>
                    ) : (
                      notifications
                        .filter(
                          (n: Notification) => n.userId === currentUser?.id
                        )
                        .sort(
                          (a: Notification, b: Notification) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime()
                        )
                        .map((notification: Notification) => (
                          <DropdownMenuItem
                            key={notification.id}
                            className="p-4 cursor-pointer"
                          >
                            <div
                              className={`space-y-1 ${
                                notification.read ? "" : "font-medium"
                              }`}
                            >
                              <p className="text-sm">{notification.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(
                                  notification.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </DropdownMenuItem>
                        ))
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline-block">
                      {currentUser.role === "job-seeker"
                        ? `${(currentUser as AppUser).firstName || ""} ${
                            (currentUser as AppUser).lastName || ""
                          }`
                        : currentUser.role === "employer"
                        ? (currentUser as AppUser).companyName
                        : "Admin"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={getDashboardLink()}>Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/auth/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link to="/auth/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>JobPortal</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 mt-8">
              <Link
                to="/jobs"
                className="text-lg font-medium"
                onClick={() => setIsOpen(false)}
              >
                Browse Jobs
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to={getDashboardLink()}
                    className="text-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>

                  {currentUser?.role === "employer" && (
                    <Link
                      to="/employer/post-job"
                      className="text-lg font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Post a Job
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    className="text-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="justify-start p-0"
                  >
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth/login" onClick={() => setIsOpen(false)}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      Sign in
                    </Button>
                  </Link>
                  <Link to="/auth/register" onClick={() => setIsOpen(false)}>
                    <Button size="sm" className="w-full">
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
