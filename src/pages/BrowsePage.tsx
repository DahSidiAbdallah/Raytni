import { useState, useEffect } from 'react';
import BrowseSection from "@/components/BrowseSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useLanguage } from "@/contexts/LanguageContext";
import { db } from "@/lib/firebase"; // Firebase import
import { collection, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore"; // Firestore imports
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// This interface defines the structure of post objects after processing Firestore data
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
  imageUrls?: string[];
  mainImageUrl?: string;
  firestoreCreatedAt: Timestamp;
  subCategory?: string;
}

const BrowsePage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<DisplayPost[]>([]); // Use DisplayPost
  const [isLoading, setIsLoading] = useState(true);

  const handleCreatePost = () => {
    navigate('/create-post');
  };

  const handleViewBrowse = () => {
    navigate('/browse');
  };

  const handleViewHome = () => {
    navigate('/');
  };

  useEffect(() => {
    setIsLoading(true);
    const postsCollection = collection(db, "posts");
    const q = query(postsCollection, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedPosts: DisplayPost[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const firestoreTimestamp = data.createdAt as Timestamp;
        
        let validDateTimeLostOrFoundISO: string | null = null;
        if (data.dateTimeLostOrFound) {
          const eventDate = new Date(data.dateTimeLostOrFound);
          if (!isNaN(eventDate.getTime())) {
            validDateTimeLostOrFoundISO = eventDate.toISOString();
          }
        }
        
        const createdAtISO = firestoreTimestamp ? firestoreTimestamp.toDate().toISOString() : new Date().toISOString();
        
        const displayPost: DisplayPost = {
          id: doc.id, 
          title: data.title,
          description: data.description,
          category: data.category, 
          subCategory: data.subCategory, 
          type: data.category, 
          location: data.locationName || "Lieu non spécifié", 
          dateTime: validDateTimeLostOrFoundISO || createdAtISO, 
          createdAt: createdAtISO, 
          status: data.status,
          imageUrl: data.mainImageUrl || data.imageUrl, // Use mainImageUrl if available
          imageUrls: data.imageUrls || [],
          mainImageUrl: data.mainImageUrl,
          firestoreCreatedAt: firestoreTimestamp,
          contactName: data.contactName || "N/A", 
          contactPhone: data.contactPhone || "N/A", 
        };
        fetchedPosts.push(displayPost);
      });
      setPosts(fetchedPosts);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching posts:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg\" text={t('loading.text')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onCreatePost={handleCreatePost}
        onViewBrowse={handleViewBrowse}
        onViewHome={handleViewHome}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        <BrowseSection posts={posts} onBack={() => window.history.back()} />
      </main>
      <Footer />
    </div>
  );
};

export default BrowsePage;