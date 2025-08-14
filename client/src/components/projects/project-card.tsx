import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MoreHorizontal, 
  Calendar,
  FileText,
  Users,
  Edit,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "wouter";

interface ProjectCardProps {
  id: string;
  name: string;
  description?: string;
  status: string;
  tags?: string[];
  createdAt: Date;
  taskCount?: number;
  memberCount?: number;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function ProjectCard({
  id,
  name,
  description,
  status,
  tags = [],
  createdAt,
  taskCount = 0,
  memberCount = 1,
  onEdit,
  onDelete
}: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    }
  };

  return (
    <Card className="cursor-pointer transition-all hover:shadow-md" data-testid={`project-card-${id}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <CardTitle className="text-lg line-clamp-1">{name}</CardTitle>
            <Badge className={getStatusColor(status)}>
              {status}
            </Badge>
          </div>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {description}
            </p>
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" data-testid={`button-project-menu-${id}`}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit?.(id)} data-testid={`menu-edit-${id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete?.(id)} 
              className="text-red-600"
              data-testid={`menu-delete-${id}`}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileText className="h-3 w-3" />
              <span>{taskCount} tasks</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>{memberCount}</span>
            </div>
          </div>
        </div>
        
        <Link href={`/projects/${id}`}>
          <Button className="w-full" data-testid={`button-open-project-${id}`}>
            Open Project
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}