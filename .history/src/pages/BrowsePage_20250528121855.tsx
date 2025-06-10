import { useState, useEffect } from 'react';
import BrowseSection from "@/components/BrowseSection";
import Header from "@/components/Header"; // Assuming you want Header on this page
import Footer from "@/components/Footer"; // Assuming you want Footer on this page
import LoadingSpinner from "@/components/LoadingSpinner";
import { useLanguage } from "@/contexts/LanguageContext";

// You'll need to define or import the Post type if not already available globally
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
  // Add images and mainImageIndex if they are part of your post structure
  images?: File[];
  mainImageIndex?: number | null;
}

const BrowsePage = () => {
  const { t } = useLanguage(); // If you need translations
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // TODO: Fetch all posts from your backend/Supabase here
  useEffect(() => {
    setIsLoading(true);
    // Simulate fetching posts
    // Replace this with your actual data fetching logic
    const fetchedPosts: Post[] = [
      // This is just example data, fetch your actual posts
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
      },
      {
        id: 3, // Example of a third post
        type: "animal",
        category: "Chien",
        title: "Chien Labrador perdu près du parc",
        description: "Labrador couleur sable, avec un collier rouge. Répond au nom de Max.",
        location: "Tevragh-Zeina",
        dateTime: "2024-05-28T10:00:00",
        contactName: "Fatima Diallo",
        contactPhone: "+222 44 55 66 77",
        status: "lost",
        createdAt: "2024-05-28T11:00:00"
      }
    ];
    setPosts(fetchedPosts);
    setIsLoading(false);
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