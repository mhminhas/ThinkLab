import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/ui/theme-provider";
import { useAuth } from "@/hooks/useAuth";
import { Bell, Moon, Sun, Settings, LogOut, User } from "lucide-react";

export default function Navbar() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const userInitials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`
    : user?.email?.[0]?.toUpperCase() || "U";

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 fixed top-0 right-0 left-64 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white" data-testid="text-page-title">
            Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Credits Badge */}
          <Badge variant="outline" className="text-sm" data-testid="badge-credits">
            {user?.credits || 0} credits
          </Badge>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme} data-testid="button-theme-toggle">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" data-testid="button-notifications">
            <Bell className="h-5 w-5" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full" data-testid="button-user-menu">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profileImageUrl} alt={user?.firstName || "User"} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none" data-testid="text-user-name">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}`
                      : "User"
                    }
                  </p>
                  <p className="text-xs leading-none text-muted-foreground" data-testid="text-user-email">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem data-testid="menu-profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem data-testid="menu-settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} data-testid="menu-logout">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
