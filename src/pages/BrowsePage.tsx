import { useState, useEffect } from 'react';
import BrowseSection from "@/components/BrowseSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useLanguage } from "@/contexts/LanguageContext";
import { getPosts, Post, PostFilter } from "@/services/postService";

// This interface defines the structure of post objects after processing Firestore data
// for use in this component and passed to BrowseSection.
interface DisplayPost {
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

const BrowsePage = () => {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<DisplayPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const fetchedPosts = await getPosts();
        
        // Convert the posts from the service format to the display format
        const displayPosts = fetchedPosts.map(post => mapToDisplayPost(post));
        
        setPosts(displayPosts);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Une erreur est survenue lors du chargement des signalements.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Function to map a Post from the service to a DisplayPost for the UI
  const mapToDisplayPost = (post: Post): DisplayPost => {
    return {
      id: post.id,
      type: post.category, // Map category to type for BrowseSection
      category: post.subCategory,
      title: post.title,
      description: post.description,
      location: post.locationName,
      dateTime: post.dateTimeLostOrFound || post.createdAt.toDate().toISOString(),
      contactName: post.contactName,
      contactPhone: post.contactPhone,
      status: post.status,
      createdAt: post.createdAt.toDate().toISOString(),
      imageUrl: post.imageUrl
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text={t('loading.text')} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onCreatePost={() => {}} 
        onViewBrowse={() => {}} 
        onViewHome={() => {}} 
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        <BrowseSection posts={posts} onBack={() => window.history.back()} />
      </main>
      <Footer />
    </div>
  );
};

export default BrowsePage;