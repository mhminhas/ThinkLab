import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChartGantt, 
  Bot, 
  Store, 
  Users, 
  Plus,
  TrendingUp,
  Clock,
  Star
} from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" data-testid="text-welcome">
                Welcome back, {user?.firstName || "User"}!
              </h1>
              <p className="text-gray-600 dark:text-gray-300" data-testid="text-welcome-subtitle">
                Ready to create something amazing with AI?
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card data-testid="card-credits">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Available Credits</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{user?.credits || 0}</p>
                    </div>
                    <div className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center">
                      <Bot className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-plan">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Current Plan</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                        {user?.subscriptionPlan || "Free"}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-secondary text-white rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-projects">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Active Projects</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                    </div>
                    <div className="w-10 h-10 bg-accent text-white rounded-lg flex items-center justify-center">
                      <ChartGantt className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-team">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Team Members</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">1</p>
                    </div>
                    <div className="w-10 h-10 bg-yellow-500 text-white rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card data-testid="card-quick-actions">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/projects">
                    <Button className="w-full justify-start" variant="outline" data-testid="button-new-project">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Project
                    </Button>
                  </Link>
                  
                  <Link href="/ai-tools">
                    <Button className="w-full justify-start" variant="outline" data-testid="button-ai-tools">
                      <Bot className="h-4 w-4 mr-2" />
                      Try AI Tools
                    </Button>
                  </Link>
                  
                  <Link href="/marketplace">
                    <Button className="w-full justify-start" variant="outline" data-testid="button-marketplace">
                      <Store className="h-4 w-4 mr-2" />
                      Browse Marketplace
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card data-testid="card-recent-activity">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p data-testid="text-no-activity">No recent activity</p>
                      <p className="text-sm" data-testid="text-activity-hint">Start creating projects to see your activity here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Featured Templates */}
            <Card data-testid="card-templates">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Featured Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" data-testid="template-blog">
                    <Badge className="mb-2">Content Creation</Badge>
                    <h4 className="font-semibold mb-2">Blog Post Generator</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Generate high-quality blog posts with SEO optimization
                    </p>
                    <Button size="sm" variant="outline" data-testid="button-template-blog">
                      Use Template
                    </Button>
                  </div>

                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" data-testid="template-social">
                    <Badge className="mb-2" variant="secondary">Social Media</Badge>
                    <h4 className="font-semibold mb-2">Social Media Kit</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Create engaging social media content and visuals
                    </p>
                    <Button size="sm" variant="outline" data-testid="button-template-social">
                      Use Template
                    </Button>
                  </div>

                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" data-testid="template-analysis">
                    <Badge className="mb-2" variant="outline">Data Analysis</Badge>
                    <h4 className="font-semibold mb-2">Data Insights Pro</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Extract actionable insights from your datasets
                    </p>
                    <Button size="sm" variant="outline" data-testid="button-template-analysis">
                      Use Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
