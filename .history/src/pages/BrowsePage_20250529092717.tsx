import { useState, useEffect } from 'react';
import BrowseSection from "@/components/BrowseSection";
import Header from "@/components/Header"; // Assuming you want Header on this page
import Footer from "@/components/Footer"; // Assuming you want Footer on this page
import LoadingSpinner from "@/components/LoadingSpinner";
import { useLanguage } from "@/contexts/LanguageContext";
import { db } from "@/lib/firebase"; // Firebase import
import { collection, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore"; // Firestore imports

// Updated Post interface to reconcile Firestore data and BrowseSection expectations
interface Post {
  id: string; // Firestore document ID
  userId: string;
  title: string;
  description: string;
  category: string; // From Firestore
  location: {
    latitude: number;
    longitude: number;
  } | null;
  imageUrl?: string;
  createdAt: Timestamp | string; // Firestore Timestamp
  status: string;

  // Fields potentially expected by BrowseSection
  type?: string; // Will map from category
  dateTime?: string; // Will map from createdAt
  contactName?: string; 
  contactPhone?: string;
}

const BrowsePage = () => {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const postsCollection = collection(db, "posts");
    const q = query(postsCollection, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedPosts: Post[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Convert Firestore Timestamp to a string for dateTime if needed by BrowseSection
        // You might need a more sophisticated date formatting function here
        const createdAtTimestamp = data.createdAt as Timestamp;
        const dateTimeString = createdAtTimestamp && typeof createdAtTimestamp.toDate === 'function' 
                                ? createdAtTimestamp.toDate().toISOString() 
                                : String(data.createdAt);

        fetchedPosts.push({
          id: doc.id,
          userId: data.userId,
          title: data.title,
          description: data.description,
          category: data.category,
          location: data.location,
          imageUrl: data.imageUrl,
          createdAt: data.createdAt, 
          status: data.status,
          // Mapping Firestore fields to potential BrowseSection fields
          type: data.category, // Assuming category can be used as type
          dateTime: dateTimeString, 
          // contactName and contactPhone would still need to be fetched if required by BrowseSection
        });
      });
      setPosts(fetchedPosts);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching posts: ", error);
      setIsLoading(false);
      // Optionally, set an error state here to display to the user
    });

    // Cleanup subscription on component unmount
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
      <Header onCreatePost={() => {}} onViewBrowse={() => {}} onViewHome={() => {}} /> {/* Adjust props as needed */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <BrowseSection posts={posts} onBack={() => window.history.back()} /> {/* Or navigate to '/' */}
      </main>
      <Footer />
    </div>
  );
};

export default BrowsePage; 