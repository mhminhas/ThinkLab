import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import MarketplaceItem from "@/components/marketplace/marketplace-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, TrendingUp, Star, Download } from "lucide-react";

export default function Marketplace() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

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

  const { data: marketplaceItems = [], isLoading: itemsLoading } = useQuery({
    queryKey: ["/api/marketplace"],
    enabled: !!isAuthenticated,
    retry: false,
  });

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "Content Creation", name: "Content Creation" },
    { id: "Image Generation", name: "Image Generation" },
    { id: "Code Generation", name: "Code Generation" },
    { id: "Data Analysis", name: "Data Analysis" },
    { id: "SEO", name: "SEO Optimization" },
    { id: "Collaboration", name: "Team Collaboration" },
  ];

  const sortOptions = [
    { id: "popular", name: "Most Popular" },
    { id: "newest", name: "Newest" },
    { id: "price-low", name: "Price: Low to High" },
    { id: "price-high", name: "Price: High to Low" },
    { id: "rating", name: "Highest Rated" },
  ];

  const filteredAndSortedItems = marketplaceItems
    .filter((item: any) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "price-low":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price-high":
          return parseFloat(b.price) - parseFloat(a.price);
        case "rating":
          return parseFloat(b.rating) - parseFloat(a.rating);
        case "popular":
        default:
          return (b.downloads || 0) - (a.downloads || 0);
      }
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4" data-testid="text-marketplace-title">
                AI Tools Marketplace
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto" data-testid="text-marketplace-subtitle">
                Discover, share, and purchase AI-powered templates and tools created by our community
              </p>
            </div>

            {/* Featured Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card data-testid="stat-total-templates">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Templates</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{marketplaceItems.length}</p>
                    </div>
                    <div className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center">
                      <Download className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="stat-categories">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{categories.length - 1}</p>
                    </div>
                    <div className="w-10 h-10 bg-secondary text-white rounded-lg flex items-center justify-center">
                      <Filter className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="stat-top-rated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Rating</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {marketplaceItems.length > 0 
                          ? (marketplaceItems.reduce((sum: number, item: any) => sum + parseFloat(item.rating || 0), 0) / marketplaceItems.length).toFixed(1)
                          : "0.0"
                        }
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-accent text-white rounded-lg flex items-center justify-center">
                      <Star className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filter Bar */}
            <Card data-testid="card-search-filters">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search templates and tools..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                        data-testid="input-search-marketplace"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-[200px]" data-testid="select-category-filter">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[200px]" data-testid="select-sort-by">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Marketplace Grid */}
            {itemsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
              </div>
            ) : filteredAndSortedItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAndSortedItems.map((item: any) => (
                  <Card key={item.id} className="border transition-colors hover:border-primary/50">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                        <Badge variant="secondary">{item.category}</Badge>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">${item.price || 'Free'}</span>
                        <Button size="sm">Download</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2" data-testid="text-no-items">
                    No items found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400" data-testid="text-no-items-subtitle">
                    Try adjusting your search or filter criteria.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Call to Action */}
            <Card className="bg-gradient-to-r from-primary to-secondary text-white" data-testid="card-cta">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Share Your AI Tools</h3>
                <p className="text-lg opacity-90 mb-6">
                  Create and sell your own AI templates and tools in the marketplace
                </p>
                <Button variant="secondary" size="lg" data-testid="button-submit-template">
                  Submit Your Template
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
