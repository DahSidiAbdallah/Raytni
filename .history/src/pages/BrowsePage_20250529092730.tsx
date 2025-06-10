import { useState, useEffect } from 'react';
import BrowseSection from "@/components/BrowseSection";
import Header from "@/components/Header"; // Assuming you want Header on this page
import Footer from "@/components/Footer"; // Assuming you want Footer on this page
import LoadingSpinner from "@/components/LoadingSpinner";
import { useLanguage } from "@/contexts/LanguageContext";
import { db } from "@/lib/firebase"; // Firebase import
import { collection, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore"; // Firestore imports

// Define Post interface based on Firestore data structure
// If BrowseSection or other components expect a different structure,
// they might need adaptation or a mapping utility.
interface Post {
  id: string; // Firestore document ID is a string
  userId: string;
  title: string;
  description: string;
  category: string;
  location: {
    latitude: number;
    longitude: number;
  } | null;
  imageUrl?: string;
  createdAt: Timestamp; // Keep as Firestore Timestamp initially
  status: string;

  // Optional fields that might be added or mapped later for display purposes
  type?: string; 
  dateTime?: string;
  contactName?: string;
  contactPhone?: string;
}

const BrowsePage = () => {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]); // This should now be consistent
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const postsCollection = collection(db, "posts");
    const q = query(postsCollection, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedPosts: Post[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Create the Post object with type assertion for createdAt
        const post: Post = {
          id: doc.id,
          userId: data.userId,
          title: data.title,
          description: data.description,
          category: data.category,
          location: data.location,
          imageUrl: data.imageUrl,
          createdAt: data.createdAt as Timestamp, // Asserting type from Firestore
          status: data.status,
          // `type` and `dateTime` can be mapped here if needed by BrowseSection
          // For example: 
          // type: data.category,
          // dateTime: (data.createdAt as Timestamp).toDate().toISOString(),
        };
        fetchedPosts.push(post);
      });
      setPosts(fetchedPosts);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching posts: ", error);
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
      <Header onCreatePost={() => {}} onViewBrowse={() => {}} onViewHome={() => {}} /> {/* Adjust props as needed */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <BrowseSection posts={posts} onBack={() => window.history.back()} /> {/* Or navigate to '/' */}
      </main>
      <Footer />
    </div>
  );
};

export default BrowsePage; 