import { MapPin, Calendar, Phone, User, Eye, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useLanguage } from "@/contexts/LanguageContext";

interface Post {
  id: string;
  type: string;
  category: string;
  title: string;
  description: string;
  location: string;
  dateTime: string;
  contactName: string;
  contactPhone: string;
  status: string;
  createdAt: string;
  imageUrl?: string;
  imageUrls?: string[];
  mainImageUrl?: string;
}

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    return status === "lost" ? "bg-red-500 hover:bg-red-600 hover:shadow-md" : "bg-green-500 hover:bg-green-600 hover:shadow-md";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "personne":
        return "👤";
      case "objet":
        return "📦";
      case "animal":
        return "🐾";
      default:
        return "📍";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Get the image to display (main image or first available)
  const displayImage = post.mainImageUrl || post.imageUrl || (post.imageUrls && post.imageUrls.length > 0 ? post.imageUrls[0] : null);

  return (
    <Card className="hover:shadow-md hover:translate-y-[-1px] transition-all duration-200 border border-border group cursor-pointer" onClick={() => navigate(`/post/${post.id}`)}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div className="text-xl p-1.5 bg-secondary rounded-sm group-hover:bg-primary/10 transition-colors">
              {getTypeIcon(post.type)}
            </div>
            <Badge className={`${post.status === "lost" ? "bg-destructive" : "bg-accent"} text-white px-2 py-0.5 text-xs font-medium rounded-sm`}>
              {post.status === "lost" ? t('browse.statusLost') : t('browse.statusFound')}
            </Badge>
          </div>
        </div>

        {displayImage && (
          <div className="mb-3 aspect-video rounded-sm overflow-hidden">
            <img 
              src={displayImage} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <h3 className="text-lg font-medium text-foreground mb-2 group-hover:text-primary transition-colors duration-200 line-clamp-2">
          {post.title}
        </h3>
        
        <p className={`text-muted-foreground mb-3 text-sm leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
          {post.description}
        </p>

        {post.description.length > 150 && (
          <button
            onClick={e => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
            className="text-primary hover:text-primary/80 hover:translate-x-1 transition-transform duration-200 text-xs font-medium mb-3 flex items-center gap-1"
          >
            <Eye className="h-3 w-3" />
            {isExpanded ? t('browse.seeLess') : t('browse.seeMore')}
          </button>
        )}

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-foreground bg-secondary p-2 rounded-sm text-sm">
            <MapPin className="h-3.5 w-3.5 mr-2 text-primary flex-shrink-0" />
            <span>{t('Postcard.location')}: {post.location}</span>
          </div>
        </div>

        <Button 
          className="w-full"
          onClick={e => { e.stopPropagation(); window.open(`tel:${post.contactPhone}`, '_self'); }}
        >
          <Phone className="h-3.5 w-3.5 mr-2" />
          <span>{t('Postcard.actions.contact')}: {post.contactPhone}</span>
          <ExternalLink className="h-3 w-3 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default PostCard;