// MainLayout removed; should be used at the router level only
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Phone, User } from 'lucide-react';
import { getPostById } from '@/services/postService';
import { useLanguage } from '@/contexts/LanguageContext';

const PostDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';
  const [post, setPost] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getPostById(id).then((data) => {
        setPost(data);
        if (data?.imageUrls?.length) setSelectedImage(data.imageUrls[0]);
        else if (data?.imageUrl) setSelectedImage(data.imageUrl);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[50vh]">{t('loading.text')}</div>;
  }
  if (!post) {
    return <div className="flex items-center justify-center min-h-[50vh] text-red-600">{t('error.fetchPosts')}</div>;
  }

  return (
    <div className={`max-w-2xl mx-auto px-4 py-8 ${isRTL ? 'text-right' : ''}`}> 
      <Card className="shadow-xl border-2 border-blue-100 bg-white/80 backdrop-blur-md">
        <CardContent className="p-6">
          {/* Back button and info row aligned right in RTL */}
          <div className={`flex ${isRTL ? 'flex-row-reverse justify-between' : 'flex-row justify-between'} items-center mb-4`}>
            <Button variant="outline" onClick={() => navigate(-1)} className="mb-0">{t('form.backButton') || t('nav.home')}</Button>
            <div>
              <Badge className={isRTL ? 'ml-2' : 'mr-2'}>{post.status === 'lost' ? t('browse.statusLost') : t('browse.statusFound')}</Badge>
              <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">{post.createdAt && (typeof post.createdAt === 'string' ? new Date(post.createdAt).toLocaleDateString() : post.createdAt.toDate().toLocaleDateString())}</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
          <p className="mb-4 text-gray-700">{post.description}</p>
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{t('Postcard.location')}: {post.locationName || post.location}</span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{t('Postcard.date')}: {post.dateTimeLostOrFound || post.dateTime}</span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <User className="h-4 w-4 text-primary" />
            <span>{t('Postcard.contact')}: {post.contactName}</span>
          </div>
          <div className="flex items-center gap-2 mb-6">
            <Phone className="h-4 w-4 text-primary" />
            <span>{post.contactPhone}</span>
          </div>

          {/* Image Gallery */}
          {(post.imageUrls && post.imageUrls.length > 0) || post.imageUrl ? (
            <div>
              <div className="mb-4">
                <img src={selectedImage} alt="Selected" className="w-full max-h-96 object-contain rounded-xl border mb-2" />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {post.imageUrls && post.imageUrls.length > 0 ? post.imageUrls.map((img: string, idx: number) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Photo ${idx + 1}`}
                    className={`w-20 h-20 object-cover rounded-lg border cursor-pointer ${selectedImage === img ? 'border-blue-500' : 'border-gray-200'}`}
                    onClick={() => setSelectedImage(img)}
                  />
                )) : post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    alt="Photo principale"
                    className="w-20 h-20 object-cover rounded-lg border border-blue-500"
                  />
                ) : null}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default PostDetailsPage;
