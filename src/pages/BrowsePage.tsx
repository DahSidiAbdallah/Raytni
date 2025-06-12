import { useState, useEffect } from 'react';
import BrowseSection from "@/components/BrowseSection";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useLanguage } from "@/contexts/LanguageContext";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { DisplayPost } from '@/types/post';

const BrowsePage = () => {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<DisplayPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const postsCollection = collection(db, "posts");
    const q = query(postsCollection, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedPosts = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const firestoreTimestamp = data.createdAt as Timestamp;
        return {
          id: doc.id,
          type: data.category,
          category: data.subCategory || data.category,
          title: data.title,
          description: data.description,
          location: data.locationName || "Location not specified",
          dateTime: data.dateTimeLostOrFound || firestoreTimestamp.toDate().toISOString(),
          contactName: data.contactName || "N/A",
          contactPhone: data.contactPhone || "N/A",
          status: data.status,
          createdAt: firestoreTimestamp.toDate().toISOString(),
          imageUrl: data.imageUrl
        } as DisplayPost;
      });
      
      setPosts(fetchedPosts);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" text={t('loading.text')} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <BrowseSection posts={posts} />
    </div>
  );
};

export default BrowsePage;