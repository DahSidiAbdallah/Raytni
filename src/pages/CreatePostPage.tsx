import CreatePostForm from "@/components/CreatePostForm";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import toast from 'react-hot-toast';
import { createPost, PostInput } from "@/services/postService";

// Exporting for use in CreatePostForm.tsx
export interface PostDataFromForm {
  title: string;
  description: string;
  mainCategory: string;
  subCategory: string;
  locationName: string;
  imageFile?: File | null;
  status: 'lost' | 'found';
  dateTimeLostOrFound?: string;
  contactName: string;
  contactPhone: string;
}

const CreatePostPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handlePostSubmit = async (dataFromForm: PostDataFromForm) => {
    const loadingToastId = toast.loading(t('page.createpost.toast.loading') || "Création du signalement...");

    try {
      // Convert the form data to the format expected by the service
      const postData: PostInput = {
        title: dataFromForm.title,
        description: dataFromForm.description,
        mainCategory: dataFromForm.mainCategory,
        subCategory: dataFromForm.subCategory,
        locationName: dataFromForm.locationName,
        imageFile: dataFromForm.imageFile,
        status: dataFromForm.status,
        dateTimeLostOrFound: dataFromForm.dateTimeLostOrFound,
        contactName: dataFromForm.contactName,
        contactPhone: dataFromForm.contactPhone,
      };

      // Create the post using the service
      await createPost(postData);
      
      toast.success(t('toast.success') || "Signalement publié avec succès!", { id: loadingToastId });
      navigate("/browse");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(t('page.createpost.toast.error.generic') || "Erreur lors de la création du signalement.", { id: loadingToastId });
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