import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import ToolCard from "@/components/ai-tools/tool-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Image, Code, BarChart3, Search, FileText } from "lucide-react";

const aiTools = [
  {
    id: "text-generation",
    name: "Text Generation",
    description: "Generate high-quality content, blog posts, and marketing copy with advanced AI assistance.",
    icon: Bot,
    category: "content",
    credits: 5,
    features: ["Blog posts", "Marketing copy", "Creative writing", "Technical documentation"],
  },
  {
    id: "image-generation",
    name: "Image Generation",
    description: "Create stunning visuals and artwork for your projects using state-of-the-art AI models.",
    icon: Image,
    category: "creative",
    credits: 10,
    features: ["Digital art", "Product images", "Illustrations", "Concept art"],
  },
  {
    id: "code-generation",
    name: "Code Generation",
    description: "Accelerate development with AI-powered code generation and debugging assistance.",
    icon: Code,
    category: "development",
    credits: 8,
    features: ["Function generation", "Code optimization", "Bug fixing", "Documentation"],
  },
  {
    id: "data-analysis",
    name: "Data Analysis",
    description: "Extract insights from your data with intelligent analysis and visualization tools.",
    icon: BarChart3,
    category: "analytics",
    credits: 15,
    features: ["Trend analysis", "Pattern recognition", "Insights extraction", "Report generation"],
  },
  {
    id: "text-summarization",
    name: "Text Summarization",
    description: "Summarize long documents and articles while maintaining key information.",
    icon: FileText,
    category: "content",
    credits: 3,
    features: ["Document summaries", "Article extraction", "Key points", "Abstract generation"],
  },
  {
    id: "seo-optimization",
    name: "SEO Optimization",
    description: "Optimize your content for search engines with AI-powered recommendations.",
    icon: Search,
    category: "marketing",
    credits: 12,
    features: ["Keyword optimization", "Meta descriptions", "Content analysis", "SEO scoring"],
  },
];

export default function AITools() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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

  const categories = [
    { id: "all", name: "All Tools", count: aiTools.length },
    { id: "content", name: "Content", count: aiTools.filter(t => t.category === "content").length },
    { id: "creative", name: "Creative", count: aiTools.filter(t => t.category === "creative").length },
    { id: "development", name: "Development", count: aiTools.filter(t => t.category === "development").length },
    { id: "analytics", name: "Analytics", count: aiTools.filter(t => t.category === "analytics").length },
    { id: "marketing", name: "Marketing", count: aiTools.filter(t => t.category === "marketing").length },
  ];

  const filteredTools = aiTools.filter(tool => {
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4" data-testid="text-ai-tools-title">
                AI Tools & Features
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto" data-testid="text-ai-tools-subtitle">
                Supercharge your projects with powerful AI capabilities
              </p>
            </div>

            {/* Credits Status */}
            <Card className="bg-gradient-to-r from-primary to-secondary text-white" data-testid="card-credits-status">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Available Credits</h3>
                    <p className="text-sm opacity-90">Use your credits to access AI tools and features</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{user?.credits || 0}</div>
                    <Badge variant="secondary" className="mt-2">
                      {user?.subscriptionPlan?.charAt(0).toUpperCase() + user?.subscriptionPlan?.slice(1) || "Free"} Plan
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Search and Categories */}
            <div className="space-y-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search AI tools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-tools"
                />
              </div>

              <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
                <TabsList className="grid w-full grid-cols-6" data-testid="tabs-categories">
                  {categories.map((category) => (
                    <TabsTrigger key={category.id} value={category.id} className="flex flex-col">
                      <span>{category.name}</span>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {category.count}
                      </Badge>
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value={selectedCategory} className="mt-8">
                  {filteredTools.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredTools.map((tool) => (
                        <ToolCard 
                          key={tool.id}
                          title={tool.name}
                          description={tool.description}
                          icon={tool.icon}
                          credits={tool.credits}
                          category={tool.category}
                          disabled={(user?.credits || 0) < tool.credits}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Bot className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2" data-testid="text-no-tools">
                          No tools found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400" data-testid="text-no-tools-subtitle">
                          Try adjusting your search or category filter.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Tool Usage Tips */}
            <Card data-testid="card-usage-tips">
              <CardHeader>
                <CardTitle>💡 Usage Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Be Specific</h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Provide detailed prompts for better AI results. Include context, style, and specific requirements.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Iterate</h4>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      Refine your prompts based on results. Each iteration helps the AI understand your needs better.
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Save Credits</h4>
                    <p className="text-sm text-purple-800 dark:text-purple-200">
                      Review your prompts before submitting. Well-crafted prompts reduce the need for regeneration.
                    </p>
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
