import { useState, useEffect } from 'react';
import BrowseSection from "@/components/BrowseSection";
import Header from "@/components/Header"; // Assuming you want Header on this page
import Footer from "@/components/Footer"; // Assuming you want Footer on this page
import LoadingSpinner from "@/components/LoadingSpinner";
import { useLanguage } from "@/contexts/LanguageContext";
import { db } from "@/lib/firebase"; // Firebase import
import { collection, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore"; // Firestore imports
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// This interface defines the structure of post objects after processing Firestore data
// for use in this component and passed to BrowseSection.
interface DisplayPost {
  id: string; // Firestore ID, now directly used
  type: string; // Mapped from category
  category: string; // Original category
  title: string;
  description: string;
  location: string; // This will be locationName from Firestore
  dateTime: string; // Mapped from createdAt
  contactName: string; // Placeholder
  contactPhone: string; // Placeholder
  status: string;
  createdAt: string; // String version of original createdAt 
  // Fields from Firestore that might not be directly used by BrowseSection but useful here
  // userId: string; // Removed userId as it's no longer in Firestore post documents
  imageUrl?: string;
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
      console.log("[BrowsePage] onSnapshot triggered. Docs count:", querySnapshot.docs.length);
      const fetchedPosts: DisplayPost[] = [];
      querySnapshot.forEach((doc) => {
        console.log("[BrowsePage] Post ID:", doc.id, "Data:", doc.data());
        const data = doc.data();
        const firestoreTimestamp = data.createdAt as Timestamp;
        
        let validDateTimeLostOrFoundISO: string | null = null;
        if (data.dateTimeLostOrFound) {
          const eventDate = new Date(data.dateTimeLostOrFound);
          if (!isNaN(eventDate.getTime())) {
            validDateTimeLostOrFoundISO = eventDate.toISOString();
          } else {
            console.warn(`[BrowsePage] Invalid dateTimeLostOrFound value: ${data.dateTimeLostOrFound} for post ID: ${doc.id}`);
          }
        }
        
        const createdAtISO = firestoreTimestamp ? firestoreTimestamp.toDate().toISOString() : new Date().toISOString();
        
        const locationDisplay = data.locationName || "Lieu non spécifié";

        const displayPost: DisplayPost = {
          id: doc.id, 
          title: data.title,
          description: data.description,
          category: data.category, 
          subCategory: data.subCategory, 
          type: data.category, 
          location: locationDisplay, 
          dateTime: validDateTimeLostOrFoundISO || createdAtISO, 
          createdAt: createdAtISO, 
          status: data.status,
          imageUrl: data.imageUrl,
          firestoreCreatedAt: firestoreTimestamp,
          contactName: data.contactName || "N/A", 
          contactPhone: data.contactPhone || "N/A", 
        };
        fetchedPosts.push(displayPost);
      });
      setPosts(fetchedPosts);
      setIsLoading(false);
    }, (error) => {
      console.error("[BrowsePage] Error fetching posts: ", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text={t('loading.text')} />
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
        <BrowseSection posts={posts} onBack={() => window.history.back()} /> {/* Or navigate to '/' */}
      </main>
      <Footer />
    </div>
  );
};

export default BrowsePage;