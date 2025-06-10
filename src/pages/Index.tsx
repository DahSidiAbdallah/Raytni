import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, getDocs, Timestamp } from "firebase/firestore";

type View = "home";

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
}

const Index = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);

  // Fetch recent posts on component mount
  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const postsCollection = collection(db, "posts");
        const q = query(postsCollection, orderBy("createdAt", "desc"), limit(3));
        const querySnapshot = await getDocs(q);
        
        const posts: Post[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const firestoreTimestamp = data.createdAt as Timestamp;
          
          posts.push({
            id: doc.id,
            title: data.title || "",
            description: data.description || "",
            category: data.subCategory || "",
            type: data.category || "",
            location: data.locationName || "Lieu non spécifié",
            dateTime: data.dateTimeLostOrFound || (firestoreTimestamp ? firestoreTimestamp.toDate().toISOString() : new Date().toISOString()),
            contactName: data.contactName || "N/A",
            contactPhone: data.contactPhone || "N/A",
            status: data.status || "lost",
            createdAt: firestoreTimestamp ? firestoreTimestamp.toDate().toISOString() : new Date().toISOString(),
            imageUrl: data.imageUrl || "",
          });
        });
        
        setRecentPosts(posts);
      } catch (error) {
        console.error("Error fetching recent posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  const handleCreatePost = () => {
    navigate("/create-post");
  };

  const handleViewBrowse = () => {
    navigate("/browse");
  };

  const handleViewHome = () => {
    // Already on home page
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg\" text={t('loading.text')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header
        onCreatePost={handleCreatePost}
        onViewBrowse={handleViewBrowse}
        onViewHome={handleViewHome}
      />
      
      <main>
        <HeroSection
          onCreatePost={handleCreatePost}
          onViewBrowse={handleViewBrowse}
        />
        
        {/* Recent Posts Preview */}
        <section className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('home.recentPosts')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('home.recentPosts.subtitle')}
            </p>
          </div>
          
          {recentPosts.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {recentPosts.map((post, index) => (
                <div 
                  key={post.id} 
                  className="bg-white rounded-2xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-2 rounded-full text-sm font-semibold ${
                      post.status === "lost" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                    }`}>
                      {post.status === "lost" ? `🔴 ${t('status.lost')}` : `🟢 ${t('status.found')}`}
                    </span>
                    <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                      {new Date(post.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{post.description}</p>
                  <p className="text-sm text-blue-600 font-medium bg-blue-50 p-2 rounded-lg">📍 {post.location}</p>
                </div>
              ))}
            </div>
          )}
          
          {recentPosts.length > 0 && (
            <div className="text-center animate-fade-in">
              <button
                onClick={handleViewBrowse}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {t('home.viewAll')}
              </button>
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;