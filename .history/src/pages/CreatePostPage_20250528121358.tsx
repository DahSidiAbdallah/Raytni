import CreatePostForm from "@/components/CreatePostForm";
import { useNavigate } from "react-router-dom";

const CreatePostPage = () => {
  const navigate = useNavigate();

  const handlePostSubmit = (postData: any) => {
    // Here you would typically send the data to your backend or Supabase
    console.log("Submitting post:", postData);
    // For now, just navigate back to home or a success page
    alert("Signalement soumis (simulation) !"); 
    navigate("/"); 
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