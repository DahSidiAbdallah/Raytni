import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Phone, ImagePlus } from "lucide-react";
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
    mainImageIndex: null as number | null
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
      imageFile: formData.images.length > 0 ? formData.images[0] : null,
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
      
      const newMainImageIndex = filesArray.length > 0 
        ? (formData.mainImageIndex !== null && formData.mainImageIndex < filesArray.length 
            ? formData.mainImageIndex 
            : 0) 
        : null;
      
      setFormData({ 
        ...formData, 
        images: filesArray,
        mainImageIndex: newMainImageIndex
      });

      const newPreviews: string[] = [];
      setImagePreviews([]);

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
    setFormData({ ...formData, mainImageIndex: index });
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
                <Select onValueChange={(value) => setFormData({...formData, location: value})}>
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

            <div className="grid md:grid-cols-2 gap-4">
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
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div 
                        key={index} 
                        className={`relative aspect-square border rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
                      >
                        <img 
                          src={preview} 
                          alt={`Preview ${index + 1}`} 
                          className="absolute top-0 left-0 w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
