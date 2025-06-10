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
    type: "",
    category: "",
    title: "",
    description: "",
    location: "",
    dateTime: "",
    contactName: "",
    contactPhone: "",
    status: "lost" as 'lost' | 'found',
    images: [] as File[],
    mainImageIndex: 0 // Default to first image
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
    console.log("[CreatePostForm] handleSubmit triggered. formData:", formData);
    
    const dataForPage = {
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
    console.log("[CreatePostForm] About to call onSubmit with dataForPage:", dataForPage);
    onSubmit(dataForPage);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      setFormData({ 
        ...formData, 
        images: filesArray,
        mainImageIndex: 0 // Default to first image when new files are selected
      });

      // Generate previews
      const newPreviews: string[] = [];
      setImagePreviews([]); // Clear old previews immediately

      if (filesArray.length === 0) {
        return;
      }
      
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
    }
  };

  const handleSetMainImage = (index: number) => {
    console.log("Setting main image to index:", index);
    setFormData({ ...formData, mainImageIndex: index });
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    
    // Adjust mainImageIndex if needed
    let newMainIndex = formData.mainImageIndex;
    if (index === formData.mainImageIndex) {
      // If we're removing the main image, set the first image as main
      newMainIndex = newImages.length > 0 ? 0 : -1;
    } else if (index < formData.mainImageIndex) {
      // If we're removing an image before the main image, decrement the index
      newMainIndex--;
    }
    
    setFormData({
      ...formData,
      images: newImages,
      mainImageIndex: newMainIndex
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
                    value={formData.status} 
                    onValueChange={(value: 'lost' | 'found') => setFormData({...formData, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lost">Perdu</SelectItem>
                    <SelectItem value="found">Trouvé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                <Select 
                    value={formData.type} 
                    onValueChange={(value) => setFormData({...formData, type: value, category: ''})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personne">Personne</SelectItem>
                    <SelectItem value="objet">Objet</SelectItem>
                    <SelectItem value="animal">Animal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.type && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sous-catégorie ({formData.type}) *
                </label>
                <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({...formData, category: value})}
                    required={!!formData.type}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories[formData.type as keyof typeof categories]?.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre du signalement *
              </label>
              <Input
                required
                placeholder="Ex: Téléphone Samsung perdu au marché central"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description détaillée *
              </label>
              <Textarea
                required
                rows={4}
                placeholder="Décrivez en détail ce qui est perdu/trouvé..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Lieu *
                </label>
                <Select 
                  value={formData.location}
                  onValueChange={(value) => setFormData({...formData, location: value})}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Ville" />
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
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Date et heure
                </label>
                <Input
                  type="datetime-local"
                  value={formData.dateTime}
                  onChange={(e) => setFormData({...formData, dateTime: e.target.value})}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de contact *
                </label>
                <Input
                  id="contactName"
                  required
                  placeholder="Votre nom complet"
                  value={formData.contactName}
                  onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                />
              </div>
              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Téléphone de contact *
                </label>
                <Input
                  id="contactPhone"
                  required
                  type="tel"
                  placeholder="+222 XX XX XX XX"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ImagePlus className="h-4 w-4 inline mr-1" />
                Photos (optionnel)
              </label>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              />
              
              {imagePreviews.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-700 mb-2">
                    {imagePreviews.length} photo(s) - Cliquez sur une image pour la définir comme principale
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div 
                        key={index} 
                        className="relative aspect-square border rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <img 
                          src={preview} 
                          alt={`Preview ${index + 1}`} 
                          className="absolute top-0 left-0 w-full h-full object-cover"
                          onClick={() => handleSetMainImage(index)}
                        />
                        
                        {/* Main image indicator */}
                        {formData.mainImageIndex === index && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                        
                        {/* Remove image button */}
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(index);
                          }}
                          className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                Retour
              </Button>
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                Publier le signalement
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePostForm;