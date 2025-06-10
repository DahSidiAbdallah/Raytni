import CreatePostForm from "@/components/CreatePostForm";
import { useNavigate } from "react-router-dom";
import { db, storage } from "@/lib/firebase"; // auth removed
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; // Firestore imports
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Storage imports
import { useLanguage } from "@/contexts/LanguageContext"; // For alert messages
import toast from 'react-hot-toast'; // Import toast

// Updated interface to reflect data from CreatePostForm and what's needed for Firestore
interface PostDataFromForm {
  title: string;
  description: string;
  mainCategory: string; // e.g., "personne", "objet" - maps to 'category' in Firestore
  subCategory: string;  // e.g., "Enfant", "Téléphone" - maps to 'subCategory' in Firestore
  locationName: string; // e.g., "Nouakchott" - maps to 'locationName' in Firestore
  imageFile?: File | null; 
  status: 'lost' | 'found';
  dateTimeLostOrFound?: string; 
  contactName: string; // Added
  contactPhone: string; // Added
}

const CreatePostPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage(); // For translated alert messages

  const handlePostSubmit = async (dataFromForm: PostDataFromForm) => {
    console.log("[CreatePostPage] handlePostSubmit triggered. dataFromForm:", dataFromForm);
    const loadingToastId = toast.loading(t('page.createpost.toast.loading'));

    try {
      let imageUrl = '';
      if (dataFromForm.imageFile) {
        const imagePath = `posts_images/${Date.now()}/${dataFromForm.imageFile.name}`;
        const imageRef = ref(storage, imagePath);
        await uploadBytes(imageRef, dataFromForm.imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Data to be saved in Firestore
      const postToSave = {
        title: dataFromForm.title,
        description: dataFromForm.description,
        category: dataFromForm.mainCategory, // Main category (e.g., objet, personne)
        subCategory: dataFromForm.subCategory, // Sub-category (e.g., Téléphone, Enfant)
        locationName: dataFromForm.locationName, // City name
        imageUrl: imageUrl, 
        status: dataFromForm.status, // 'lost' or 'found'
        dateTimeLostOrFound: dataFromForm.dateTimeLostOrFound || null, // Optional date
        contactName: dataFromForm.contactName, // Added
        contactPhone: dataFromForm.contactPhone, // Added
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "posts"), postToSave);

      toast.success(t('page.createpost.toast.success'), { id: loadingToastId });
      navigate("/browse"); 
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(t('page.createpost.toast.error.generic'), { id: loadingToastId });
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