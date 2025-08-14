import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  User,
  Key,
  Bell,
  Shield,
  CreditCard,
  Trash2,
  Plus,
  Copy,
  Crown,
  Settings as SettingsIcon
} from "lucide-react";

export default function Settings() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [newApiKeyName, setNewApiKeyName] = useState("");

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: apiKeys = [] } = useQuery({
    queryKey: ["/api/api-keys"],
    enabled: !!isAuthenticated,
    retry: false,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ["/api/notifications"],
    enabled: !!isAuthenticated,
    retry: false,
  });

  const createApiKeyMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await apiRequest("POST", "/api/api-keys", { name });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/api-keys"] });
      setNewApiKeyName("");
      toast({
        title: "API Key Created",
        description: "Your new API key has been generated. Make sure to copy it now.",
      });
      // Show the key in an alert or modal since it's only shown once
      navigator.clipboard.writeText(data.key);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create API key. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteApiKeyMutation = useMutation({
    mutationFn: async (keyId: string) => {
      await apiRequest("DELETE", `/api/api-keys/${keyId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/api-keys"] });
      toast({
        title: "API Key Deleted",
        description: "The API key has been deactivated.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete API key. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateApiKey = () => {
    if (!newApiKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your API key.",
        variant: "destructive",
      });
      return;
    }
    createApiKeyMutation.mutate(newApiKeyName);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "API key copied to clipboard.",
    });
  };

  const userInitials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`
    : user?.email?.[0]?.toUpperCase() || "U";

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 pt-20 p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white" data-testid="text-settings-title">
                Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-300" data-testid="text-settings-subtitle">
                Manage your account and application preferences
              </p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-5" data-testid="tabs-settings">
                <TabsTrigger value="profile">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="api">
                  <Key className="h-4 w-4 mr-2" />
                  API Keys
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="billing">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Billing
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="mt-8">
                <Card data-testid="card-profile">
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={user?.profileImageUrl} alt={user?.firstName || "User"} />
                        <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white" data-testid="text-user-display-name">
                          {user?.firstName && user?.lastName 
                            ? `${user.firstName} ${user.lastName}`
                            : "User"
                          }
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400" data-testid="text-user-email-display">
                          {user?.email}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={user?.subscriptionPlan === "free" ? "secondary" : "default"}>
                            {user?.subscriptionPlan?.charAt(0).toUpperCase() + user?.subscriptionPlan?.slice(1) || "Free"}
                          </Badge>
                          {user?.subscriptionPlan !== "free" && (
                            <Crown className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={user?.firstName || ""}
                          placeholder="Enter your first name"
                          disabled
                          data-testid="input-first-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={user?.lastName || ""}
                          placeholder="Enter your last name"
                          disabled
                          data-testid="input-last-name"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ""}
                        disabled
                        data-testid="input-email"
                      />
                    </div>

                    <div className="pt-4">
                      <Button disabled data-testid="button-update-profile">
                        Update Profile
                      </Button>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Profile information is managed through your authentication provider.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* API Keys Tab */}
              <TabsContent value="api" className="mt-8">
                <div className="space-y-6">
                  <Card data-testid="card-create-api-key">
                    <CardHeader>
                      <CardTitle>Create New API Key</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4">
                        <Input
                          placeholder="API key name (e.g., My App Integration)"
                          value={newApiKeyName}
                          onChange={(e) => setNewApiKeyName(e.target.value)}
                          data-testid="input-api-key-name"
                        />
                        <Button 
                          onClick={handleCreateApiKey} 
                          disabled={createApiKeyMutation.isPending}
                          data-testid="button-create-api-key"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {createApiKeyMutation.isPending ? "Creating..." : "Create"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card data-testid="card-api-keys-list">
                    <CardHeader>
                      <CardTitle>Your API Keys</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {apiKeys.length > 0 ? (
                        <div className="space-y-4">
                          {apiKeys.map((key: any) => (
                            <div key={key.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg" data-testid={`api-key-${key.id}`}>
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">{key.name}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Created {new Date(key.createdAt).toLocaleDateString()}
                                  {key.lastUsed && ` • Last used ${new Date(key.lastUsed).toLocaleDateString()}`}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                                  tk_****...{key.keyHash.slice(-8)}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyToClipboard(`tk_****...${key.keyHash.slice(-8)}`)}
                                  data-testid={`button-copy-key-${key.id}`}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm" data-testid={`button-delete-key-${key.id}`}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this API key? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => deleteApiKeyMutation.mutate(key.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 dark:text-gray-400" data-testid="text-no-api-keys">
                            No API keys created yet
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="mt-8">
                <Card data-testid="card-notification-settings">
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-notifications">Email Notifications</Label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Receive email updates about your projects and account
                          </p>
                        </div>
                        <Switch id="email-notifications" defaultChecked data-testid="switch-email-notifications" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="project-updates">Project Updates</Label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Get notified when projects are completed or updated
                          </p>
                        </div>
                        <Switch id="project-updates" defaultChecked data-testid="switch-project-updates" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="billing-alerts">Billing Alerts</Label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Receive alerts about billing and subscription changes
                          </p>
                        </div>
                        <Switch id="billing-alerts" defaultChecked data-testid="switch-billing-alerts" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="marketing-emails">Marketing Emails</Label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Receive updates about new features and promotions
                          </p>
                        </div>
                        <Switch id="marketing-emails" data-testid="switch-marketing-emails" />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-4">Recent Notifications</h4>
                      {notifications.length > 0 ? (
                        <div className="space-y-3">
                          {notifications.slice(0, 5).map((notification: any) => (
                            <div key={notification.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg" data-testid={`notification-${notification.id}`}>
                              <p className="font-medium text-sm">{notification.title}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">{notification.message}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400 text-sm" data-testid="text-no-notifications">
                          No recent notifications
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="mt-8">
                <Card data-testid="card-security-settings">
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Account Security</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">Two-Factor Authentication</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                Add an extra layer of security to your account
                              </p>
                            </div>
                            <Badge variant={user?.twoFactorEnabled ? "default" : "secondary"}>
                              {user?.twoFactorEnabled ? "Enabled" : "Disabled"}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">Email Verification</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                Verify your email address for account security
                              </p>
                            </div>
                            <Badge variant={user?.emailVerified ? "default" : "secondary"}>
                              {user?.emailVerified ? "Verified" : "Unverified"}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">Phone Verification</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                Verify your phone number for additional security
                              </p>
                            </div>
                            <Badge variant={user?.phoneVerified ? "default" : "secondary"}>
                              {user?.phoneVerified ? "Verified" : "Unverified"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-2">Data & Privacy</h4>
                        <div className="space-y-3">
                          <Button variant="outline" size="sm" data-testid="button-download-data">
                            Download My Data
                          </Button>
                          <Button variant="outline" size="sm" data-testid="button-privacy-settings">
                            Privacy Settings
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Billing Tab */}
              <TabsContent value="billing" className="mt-8">
                <div className="space-y-6">
                  <Card data-testid="card-current-plan">
                    <CardHeader>
                      <CardTitle>Current Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {user?.subscriptionPlan?.charAt(0).toUpperCase() + user?.subscriptionPlan?.slice(1) || "Free"} Plan
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            {user?.credits || 0} credits remaining
                          </p>
                        </div>
                        {user?.subscriptionPlan !== "free" && (
                          <Badge className="bg-primary">
                            <Crown className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card data-testid="card-billing-history">
                    <CardHeader>
                      <CardTitle>Billing History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400" data-testid="text-no-billing-history">
                          No billing history available
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
