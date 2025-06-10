
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CreatePostForm from "@/components/CreatePostForm";
import BrowseSection from "@/components/BrowseSection";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useLanguage } from "@/contexts/LanguageContext";

type View = "home" | "create" | "browse";

interface Post {
  id: number;
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
}

const Index = () => {
  const { t } = useLanguage();
  const [currentView, setCurrentView] = useState<View>("home");
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      type: "personne",
      category: "Enfant",
      title: "Enfant perdu au marché central de Nouakchott",
      description: "Petite fille de 8 ans, cheveux courts, portait une robe bleue. Vue pour la dernière fois près des étals de légumes.",
      location: "Nouakchott",
      dateTime: "2024-05-26T14:30:00",
      contactName: "Aminata Ba",
      contactPhone: "+222 22 33 44 55",
      status: "lost",
      createdAt: "2024-05-26T15:00:00"
    },
    {
      id: 2,
      type: "objet",
      category: "Téléphone",
      title: "Téléphone Samsung trouvé à la plage",
      description: "Samsung Galaxy S20, coque noire, trouvé sur la plage de Nouadhibou ce matin.",
      location: "Nouadhibou",
      dateTime: "2024-05-27T08:00:00",
      contactName: "Mohamed Ould Ahmed",
      contactPhone: "+222 33 44 55 66",
      status: "found",
      createdAt: "2024-05-27T09:00:00"
    }
  ]);

  const handleCreatePost = () => {
    setCurrentView("create");
  };

  const handleViewBrowse = () => {
    setIsLoading(true);
    // Simulate loading time for better UX
    setTimeout(() => {
      setCurrentView("browse");
      setIsLoading(false);
    }, 500);
  };

  const handleViewHome = () => {
    setCurrentView("home");
  };

  const handleSubmitPost = (newPost: Post) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPosts([newPost, ...posts]);
      setCurrentView("home");
      setIsLoading(false);
      toast({
        title: t('toast.success'),
        description: t('toast.success.desc'),
      });
    }, 1000);
  };

  const renderCurrentView = () => {
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" text={t('loading.text')} />
        </div>
      );
    }

    switch (currentView) {
      case "create":
        return (
          <CreatePostForm
            onBack={handleViewHome}
            onSubmit={handleSubmitPost}
          />
        );
      case "browse":
        return (
          <BrowseSection
            posts={posts}
            onBack={handleViewHome}
          />
        );
      default:
        return (
          <>
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
              
              {posts.length === 0 ? (
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
                  {posts.slice(0, 3).map((post, index) => (
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
              
              {posts.length > 3 && (
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
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header
        onCreatePost={handleCreatePost}
        onViewBrowse={handleViewBrowse}
        onViewHome={handleViewHome}
      />
      
      <main>
        {renderCurrentView()}
      </main>
      
      {currentView === "home" && <Footer />}
    </div>
  );
};

export default Index;
