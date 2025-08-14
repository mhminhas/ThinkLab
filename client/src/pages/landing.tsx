import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/ui/theme-provider";
import { 
  Moon, 
  Sun, 
  Bot, 
  Image, 
  Code, 
  BarChart3, 
  Search, 
  Users,
  Check,
  X,
  Star,
  Github,
  Twitter,
  Linkedin,
  MessageCircle
} from "lucide-react";

export default function Landing() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary" data-testid="logo">ThinkLab</h1>
              </div>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-primary px-3 py-2 text-sm font-medium" data-testid="link-features">Features</a>
                  <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-primary px-3 py-2 text-sm font-medium" data-testid="link-pricing">Pricing</a>
                  <a href="#marketplace" className="text-gray-600 dark:text-gray-300 hover:text-primary px-3 py-2 text-sm font-medium" data-testid="link-marketplace">Marketplace</a>
                  <a href="#docs" className="text-gray-600 dark:text-gray-300 hover:text-primary px-3 py-2 text-sm font-medium" data-testid="link-docs">API Docs</a>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                data-testid="button-theme-toggle"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" onClick={handleLogin} data-testid="button-signin">
                Sign In
              </Button>
              <Button onClick={handleLogin} data-testid="button-trial">
                Start Free Trial
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6" data-testid="text-hero-title">
              AI-Powered Project Management
              <span className="text-primary"> Reimagined</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8" data-testid="text-hero-description">
              Create, manage, and collaborate on projects with cutting-edge AI tools. From content generation to data analysis, ThinkLab empowers your team to achieve more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={handleLogin} data-testid="button-hero-trial">
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg" data-testid="button-hero-demo">
                Watch Demo
              </Button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4" data-testid="text-hero-subtitle">
              No credit card required • 10 free credits included
            </p>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4" data-testid="text-features-title">
              Powerful AI Tools at Your Fingertips
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto" data-testid="text-features-description">
              Everything you need to supercharge your projects with artificial intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow" data-testid="card-feature-content">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center mb-4">
                  <Bot className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Content Generation</h3>
                <p className="text-gray-600 dark:text-gray-300">Create high-quality content, blog posts, and marketing copy with advanced AI assistance.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow" data-testid="card-feature-image">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary text-white rounded-lg flex items-center justify-center mb-4">
                  <Image className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Image Generation</h3>
                <p className="text-gray-600 dark:text-gray-300">Generate stunning visuals and artwork for your projects using state-of-the-art AI models.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow" data-testid="card-feature-code">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent text-white rounded-lg flex items-center justify-center mb-4">
                  <Code className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Code Generation</h3>
                <p className="text-gray-600 dark:text-gray-300">Accelerate development with AI-powered code generation and debugging assistance.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow" data-testid="card-feature-analysis">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-yellow-500 text-white rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Data Analysis</h3>
                <p className="text-gray-600 dark:text-gray-300">Extract insights from your data with intelligent analysis and visualization tools.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow" data-testid="card-feature-seo">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-red-500 text-white rounded-lg flex items-center justify-center mb-4">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">SEO Optimization</h3>
                <p className="text-gray-600 dark:text-gray-300">Optimize your content for search engines with AI-powered SEO recommendations.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow" data-testid="card-feature-collaboration">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-indigo-500 text-white rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Team Collaboration</h3>
                <p className="text-gray-600 dark:text-gray-300">Work together in real-time with advanced collaboration and project management tools.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4" data-testid="text-pricing-title">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto" data-testid="text-pricing-description">
              Flexible pricing to fit teams of all sizes. Start free, scale as you grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Free Trial */}
            <Card className="border border-gray-200 dark:border-gray-600" data-testid="card-plan-free">
              <CardContent className="p-8">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Free Trial</h3>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">$0</div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">Perfect for trying out our platform</p>
                  <Button variant="outline" className="w-full" data-testid="button-plan-free">
                    Start Free Trial
                  </Button>
                </div>
                <ul className="mt-8 space-y-3">
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Check className="h-4 w-4 text-green-500 mr-3" />
                    10 AI credits included
                  </li>
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Check className="h-4 w-4 text-green-500 mr-3" />
                    Access to basic AI tools
                  </li>
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Check className="h-4 w-4 text-green-500 mr-3" />
                    3 projects maximum
                  </li>
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <X className="h-4 w-4 text-red-500 mr-3" />
                    No team collaboration
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Starter */}
            <Card className="border border-gray-200 dark:border-gray-600" data-testid="card-plan-starter">
              <CardContent className="p-8">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Starter</h3>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    $5<span className="text-lg text-gray-500">/month</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">Great for individual creators</p>
                  <Button className="w-full" data-testid="button-plan-starter">
                    Get Started
                  </Button>
                </div>
                <ul className="mt-8 space-y-3">
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Check className="h-4 w-4 text-green-500 mr-3" />
                    100 AI credits/month
                  </li>
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Check className="h-4 w-4 text-green-500 mr-3" />
                    All AI tools access
                  </li>
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Check className="h-4 w-4 text-green-500 mr-3" />
                    Unlimited projects
                  </li>
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Check className="h-4 w-4 text-green-500 mr-3" />
                    Email support
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Pro */}
            <Card className="border-2 border-primary relative" data-testid="card-plan-pro">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-accent text-white">Most Popular</Badge>
              </div>
              <CardContent className="p-8 bg-primary text-white">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Pro</h3>
                  <div className="text-3xl font-bold mb-4">
                    $15<span className="text-lg opacity-75">/month</span>
                  </div>
                  <p className="opacity-75 mb-6">Perfect for growing businesses</p>
                  <Button variant="secondary" className="w-full" data-testid="button-plan-pro">
                    Get Started
                  </Button>
                </div>
                <ul className="mt-8 space-y-3">
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-400 mr-3" />
                    500 AI credits/month
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-400 mr-3" />
                    Priority AI processing
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-400 mr-3" />
                    Advanced analytics
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-400 mr-3" />
                    API access
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-400 mr-3" />
                    Priority support
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Team */}
            <Card className="border border-gray-200 dark:border-gray-600" data-testid="card-plan-team">
              <CardContent className="p-8">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Team</h3>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    $25<span className="text-lg text-gray-500">/user/month</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">Built for collaborative teams</p>
                  <Button variant="secondary" className="w-full" data-testid="button-plan-team">
                    Get Started
                  </Button>
                </div>
                <ul className="mt-8 space-y-3">
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Check className="h-4 w-4 text-green-500 mr-3" />
                    1000 AI credits/user/month
                  </li>
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Check className="h-4 w-4 text-green-500 mr-3" />
                    Real-time collaboration
                  </li>
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Check className="h-4 w-4 text-green-500 mr-3" />
                    Team management tools
                  </li>
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Check className="h-4 w-4 text-green-500 mr-3" />
                    Custom integrations
                  </li>
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Check className="h-4 w-4 text-green-500 mr-3" />
                    Dedicated support
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-300 mb-4" data-testid="text-enterprise">
              Need something bigger?
            </p>
            <Button variant="outline" size="lg" data-testid="button-enterprise">
              Contact Sales for Enterprise
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4" data-testid="text-footer-brand">ThinkLab</h3>
              <p className="text-gray-400 mb-4" data-testid="text-footer-description">
                AI-powered project management platform for modern teams.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white" data-testid="link-twitter">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white" data-testid="link-linkedin">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white" data-testid="link-github">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white" data-testid="link-discord">
                  <MessageCircle className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white" data-testid="link-features-footer">Features</a></li>
                <li><a href="#" className="hover:text-white" data-testid="link-pricing-footer">Pricing</a></li>
                <li><a href="#" className="hover:text-white" data-testid="link-marketplace-footer">Marketplace</a></li>
                <li><a href="#" className="hover:text-white" data-testid="link-api-footer">API</a></li>
                <li><a href="#" className="hover:text-white" data-testid="link-integrations">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white" data-testid="link-about">About Us</a></li>
                <li><a href="#" className="hover:text-white" data-testid="link-careers">Careers</a></li>
                <li><a href="#" className="hover:text-white" data-testid="link-blog">Blog</a></li>
                <li><a href="#" className="hover:text-white" data-testid="link-press">Press</a></li>
                <li><a href="#" className="hover:text-white" data-testid="link-contact">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white" data-testid="link-help">Help Center</a></li>
                <li><a href="#" className="hover:text-white" data-testid="link-documentation">Documentation</a></li>
                <li><a href="#" className="hover:text-white" data-testid="link-status">Status</a></li>
                <li><a href="#" className="hover:text-white" data-testid="link-privacy">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white" data-testid="link-terms">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400" data-testid="text-copyright">
              &copy; 2024 ThinkLab. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm" data-testid="link-privacy-footer">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm" data-testid="link-terms-footer">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm" data-testid="link-cookies">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
