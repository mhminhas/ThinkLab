import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import StatsCards from "@/components/dashboard/stats-cards";
import RecentProjects from "@/components/dashboard/recent-projects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp,
  Calendar,
  Clock,
  AlertCircle,
  Plus
} from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: projects = [] } = useQuery({
    queryKey: ["/api/projects"],
    enabled: !!user,
  });

  const { data: aiUsage = [] } = useQuery({
    queryKey: ["/api/ai/usage"],
    enabled: !!user,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ["/api/notifications"],
    enabled: !!user,
  });

  const activeProjects = projects.filter((p: any) => p.status === 'active').length;
  const completedProjects = projects.filter((p: any) => p.status === 'completed').length;
  const totalCreditsUsed = aiUsage.reduce((sum: number, usage: any) => sum + usage.creditsUsed, 0);
  const unreadNotifications = notifications.filter((n: any) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 pt-20 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white" data-testid="text-dashboard-title">
                  Dashboard Overview
                </h1>
                <p className="text-gray-600 dark:text-gray-300" data-testid="text-dashboard-subtitle">
                  Track your projects and AI usage
                </p>
              </div>
              <Link href="/projects">
                <Button data-testid="button-new-project">
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </Link>
            </div>

            {/* Stats Cards */}
            <StatsCards 
              activeProjects={activeProjects}
              completedProjects={completedProjects}
              creditsUsed={totalCreditsUsed}
              creditsRemaining={user?.credits || 0}
            />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Projects */}
              <div className="lg:col-span-2">
                <RecentProjects projects={projects.slice(0, 5)} />
              </div>

              {/* Sidebar Content */}
              <div className="space-y-6">
                {/* Credit Usage */}
                <Card data-testid="card-credit-usage">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Credit Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Credits Used</span>
                        <span>{totalCreditsUsed} / {(user?.credits || 0) + totalCreditsUsed}</span>
                      </div>
                      <Progress 
                        value={((user?.credits || 0) + totalCreditsUsed) > 0 ? (totalCreditsUsed / ((user?.credits || 0) + totalCreditsUsed)) * 100 : 0} 
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Text Generation</span>
                        <span>{aiUsage.filter((u: any) => u.toolType === 'text_generation').length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Image Generation</span>
                        <span>{aiUsage.filter((u: any) => u.toolType === 'image_generation').length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Code Generation</span>
                        <span>{aiUsage.filter((u: any) => u.toolType === 'code_generation').length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card data-testid="card-recent-activity">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {aiUsage.length > 0 ? (
                      <div className="space-y-3">
                        {aiUsage.slice(0, 5).map((usage: any) => (
                          <div key={usage.id} className="flex items-center gap-3" data-testid={`activity-${usage.id}`}>
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {usage.toolType.replace('_', ' ').toUpperCase()}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {usage.creditsUsed} credits • {new Date(usage.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Clock className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400" data-testid="text-no-activity">
                          No recent activity
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Notifications */}
                <Card data-testid="card-notifications">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Notifications
                      {unreadNotifications > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {unreadNotifications}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {notifications.length > 0 ? (
                      <div className="space-y-3">
                        {notifications.slice(0, 5).map((notification: any) => (
                          <div key={notification.id} className="space-y-1" data-testid={`notification-${notification.id}`}>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {notification.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <AlertCircle className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400" data-testid="text-no-notifications">
                          No notifications
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
