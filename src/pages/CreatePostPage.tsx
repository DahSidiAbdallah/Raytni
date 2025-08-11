import CreatePostForm from "@/components/CreatePostForm";
import { useNavigate } from "react-router-dom";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useLanguage } from "@/contexts/LanguageContext";
import toast from 'react-hot-toast';
// MainLayout removed; should be used at the router level only

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
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handlePostSubmit = async (dataFromForm: PostDataFromForm) => {
    const loadingToastId = toast.loading(t('page.createpost.toast.loading'));

    try {
      // Upload all images and get their URLs
      const imageUrls: string[] = [];
      let mainImageUrl = '';
      
      if (dataFromForm.imageFiles && dataFromForm.imageFiles.length > 0) {
        // Process each image
        for (let i = 0; i < dataFromForm.imageFiles.length; i++) {
          const file = dataFromForm.imageFiles[i];
          const imagePath = `posts_images/${Date.now()}_${i}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
          const imageRef = ref(storage, imagePath);
          
          try {
            await uploadBytes(imageRef, file);
            const url = await getDownloadURL(imageRef);
            imageUrls.push(url);
            
            // If this is the main image, store its URL separately
            if (i === dataFromForm.mainImageIndex) {
              mainImageUrl = url;
            }
          } catch (uploadError) {
            console.error(`Error uploading image ${i}:`, uploadError);
            toast.error(t('page.createpost.toast.imageUploadError'));
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
        imageUrl: mainImageUrl, // Main image URL
        imageUrls: imageUrls, // All image URLs
        status: dataFromForm.status,
        dateTimeLostOrFound: dataFromForm.dateTimeLostOrFound || null,
        contactName: dataFromForm.contactName,
        contactPhone: dataFromForm.contactPhone,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, "posts"), postToSave);
      console.log("Document written with ID: ", docRef.id);
      
      toast.success(t('page.createpost.toast.success'));
      navigate('/browse');
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(t('page.createpost.toast.error'));
    } finally {
      toast.dismiss(loadingToastId);
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