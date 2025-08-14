import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Plus, 
  MoreHorizontal,
  Calendar,
  User,
  Flag
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: number;
  assigneeId?: string;
  assigneeName?: string;
  assigneeImage?: string;
  dueDate?: Date;
  createdAt: Date;
}

interface KanbanBoardProps {
  tasks: Task[];
  onTaskCreate?: (status: string) => void;
  onTaskUpdate?: (id: string, updates: Partial<Task>) => void;
  onTaskDelete?: (id: string) => void;
}

const columns = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-100 dark:bg-gray-800' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-blue-100 dark:bg-blue-900' },
  { id: 'review', title: 'Review', color: 'bg-yellow-100 dark:bg-yellow-900' },
  { id: 'done', title: 'Done', color: 'bg-green-100 dark:bg-green-900' },
];

export default function KanbanBoard({ 
  tasks, 
  onTaskCreate, 
  onTaskUpdate, 
  onTaskDelete 
}: KanbanBoardProps) {
  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'text-green-600';
      case 2: return 'text-yellow-600';
      case 3: return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1: return 'Low';
      case 2: return 'Medium';
      case 3: return 'High';
      default: return 'Normal';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="kanban-board">
      {columns.map((column) => {
        const columnTasks = tasks.filter(task => task.status === column.id);
        
        return (
          <div key={column.id} className={`rounded-lg p-4 ${column.color}`} data-testid={`kanban-column-${column.id}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {column.title}
              </h3>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {columnTasks.length}
                </Badge>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-6 w-6"
                  onClick={() => onTaskCreate?.(column.id)}
                  data-testid={`button-add-task-${column.id}`}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              {columnTasks.map((task) => (
                <Card key={task.id} className="cursor-grab transition-all hover:shadow-sm" data-testid={`task-card-${task.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6" data-testid={`button-task-menu-${task.id}`}>
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem data-testid={`menu-edit-task-${task.id}`}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onTaskDelete?.(task.id)}
                            className="text-red-600"
                            data-testid={`menu-delete-task-${task.id}`}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    {task.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Flag className={`h-3 w-3 ${getPriorityColor(task.priority)}`} />
                        <span className={`text-xs ${getPriorityColor(task.priority)}`}>
                          {getPriorityLabel(task.priority)}
                        </span>
                      </div>
                      
                      {task.assigneeId && (
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={task.assigneeImage} alt={task.assigneeName} />
                          <AvatarFallback className="text-xs">
                            {task.assigneeName?.[0]?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                    
                    {task.dueDate && (
                      <div className="flex items-center space-x-1 mt-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              
              {columnTasks.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No tasks in {column.title.toLowerCase()}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => onTaskCreate?.(column.id)}
                    data-testid={`button-add-first-task-${column.id}`}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Task
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}