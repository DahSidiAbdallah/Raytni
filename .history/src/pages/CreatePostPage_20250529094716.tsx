import CreatePostForm from "@/components/CreatePostForm";
import { useNavigate } from "react-router-dom";
import { db, storage } from "@/lib/firebase"; // auth removed
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; // Firestore imports
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Storage imports
import { useLanguage } from "@/contexts/LanguageContext"; // For alert messages

interface PostData {
  title: string;
  description: string;
  category: string;
  location: {
    latitude: number;
    longitude: number;
  } | null;
  imageFile?: File | null; // Optional image file
}

const CreatePostPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage(); // For translated alert messages

  const handlePostSubmit = async (postData: PostData) => {
    try {
      let imageUrl = '';
      if (postData.imageFile) {
        // Use a timestamp-based path for uniqueness as user ID is not available
        const imagePath = `posts_images/${Date.now()}/${postData.imageFile.name}`;
        const imageRef = ref(storage, imagePath);
        await uploadBytes(imageRef, postData.imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, "posts"), {
        title: postData.title,
        description: postData.description,
        category: postData.category,
        location: postData.location,
        imageUrl: imageUrl, // Store image URL
        createdAt: serverTimestamp(),
        status: 'pending', // Default status for new posts
      });

      alert(t('page.createpost.success')); 
      navigate("/browse"); 
    } catch (error) {
      console.error("Error creating post:", error);
      alert(t('page.createpost.error.generic'));
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