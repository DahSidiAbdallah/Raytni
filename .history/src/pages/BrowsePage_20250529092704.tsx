import { useState, useEffect } from 'react';
import BrowseSection from "@/components/BrowseSection";
import Header from "@/components/Header"; // Assuming you want Header on this page
import Footer from "@/components/Footer"; // Assuming you want Footer on this page
import LoadingSpinner from "@/components/LoadingSpinner";
import { useLanguage } from "@/contexts/LanguageContext";
import { db } from "@/lib/firebase"; // Firebase import
import { collection, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore"; // Firestore imports

// Updated Post interface to match Firestore data structure
interface Post {
  id: string; // Firestore document ID
  userId: string;
  title: string;
  description: string;
  category: string;
  location: {
    latitude: number;
    longitude: number;
  } | null;
  imageUrl?: string; // Optional image URL
  createdAt: Timestamp | string; // Firestore Timestamp or string representation
  status: string;
  // Fields from original interface that might not be directly in Firestore post document
  // but could be fetched from user profile or processed
  contactName?: string; 
  contactPhone?: string;
  // type: string; // This seems to be similar to category, review if needed
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
        fetchedPosts.push({
          id: doc.id,
          userId: data.userId,
          title: data.title,
          description: data.description,
          category: data.category,
          location: data.location,
          imageUrl: data.imageUrl,
          createdAt: data.createdAt, // This will be a Firestore Timestamp object
          status: data.status,
          // You might need to fetch user details (contactName, contactPhone) separately based on userId
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