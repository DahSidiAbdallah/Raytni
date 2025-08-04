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
    return status === "lost" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600";
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
    <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg group cursor-pointer" onClick={() => navigate(`/post/${post.id}`)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl p-2 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
              {getTypeIcon(post.type)}
            </div>
            <Badge className={`${getStatusColor(post.status)} text-white px-3 py-1 font-medium`}>
              {post.status === "lost" ? t('browse.statusLost') : t('browse.statusFound')}
            </Badge>
          </div>
          {/* Removed date display */}
        </div>

        {displayImage && (
          <div className="mb-4 aspect-video rounded-lg overflow-hidden">
            <img 
              src={displayImage} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
          {post.title}
        </h3>
        
        <p className={`text-gray-600 mb-4 leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
          {post.description}
        </p>

        {post.description.length > 150 && (
          <button
            onClick={e => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4 flex items-center gap-1"
          >
            <Eye className="h-3 w-3" />
            {isExpanded ? t('browse.seeLess') : t('browse.seeMore')}
          </button>
        )}

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
            <MapPin className="h-4 w-4 mr-3 text-blue-600 flex-shrink-0" />
            <span className="font-medium">{post.location}</span>
          </div>
          {/* Removed date and contactName from card */}
        </div>

        <Button 
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          onClick={e => { e.stopPropagation(); window.open(`tel:${post.contactPhone}`, '_self'); }}
        >
          <Phone className="h-4 w-4 mr-2" />
          <span className="font-medium">Contacter: {post.contactPhone}</span>
          <ExternalLink className="h-3 w-3 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default PostCard;