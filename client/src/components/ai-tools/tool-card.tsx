import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Brain, Sparkles, Zap } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  icon: string;
  credits: number;
  category: string;
  disabled?: boolean;
}

export default function ToolCard({ title, description, icon, credits, category, disabled }: ToolCardProps) {
  const { toast } = useToast();

  const handleUse = () => {
    if (disabled) {
      toast({
        title: "Insufficient Credits",
        description: `You need ${credits} credits to use this tool.`,
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Tool Activated",
      description: `${title} is ready to use.`,
    });
  };

  const getIconComponent = () => {
    switch (icon) {
      case "brain":
        return <Brain className="h-8 w-8" />;
      case "sparkles":
        return <Sparkles className="h-8 w-8" />;
      case "zap":
        return <Zap className="h-8 w-8" />;
      default:
        return <Brain className="h-8 w-8" />;
    }
  };

  return (
    <Card className={`h-full transition-all duration-200 hover:shadow-lg ${disabled ? 'opacity-60' : ''}`}>
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
            {getIconComponent()}
          </div>
          <Badge variant="secondary" className="text-xs">
            {credits} credits
          </Badge>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2" data-testid={`text-tool-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
            {description}
          </p>
          <Badge variant="outline" className="mb-4">
            {category}
          </Badge>
        </div>
        
        <Button 
          className="w-full mt-auto" 
          onClick={handleUse}
          disabled={disabled}
          data-testid={`button-use-${title.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {disabled ? 'Insufficient Credits' : 'Use Tool'}
        </Button>
      </CardContent>
    </Card>
  );
}