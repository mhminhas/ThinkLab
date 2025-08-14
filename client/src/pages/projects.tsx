import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import ProjectCard from "@/components/projects/project-card";
import KanbanBoard from "@/components/projects/kanban-board";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Filter, Grid, List, Kanban } from "lucide-react";

export default function Projects() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [view, setView] = useState<"grid" | "list" | "kanban">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "active" as const,
    tags: [] as string[],
  });

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

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
    enabled: !!isAuthenticated,
    retry: false,
  });

  const createProjectMutation = useMutation({
    mutationFn: async (projectData: typeof newProject) => {
      await apiRequest("POST", "/api/projects", projectData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setIsCreateModalOpen(false);
      setNewProject({ name: "", description: "", status: "active", tags: [] });
      toast({
        title: "Success",
        description: "Project created successfully!",
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
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredProjects = projects.filter((project: any) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProject = () => {
    if (!newProject.name.trim()) {
      toast({
        title: "Error",
        description: "Project name is required.",
        variant: "destructive",
      });
      return;
    }
    createProjectMutation.mutate(newProject);
  };

  if (isLoading) {
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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white" data-testid="text-projects-title">
                  Projects
                </h1>
                <p className="text-gray-600 dark:text-gray-300" data-testid="text-projects-subtitle">
                  Manage and organize your AI-powered projects
                </p>
              </div>
              
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-create-project">
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                      Start a new AI-powered project to organize your work.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Project Name</Label>
                      <Input
                        id="name"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                        placeholder="Enter project name..."
                        data-testid="input-project-name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        placeholder="Describe your project..."
                        data-testid="input-project-description"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={newProject.status} onValueChange={(value: any) => setNewProject({ ...newProject, status: value })}>
                        <SelectTrigger data-testid="select-project-status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleCreateProject} disabled={createProjectMutation.isPending} data-testid="button-submit-project">
                      {createProjectMutation.isPending ? "Creating..." : "Create Project"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex gap-4 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-projects"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={view === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setView("grid")}
                  data-testid="button-grid-view"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={view === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setView("list")}
                  data-testid="button-list-view"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={view === "kanban" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setView("kanban")}
                  data-testid="button-kanban-view"
                >
                  <Kanban className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Project Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Card data-testid="stat-total-projects">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{projects.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Projects</div>
                  </div>
                </CardContent>
              </Card>
              <Card data-testid="stat-active-projects">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {projects.filter((p: any) => p.status === 'active').length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
                  </div>
                </CardContent>
              </Card>
              <Card data-testid="stat-completed-projects">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {projects.filter((p: any) => p.status === 'completed').length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
                  </div>
                </CardContent>
              </Card>
              <Card data-testid="stat-draft-projects">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {projects.filter((p: any) => p.status === 'draft').length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Draft</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Projects Content */}
            {projectsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
              </div>
            ) : filteredProjects.length > 0 ? (
              <div>
                {view === "kanban" ? (
                  <KanbanBoard projects={filteredProjects} />
                ) : (
                  <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                    {filteredProjects.map((project: any) => (
                      <ProjectCard key={project.id} project={project} view={view} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2" data-testid="text-no-projects">
                    {searchTerm || statusFilter !== "all" ? "No projects found" : "No projects yet"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6" data-testid="text-no-projects-subtitle">
                    {searchTerm || statusFilter !== "all" 
                      ? "Try adjusting your search or filter criteria."
                      : "Create your first project to get started with ThinkLab."
                    }
                  </p>
                  {!searchTerm && statusFilter === "all" && (
                    <Button onClick={() => setIsCreateModalOpen(true)} data-testid="button-create-first-project">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Project
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
