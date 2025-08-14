import { Card, CardContent } from "@/components/ui/card";
import { 
  ChartGantt, 
  CheckCircle, 
  Bot, 
  TrendingUp 
} from "lucide-react";

interface StatsCardsProps {
  activeProjects: number;
  completedProjects: number;
  creditsUsed: number;
  creditsRemaining: number;
}

export default function StatsCards({ 
  activeProjects, 
  completedProjects, 
  creditsUsed, 
  creditsRemaining 
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card data-testid="card-active-projects">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeProjects}</p>
            </div>
            <div className="w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center">
              <ChartGantt className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card data-testid="card-completed-projects">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedProjects}</p>
            </div>
            <div className="w-10 h-10 bg-green-500 text-white rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card data-testid="card-credits-used">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Credits Used</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{creditsUsed}</p>
            </div>
            <div className="w-10 h-10 bg-purple-500 text-white rounded-lg flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card data-testid="card-credits-remaining">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Credits Left</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{creditsRemaining}</p>
            </div>
            <div className="w-10 h-10 bg-orange-500 text-white rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}