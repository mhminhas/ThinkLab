import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MoreHorizontal, 
  Calendar,
  Users
} from "lucide-react";
import { Link } from "wouter";

interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  tags?: string[];
  createdAt: Date;
}

interface RecentProjectsProps {
  projects: Project[];
}

export default function RecentProjects({ projects }: RecentProjectsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    }
  };

  return (
    <Card data-testid="card-recent-projects">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Projects</CardTitle>
        <Link href="/projects">
          <Button variant="ghost" size="sm" data-testid="button-view-all-projects">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400" data-testid="text-no-projects">
                No projects yet. Create your first project!
              </p>
              <Link href="/projects">
                <Button className="mt-4" data-testid="button-create-first-project">
                  Create Project
                </Button>
              </Link>
            </div>
          ) : (
            projects.slice(0, 5).map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" data-testid={`project-item-${project.id}`}>
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {project.name}
                    </h3>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  {project.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {project.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <span>Tags:</span>
                        <span>{project.tags.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="icon" data-testid={`button-project-menu-${project.id}`}>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}