import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Phone, ImagePlus, Check, X } from "lucide-react";
import { type PostDataFromForm } from "../pages/CreatePostPage";

interface CreatePostFormProps {
  onBack: () => void;
  onSubmit: (dataForPage: PostDataFromForm) => void;
}

const CreatePostForm = ({ onBack, onSubmit }: CreatePostFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "", // mainCategory
    category: "", // subCategory
    location: "",
    dateTime: "",
    contactName: "",
    contactPhone: "",
    status: "lost" as 'lost' | 'found',
    images: [] as File[],
    mainImageIndex: 0
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const mauritanianCities = [
    "Nouakchott", "Nouadhibou", "Kaédi", "Zouérat", "Rosso", "Atar", 
    "Aleg", "Selibaby", "Boutilimit", "Kiffa", "Néma", "Akjoujt"
  ];

  const categories = {
    personne: ["Adulte", "Enfant", "Personne âgée"],
    objet: ["Téléphone", "Clés", "Portefeuille", "Bijoux", "Documents", "Véhicule", "Autre"],
    animal: ["Chat", "Chien", "Oiseau", "Autre"]
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataForPage: PostDataFromForm = {
      title: formData.title,
      description: formData.description,
      mainCategory: formData.type,
      subCategory: formData.category,
      locationName: formData.location,
      imageFiles: formData.images,
      mainImageIndex: formData.mainImageIndex,
      status: formData.status,
      dateTimeLostOrFound: formData.dateTime || undefined,
      contactName: formData.contactName,
      contactPhone: formData.contactPhone,
    };
    onSubmit(dataForPage);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setFormData({ 
        ...formData, 
        images: filesArray,
        mainImageIndex: 0
      });

      const newPreviews: string[] = [];
      setImagePreviews([]); // Clear existing previews
      
      filesArray.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === filesArray.length) {
            setImagePreviews(newPreviews);
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      setFormData({ ...formData, images: [], mainImageIndex: 0 });
      setImagePreviews([]);
    }
  };

  const handleSetMainImage = (index: number) => {
    setFormData({ ...formData, mainImageIndex: index });
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    
    let newMainImageIndex = formData.mainImageIndex;
    if (index === formData.mainImageIndex) {
      newMainImageIndex = newImages.length > 0 ? 0 : -1;
    } else if (index < formData.mainImageIndex) {
      newMainImageIndex--;
    }

    setFormData({
      ...formData,
      images: newImages,
      mainImageIndex: Math.max(0, newMainImageIndex)
    });
    setImagePreviews(newPreviews);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Créer un signalement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de signalement *
                </label>
                <Select 
                  value={formData.type}
                  onValueChange={(value) => {
                    setFormData({ ...formData, type: value, category: "" });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personne">Personne</SelectItem>
                    <SelectItem value="objet">Objet</SelectItem>
                    <SelectItem value="animal">Animal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.type && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <Select 
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories[formData.type as keyof typeof categories]?.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre *
              </label>
              <Input
                placeholder="Titre du signalement"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <Textarea
                placeholder="Description détaillée"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline-block mr-1 h-4 w-4" />
                  Ville *
                </label>
                <Select 
                  value={formData.location}
                  onValueChange={(value) => setFormData({ ...formData, location: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une ville" />
                  </SelectTrigger>
                  <SelectContent>
                    {mauritanianCities.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline-block mr-1 h-4 w-4" />
                  Date
                </label>
                <Input
                  type="datetime-local"
                  value={formData.dateTime}
                  onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <Select 
                  value={formData.status}
                  onValueChange={(value: 'lost' | 'found') => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lost">Perdu</SelectItem>
                    <SelectItem value="found">Trouvé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline-block mr-1 h-4 w-4" />
                  Nom du contact *
                </label>
                <Input
                  placeholder="Nom complet"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline-block mr-1 h-4 w-4" />
                  Numéro de téléphone *
                </label>
                <Input
                  type="tel"
                  placeholder="Numéro de téléphone"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ImagePlus className="inline-block mr-1 h-4 w-4" />
                Images
              </label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="mb-4"
              />
              
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div 
                      key={index} 
                      className="relative group cursor-pointer"
                      onClick={() => handleSetMainImage(index)}
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className={`w-full h-32 object-cover rounded-lg border-2 transition-all ${
                          index === formData.mainImageIndex ? 'border-blue-500' : 'border-gray-200 group-hover:border-blue-300'
                        }`}
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        {index === formData.mainImageIndex && (
                          <div className="bg-blue-500 text-white p-1 rounded-full">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the parent's onClick
                            removeImage(index);
                          }}
                          className="bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between pt-6">
              <Button type="button" variant="outline" onClick={onBack}>
                Retour
              </Button>
              <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                Publier
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePostForm;