import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import {
  Home,
  ChartGantt,
  Bot,
  Store,
  Users,
  Settings,
  BarChart3,
  Crown
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Projects", href: "/projects", icon: ChartGantt },
  { name: "AI Tools", href: "/ai-tools", icon: Bot },
  { name: "Marketplace", href: "/marketplace", icon: Store },
  { name: "Team", href: "/team", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

const adminNavigation = [
  { name: "Admin Panel", href: "/admin", icon: BarChart3 },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";
  const isPremium = user?.subscriptionPlan !== "free";

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <Link href="/">
          <h1 className="text-2xl font-bold text-primary cursor-pointer" data-testid="logo-sidebar">
            ThinkLab
          </h1>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-primary text-primary-foreground"
                )}
                data-testid={`nav-${item.name.toLowerCase().replace(" ", "-")}`}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.name}
              </Button>
            </Link>
          );
        })}

        {/* Admin Navigation */}
        {isAdmin && (
          <>
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Admin
              </p>
              {adminNavigation.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        isActive && "bg-primary text-primary-foreground"
                      )}
                      data-testid={`nav-${item.name.toLowerCase().replace(" ", "-")}`}
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </nav>

      {/* Subscription Status */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4" data-testid="subscription-status">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.subscriptionPlan?.charAt(0).toUpperCase() + user?.subscriptionPlan?.slice(1) || "Free"} Plan
            </p>
            {isPremium && <Crown className="h-4 w-4 text-yellow-500" />}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            {user?.credits || 0} credits remaining
          </p>
          {!isPremium && (
            <Button size="sm" className="w-full" data-testid="button-upgrade">
              Upgrade Plan
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
