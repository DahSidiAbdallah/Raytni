import CreatePostForm from "@/components/CreatePostForm";
import { useNavigate } from "react-router-dom";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useLanguage } from "@/contexts/LanguageContext";
import toast from 'react-hot-toast';

// Interface for form data from CreatePostForm
export interface PostDataFromForm {
  title: string;
  description: string;
  mainCategory: string;
  subCategory: string;
  locationName: string;
  images: File[];
  mainImageIndex: number;
  status: 'lost' | 'found';
  dateTimeLostOrFound?: string;
  contactName: string;
  contactPhone: string;
}

const CreatePostPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handlePostSubmit = async (dataFromForm: PostDataFromForm) => {
    const loadingToastId = toast.loading(t('toast.loading') || "Envoi en cours...");

    try {
      // Upload all images and get their URLs
      const imageUrls: string[] = [];
      
      if (dataFromForm.images.length > 0) {
        for (let i = 0; i < dataFromForm.images.length; i++) {
          const file = dataFromForm.images[i];
          const imagePath = `posts_images/${Date.now()}-${i}-${file.name}`;
          const imageRef = ref(storage, imagePath);
          
          await uploadBytes(imageRef, file);
          const url = await getDownloadURL(imageRef);
          imageUrls.push(url);
        }
      }

      // Prepare data for Firestore
      const postToSave = {
        title: dataFromForm.title,
        description: dataFromForm.description,
        category: dataFromForm.mainCategory,
        subCategory: dataFromForm.subCategory,
        locationName: dataFromForm.locationName,
        imageUrls: imageUrls, // All image URLs
        mainImageUrl: imageUrls.length > 0 ? imageUrls[dataFromForm.mainImageIndex] : '', // Main image URL
        status: dataFromForm.status,
        dateTimeLostOrFound: dataFromForm.dateTimeLostOrFound || null,
        contactName: dataFromForm.contactName,
        contactPhone: dataFromForm.contactPhone,
        createdAt: serverTimestamp(),
      };

      // Add document to Firestore
      const docRef = await addDoc(collection(db, "posts"), postToSave);
      
      console.log("Document written with ID: ", docRef.id);
      
      // Show success toast
      toast.success(t('toast.success') || "Signalement publié avec succès!", { 
        id: loadingToastId,
        duration: 3000
      });
      
      // Navigate to browse page after successful submission
      setTimeout(() => navigate("/browse"), 1000);
    } catch (error) {
      console.error("Error adding document: ", error);
      
      // Show error toast
      toast.error(t('toast.error') || "Erreur lors de la publication", { 
        id: loadingToastId,
        duration: 5000
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <CreatePostForm 
        onBack={() => navigate(-1)} 
        onSubmit={handlePostSubmit} 
      />
    </div>
  );
};

export default CreatePostPage;