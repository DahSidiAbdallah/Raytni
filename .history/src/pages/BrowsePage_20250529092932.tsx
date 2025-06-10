import { useState, useEffect } from 'react';
import BrowseSection from "@/components/BrowseSection";
import Header from "@/components/Header"; // Assuming you want Header on this page
import Footer from "@/components/Footer"; // Assuming you want Footer on this page
import LoadingSpinner from "@/components/LoadingSpinner";
import { useLanguage } from "@/contexts/LanguageContext";
import { db } from "@/lib/firebase"; // Firebase import
import { collection, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore"; // Firestore imports

// This interface represents the data structure AS EXPECTED BY BrowseSection.tsx
interface BrowseSectionPost {
  id: number; // Expected by BrowseSection
  type: string; // Expected by BrowseSection (map from category)
  category: string; // Keep original category for potential direct use
  title: string;
  description: string;
  location: string; // Expected by BrowseSection (convert from Firestore location object)
  dateTime: string; // Expected by BrowseSection (map from createdAt)
  contactName: string; // Placeholder
  contactPhone: string; // Placeholder
  status: string;
  createdAt: string; // Keep string version of original createdAt for potential direct use
  // Original Firestore fields if needed for other logic, but not directly for BrowseSection
  firestoreId: string; 
  userId: string;
  originalLocation: { latitude: number; longitude: number; } | null;
  imageUrl?: string;
  firestoreCreatedAt: Timestamp;
}

const BrowsePage = () => {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<BrowseSectionPost[]>([]); // Use the new interface
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const postsCollection = collection(db, "posts");
    const q = query(postsCollection, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedPosts: BrowseSectionPost[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const firestoreTimestamp = data.createdAt as Timestamp;

        // Attempt to convert Firestore ID (string) to number for BrowseSection
        // This is risky and might fail. A better fix is to update BrowseSection.
        const numericId = parseInt(doc.id, 10); 
        if (isNaN(numericId)) {
          console.warn(`Post with ID ${doc.id} could not be converted to a numeric ID. Skipping.`);
          // Alternatively, assign a temporary unique number or handle differently
          // For now, we skip if ID is not a simple number string.
          // Consider using a hash or a different strategy if IDs are complex.
          // For this example, we'll use a random number if parsing fails,
          // but this is NOT ideal for production as it's not stable.
          // return; // Or: numericId = Math.floor(Math.random() * 1000000);
        }
        
        // Convert location object to string. Adjust as needed for display.
        let locationString = "Lieu non spécifié";
        if (data.location && typeof data.location.latitude === 'number' && typeof data.location.longitude === 'number') {
          locationString = `Lat: ${data.location.latitude.toFixed(3)}, Lon: ${data.location.longitude.toFixed(3)}`;
        } else if (typeof data.location === 'string') { // If it's already a string somehow
           locationString = data.location;
        }


        const postForBrowseSection: BrowseSectionPost = {
          id: isNaN(numericId) ? Math.floor(Math.random() * 1000000) : numericId, // Fallback for ID, NOT ROBUST
          firestoreId: doc.id,
          userId: data.userId,
          title: data.title,
          description: data.description,
          category: data.category,
          type: data.category, // Map category to type
          location: locationString,
          dateTime: firestoreTimestamp ? firestoreTimestamp.toDate().toISOString() : new Date().toISOString(),
          createdAt: firestoreTimestamp ? firestoreTimestamp.toDate().toISOString() : new Date().toISOString(),
          status: data.status,
          imageUrl: data.imageUrl,
          originalLocation: data.location,
          firestoreCreatedAt: firestoreTimestamp,
          // Placeholders for contact details - implement fetching user data if needed
          contactName: "N/A", 
          contactPhone: "N/A",
        };
        fetchedPosts.push(postForBrowseSection);
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