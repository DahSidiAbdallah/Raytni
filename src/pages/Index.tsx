import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import HeroSection from "@/components/HeroSection";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, getDocs, Timestamp } from "firebase/firestore";
import PostCard from "@/components/PostCard";
import { DisplayPost } from '@/types/post';

const Index = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [recentPosts, setRecentPosts] = useState<DisplayPost[]>([]);

  const handleBrowse = () => navigate('/browse');
  const handleCreatePost = () => navigate('/create-post');

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const postsCollection = collection(db, "posts");
        const q = query(postsCollection, orderBy("createdAt", "desc"), limit(5));
        const querySnapshot = await getDocs(q);
        
        const fetchedPosts = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const firestoreTimestamp = data.createdAt as Timestamp;
          const createdAtDate = firestoreTimestamp ? firestoreTimestamp.toDate() : new Date();

          return {
            id: doc.id,
            type: data.category,
            category: data.subCategory || data.category,
            title: data.title,
            description: data.description,
            location: data.locationName || "Location not specified",
            dateTime: data.dateTimeLostOrFound || createdAtDate.toISOString(),
            contactName: data.contactName || "N/A",
            contactPhone: data.contactPhone || "N/A",
            status: data.status,
            createdAt: createdAtDate.toISOString(),
            imageUrl: data.imageUrl
          } as DisplayPost;
        });

        setRecentPosts(fetchedPosts);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching recent posts:", error);
        toast({
          title: t('error.fetchPosts'),
          description: t('error.tryAgain'),
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchRecentPosts();
  }, [t]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text={t('loading.text')} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection 
        onCreatePost={handleCreatePost}
        onViewBrowse={handleBrowse}
      />
      
      {/* Recent Posts Section - Now more prominent */}
      <section className="max-w-7xl mx-auto px-4 py-16 w-full">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            {t('home.recentPosts')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('home.recentPosts.subtitle')}
          </p>
        </div>
        
        {recentPosts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-300 text-8xl mb-6">📢</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">{t('home.noPosts')}</h3>
            <p className="text-gray-600 mb-8 text-lg">{t('home.noPosts.subtitle')}</p>
            <button
              onClick={handleCreatePost}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {t('home.createPost')}
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
            {recentPosts.map((post, index) => (
              <div key={post.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in">
                <PostCard post={post} />
              </div>
            ))}
          </div>
        )}
        
        {recentPosts.length > 0 && (
          <div className="text-center mt-16">
            <button
              onClick={handleBrowse}
              className="bg-white text-primary border-2 border-primary px-8 py-4 rounded-xl font-medium transition-all duration-200 transform hover:shadow-md hover:translate-y-[-1px] hover:bg-primary/10"
            >
              {t('home.viewAll')}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;