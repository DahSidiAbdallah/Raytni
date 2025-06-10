import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Phone, ImagePlus, X, Check } from "lucide-react";
import { type PostDataFromForm } from "../pages/CreatePostPage";
import { useLanguage } from "@/contexts/LanguageContext";

interface CreatePostFormProps {
  onBack: () => void;
  onSubmit: (dataForPage: PostDataFromForm) => void;
}

const CreatePostForm = ({ onBack, onSubmit }: CreatePostFormProps) => {
  const { t } = useLanguage();
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
    mainImageIndex: 0
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const mauritanianCities = [
    "Nouakchott", "Nouadhibou", "Kaédi", "Zouérat", "Rosso", "Atar", 
    "Aleg", "Selibaby", "Boutilimit", "Kiffa", "Néma", "Akjoujt"
  ];

  const categories = {
    personne: ["Adulte", "Enfant", "Personne âgée"],
    objet: ["Téléphone", "Clés", "Portefeuille", "Bijoux", "Documents", "Véhicule", "Autre"],
    animal: ["Chat", "Chien", "Oiseau", "Autre"]
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) errors.title = "Le titre est requis";
    if (!formData.description.trim()) errors.description = "La description est requise";
    if (!formData.type) errors.type = "La catégorie est requise";
    if (formData.type && !formData.category) errors.category = "La sous-catégorie est requise";
    if (!formData.location) errors.location = "Le lieu est requis";
    if (!formData.contactName.trim()) errors.contactName = "Le nom de contact est requis";
    if (!formData.contactPhone.trim()) errors.contactPhone = "Le téléphone de contact est requis";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const dataForPage: PostDataFromForm = {
      title: formData.title,
      description: formData.description,
      mainCategory: formData.type, 
      subCategory: formData.category,
      locationName: formData.location,
      images: formData.images,
      mainImageIndex: formData.mainImageIndex,
      status: formData.status,
      dateTimeLostOrFound: formData.dateTime || undefined,
      contactName: formData.contactName,
      contactPhone: formData.contactPhone,
    };
    
    onSubmit(dataForPage);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Update form data with new images
      setFormData({ 
        ...formData, 
        images: [...formData.images, ...filesArray],
        // If this is the first image being added, set it as main image
        mainImageIndex: formData.images.length === 0 ? 0 : formData.mainImageIndex
      });

      // Generate previews for new images
      filesArray.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    // Create a new array without the removed image
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    
    // Create a new array without the removed preview
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    
    // Update main image index if needed
    let newMainImageIndex = formData.mainImageIndex;
    if (index === formData.mainImageIndex) {
      // If we removed the main image, set the first image as main (or -1 if no images left)
      newMainImageIndex = newImages.length > 0 ? 0 : -1;
    } else if (index < formData.mainImageIndex) {
      // If we removed an image before the main image, decrement the index
      newMainImageIndex--;
    }
    
    // Update state
    setFormData({
      ...formData,
      images: newImages,
      mainImageIndex: newMainImageIndex
    });
    setImagePreviews(newPreviews);
  };

  const setMainImage = (index: number) => {
    setFormData({
      ...formData,
      mainImageIndex: index
    });
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
                    onValueChange={(value: 'lost' | 'found') => {
                      setFormData({...formData, status: value});
                      setFormErrors({...formErrors, status: ""});
                    }}
                >
                  <SelectTrigger className={formErrors.status ? "border-red-500" : ""}>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lost">Perdu</SelectItem>
                    <SelectItem value="found">Trouvé</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.status && <p className="text-red-500 text-xs mt-1">{formErrors.status}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                <Select 
                    value={formData.type} 
                    onValueChange={(value) => {
                      setFormData({...formData, type: value, category: ''});
                      setFormErrors({...formErrors, type: ""});
                    }}
                >
                  <SelectTrigger className={formErrors.type ? "border-red-500" : ""}>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personne">Personne</SelectItem>
                    <SelectItem value="objet">Objet</SelectItem>
                    <SelectItem value="animal">Animal</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.type && <p className="text-red-500 text-xs mt-1">{formErrors.type}</p>}
              </div>
            </div>

            {formData.type && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sous-catégorie ({formData.type}) *
                </label>
                <Select 
                    value={formData.category} 
                    onValueChange={(value) => {
                      setFormData({...formData, category: value});
                      setFormErrors({...formErrors, category: ""});
                    }}
                >
                  <SelectTrigger className={formErrors.category ? "border-red-500" : ""}>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories[formData.type as keyof typeof categories]?.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.category && <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>}
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
                onChange={(e) => {
                  setFormData({...formData, title: e.target.value});
                  setFormErrors({...formErrors, title: ""});
                }}
                className={formErrors.title ? "border-red-500" : ""}
              />
              {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
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
                onChange={(e) => {
                  setFormData({...formData, description: e.target.value});
                  setFormErrors({...formErrors, description: ""});
                }}
                className={formErrors.description ? "border-red-500" : ""}
              />
              {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Lieu *
                </label>
                <Select 
                  onValueChange={(value) => {
                    setFormData({...formData, location: value});
                    setFormErrors({...formErrors, location: ""});
                  }}
                  value={formData.location}
                >
                  <SelectTrigger className={formErrors.location ? "border-red-500" : ""}>
                    <SelectValue placeholder="Ville" />
                  </SelectTrigger>
                  <SelectContent>
                    {mauritanianCities.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.location && <p className="text-red-500 text-xs mt-1">{formErrors.location}</p>}
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
                  onChange={(e) => {
                    setFormData({...formData, contactName: e.target.value});
                    setFormErrors({...formErrors, contactName: ""});
                  }}
                  className={formErrors.contactName ? "border-red-500" : ""}
                />
                {formErrors.contactName && <p className="text-red-500 text-xs mt-1">{formErrors.contactName}</p>}
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
                  onChange={(e) => {
                    setFormData({...formData, contactPhone: e.target.value});
                    setFormErrors({...formErrors, contactPhone: ""});
                  }}
                  className={formErrors.contactPhone ? "border-red-500" : ""}
                />
                {formErrors.contactPhone && <p className="text-red-500 text-xs mt-1">{formErrors.contactPhone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ImagePlus className="h-4 w-4 inline mr-1" />
                Photos (optionnel)
              </label>
              
              {/* Image upload input */}
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              />
              
              {/* Image preview section */}
              {imagePreviews.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {formData.images.length} photo(s) - Cliquez sur une image pour la définir comme principale
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div 
                        key={index} 
                        className={`relative aspect-square border-2 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                          index === formData.mainImageIndex ? 'border-blue-500' : 'border-gray-200'
                        }`}
                        onClick={() => setMainImage(index)}
                      >
                        <img 
                          src={preview} 
                          alt={`Preview ${index + 1}`} 
                          className="absolute top-0 left-0 w-full h-full object-cover"
                        />
                        
                        {/* Main image indicator */}
                        {index === formData.mainImageIndex && (
                          <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                        
                        {/* Remove image button */}
                        <button
                          type="button"
                          className="absolute top-2 left-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(index);
                          }}
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