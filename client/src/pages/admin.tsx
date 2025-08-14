import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import AnalyticsDashboard from "@/components/admin/analytics-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  DollarSign, 
  ChartGantt, 
  Activity,
  Shield,
  Settings,
  BarChart3,
  AlertTriangle
} from "lucide-react";

export default function Admin() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to home if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  const { data: analytics = { totalUsers: 1247, totalRevenue: 8432, activeProjects: 342, apiCalls: 15689 }, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/admin/analytics"],
    enabled: !!isAuthenticated && user?.role === "admin",
    retry: false,
  });

  if (isLoading || !user || user.role !== "admin") {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900" />;
  }

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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white" data-testid="text-admin-title">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-300" data-testid="text-admin-subtitle">
                  Manage your ThinkLab platform
                </p>
              </div>
              <Badge variant="secondary" className="px-3 py-1">
                <Shield className="h-4 w-4 mr-2" />
                Administrator
              </Badge>
            </div>

            {/* Key Metrics */}
            {analyticsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
              </div>
            ) : analytics ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card data-testid="metric-total-users">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.totalUsers.toLocaleString()}</p>
                        <p className="text-sm text-green-600">+12% this month</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 rounded-lg flex items-center justify-center">
                        <Users className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card data-testid="metric-monthly-revenue">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Revenue</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">${analytics.totalRevenue.toLocaleString()}</p>
                        <p className="text-sm text-green-600">+18% this month</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card data-testid="metric-active-projects">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Active Projects</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.activeProjects.toLocaleString()}</p>
                        <p className="text-sm text-green-600">+8% this month</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300 rounded-lg flex items-center justify-center">
                        <ChartGantt className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card data-testid="metric-api-calls">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">API Calls</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{(analytics.apiCalls / 1000000).toFixed(1)}M</p>
                        <p className="text-sm text-green-600">+25% this month</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300 rounded-lg flex items-center justify-center">
                        <Activity className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400" data-testid="text-analytics-error">
                    Unable to load analytics data
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Admin Tabs */}
            <Tabs defaultValue="analytics" className="w-full">
              <TabsList className="grid w-full grid-cols-4" data-testid="tabs-admin">
                <TabsTrigger value="analytics">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="users">
                  <Users className="h-4 w-4 mr-2" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="payments">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Payments
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="analytics" className="mt-8">
                <AnalyticsDashboard analytics={analytics} />
              </TabsContent>

              <TabsContent value="users" className="mt-8">
                <Card data-testid="card-user-management">
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        User Management
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Manage user accounts, subscriptions, and permissions
                      </p>
                      <Button data-testid="button-manage-users">
                        View All Users
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payments" className="mt-8">
                <Card data-testid="card-payment-management">
                  <CardHeader>
                    <CardTitle>Payment Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Payment Logs
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        View payment history, subscriptions, and revenue analytics
                      </p>
                      <Button data-testid="button-manage-payments">
                        View Payment Logs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="mt-8">
                <Card data-testid="card-platform-settings">
                  <CardHeader>
                    <CardTitle>Platform Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardContent className="p-6">
                          <h4 className="font-semibold mb-2">API Configuration</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Manage OpenAI API keys and other integrations
                          </p>
                          <Button variant="outline" size="sm" data-testid="button-api-config">
                            Configure APIs
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <h4 className="font-semibold mb-2">Subscription Plans</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Edit pricing and plan features
                          </p>
                          <Button variant="outline" size="sm" data-testid="button-plan-config">
                            Manage Plans
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <h4 className="font-semibold mb-2">Marketplace</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Moderate templates and manage marketplace
                          </p>
                          <Button variant="outline" size="sm" data-testid="button-marketplace-config">
                            Manage Marketplace
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <h4 className="font-semibold mb-2">System Health</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Monitor system performance and logs
                          </p>
                          <Button variant="outline" size="sm" data-testid="button-system-health">
                            View System Status
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
