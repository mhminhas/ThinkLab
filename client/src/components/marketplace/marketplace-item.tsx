import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Star, 
  Download, 
  DollarSign 
} from "lucide-react";

interface MarketplaceItemProps {
  id: string;
  name: string;
  description: string;
  price: string;
  rating: string;
  downloads: number;
  category: string;
  authorName: string;
  authorImage?: string;
  imageUrl?: string;
  tags?: string[];
  onPurchase?: (id: string) => void;
  onPreview?: (id: string) => void;
}

export default function MarketplaceItem({
  id,
  name,
  description,
  price,
  rating,
  downloads,
  category,
  authorName,
  authorImage,
  imageUrl,
  tags = [],
  onPurchase,
  onPreview
}: MarketplaceItemProps) {
  const authorInitials = authorName.split(' ').map(n => n[0]).join('').toUpperCase();
  
  return (
    <Card className="cursor-pointer transition-all hover:shadow-lg" data-testid={`marketplace-item-${id}`}>
      {imageUrl && (
        <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-t-lg overflow-hidden">
          <img 
            src={imageUrl} 
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-1">{name}</CardTitle>
            <Badge variant="secondary" className="text-xs mt-1">
              {category}
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">
              ${price}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
          {description}
        </p>
        
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
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={authorImage} alt={authorName} />
              <AvatarFallback className="text-xs">{authorInitials}</AvatarFallback>
            </Avatar>
            <span>{authorName}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Download className="h-3 w-3" />
              <span>{downloads}</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onPreview?.(id)}
            data-testid={`button-preview-${id}`}
          >
            Preview
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => onPurchase?.(id)}
            data-testid={`button-purchase-${id}`}
          >
            <DollarSign className="h-4 w-4 mr-1" />
            Purchase
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}