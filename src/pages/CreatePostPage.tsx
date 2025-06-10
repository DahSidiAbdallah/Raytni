import CreatePostForm from "@/components/CreatePostForm";
import { useNavigate } from "react-router-dom";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useLanguage } from "@/contexts/LanguageContext";
import toast from 'react-hot-toast';

// Updated interface to reflect data from CreatePostForm and what's needed for Firestore
export interface PostDataFromForm {
  title: string;
  description: string;
  mainCategory: string;
  subCategory: string;
  locationName: string;
  imageFiles: File[];
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
    const loadingToastId = toast.loading("Publication en cours...");

    try {
      // Upload all images and get their URLs
      const imageUrls: string[] = [];
      let mainImageUrl = '';
      
      if (dataFromForm.imageFiles && dataFromForm.imageFiles.length > 0) {
        // Process each image
        for (let i = 0; i < dataFromForm.imageFiles.length; i++) {
          const file = dataFromForm.imageFiles[i];
          const imagePath = `posts_images/${Date.now()}_${i}_${file.name}`;
          const imageRef = ref(storage, imagePath);
          
          await uploadBytes(imageRef, file);
          const url = await getDownloadURL(imageRef);
          imageUrls.push(url);
          
          // Set the main image URL
          if (i === dataFromForm.mainImageIndex) {
            mainImageUrl = url;
          }
        }
      }

      // Data to be saved in Firestore
      const postToSave = {
        title: dataFromForm.title,
        description: dataFromForm.description,
        category: dataFromForm.mainCategory,
        subCategory: dataFromForm.subCategory,
        locationName: dataFromForm.locationName,
        imageUrls: imageUrls, // All image URLs
        mainImageUrl: mainImageUrl, // Main image URL
        status: dataFromForm.status,
        dateTimeLostOrFound: dataFromForm.dateTimeLostOrFound || null,
        contactName: dataFromForm.contactName,
        contactPhone: dataFromForm.contactPhone,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "posts"), postToSave);
      
      toast.success("Signalement publié avec succès!", { id: loadingToastId });
      navigate("/browse");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Erreur lors de la publication. Veuillez réessayer.", { id: loadingToastId });
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