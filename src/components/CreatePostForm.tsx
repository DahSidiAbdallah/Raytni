import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Phone, ImagePlus, Check, X } from "lucide-react";
import { type PostDataFromForm } from "../pages/CreatePostPage";
import { useLanguage } from "@/contexts/LanguageContext";

interface CreatePostFormProps {
  onBack: () => void;
  onSubmit: (dataForPage: PostDataFromForm) => void;
}

const CreatePostForm = ({ onBack, onSubmit }: CreatePostFormProps) => {
  const { t } = useLanguage();
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
  const [formError, setFormError] = useState<string | null>(null);

  const mauritanianCities = [
    "Nouakchott", "Nouadhibou", "Kaédi", "Zouérat", "Rosso", "Atar", 
    "Aleg", "Selibaby", "Boutilimit", "Kiffa", "Néma", "Akjoujt"
  ];

  const categories = {
    personne: ["adulte", "enfant", "personneAgee"],
    objet: ["telephone", "cles", "portefeuille", "bijoux", "documents", "vehicule", "autre"],
    animal: ["chat", "chien", "oiseau", "autre"]
  };

  // Helper: Validate phone number (must be 8 digits, start with 2, 3, or 4)
  const isValidPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    return /^(2|3|4)\d{7}$/.test(cleaned);
  };

  // Helper: Validate date (not after now, to the minute)
  const isValidDate = (dateStr: string) => {
    if (!dateStr) return true;
    const inputDate = new Date(dateStr);
    const now = new Date();
    // Compare up to the minute
    return inputDate.getTime() <= now.setSeconds(0, 0);
  };

  const validateForm = () => {
    if (!formData.type) return t("form.errors.typeRequired");
    if (!formData.category) return t("form.errors.categoryRequired");
    if (!formData.title.trim()) return t("form.errors.titleRequired");
    if (!formData.description.trim()) return t("form.errors.descriptionRequired");
    if (!formData.location) return t("form.errors.locationRequired");
    if (!formData.contactName.trim()) return t("form.errors.contactNameRequired");
    if (!formData.contactPhone.trim()) return t("form.errors.contactPhoneRequired");
    if (!isValidPhone(formData.contactPhone)) return t("form.errors.phoneInvalid");
    if (formData.dateTime && !isValidDate(formData.dateTime)) return t("form.errors.dateFuture");
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const error = validateForm();
    if (error) {
      setFormError(error);
      return;
    }
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
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...filesArray],
        mainImageIndex: prev.images.length === 0 ? 0 : prev.mainImageIndex
      }));

      const newPreviews: string[] = [];
      let filesToPreview = [...imagePreviews];
      filesArray.forEach((file, idx) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          filesToPreview.push(reader.result as string);
          if (filesToPreview.length === formData.images.length + filesArray.length) {
            setImagePreviews(filesToPreview);
          }
        };
        reader.readAsDataURL(file);
      });
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
      <Card className="shadow-xl border-2 border-blue-100 bg-white/80 backdrop-blur-md">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-t-xl p-6">
          <CardTitle className="text-3xl text-center text-white font-bold tracking-wide drop-shadow-lg">{t('form.formTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          {formError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300 text-center">
              {formError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-base font-semibold text-blue-700 mb-2">{t('form.typeLabel')} {t('form.required')}</label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value, category: "" })}>
                  <SelectTrigger className="rounded-lg border-blue-300 focus:ring-2 focus:ring-blue-400">
                    <SelectValue placeholder={t('form.typePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personne">{t('form.categories.personne')}</SelectItem>
                    <SelectItem value="objet">{t('form.categories.objet')}</SelectItem>
                    <SelectItem value="animal">{t('form.categories.animal')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.type && (
                <div>
                  <label className="block text-base font-semibold text-blue-700 mb-2">{t('form.category')} {t('form.required')}</label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger className="rounded-lg border-blue-300 focus:ring-2 focus:ring-blue-400">
                      <SelectValue placeholder={t('form.categoryPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories[formData.type as keyof typeof categories]?.map((cat) => (
                        <SelectItem key={cat} value={cat}>{t(`form.subCategories.${cat}`)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <div>
              <label className="block text-base font-semibold text-blue-700 mb-2">{t('form.title')} {t('form.required')}</label>
              <Input className="rounded-lg border-blue-300 focus:ring-2 focus:ring-blue-400" placeholder={t('form.titlePlaceholder')} value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            </div>
            <div>
              <label className="block text-base font-semibold text-blue-700 mb-2">{t('form.description')} {t('form.required')}</label>
              <Textarea className="rounded-lg border-blue-300 focus:ring-2 focus:ring-blue-400" placeholder={t('form.descriptionPlaceholder')} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows={4} />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-base font-semibold text-blue-700 mb-2"><MapPin className="inline-block mr-1 h-4 w-4 text-blue-400" />{t('form.location')} {t('form.required')}</label>
                <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                  <SelectTrigger className="rounded-lg border-blue-300 focus:ring-2 focus:ring-blue-400">
                    <SelectValue placeholder={t('form.locationPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {mauritanianCities.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-base font-semibold text-blue-700 mb-2"><Calendar className="inline-block mr-1 h-4 w-4 text-blue-400" />{t('form.date')}</label>
                <Input className="rounded-lg border-blue-300 focus:ring-2 focus:ring-blue-400" type="datetime-local" value={formData.dateTime} onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-base font-semibold text-blue-700 mb-2">{t('form.status')} {t('form.required')}</label>
                <Select value={formData.status} onValueChange={(value: 'lost' | 'found') => setFormData({ ...formData, status: value })}>
                  <SelectTrigger className="rounded-lg border-blue-300 focus:ring-2 focus:ring-blue-400">
                    <SelectValue placeholder={t('form.statusPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lost">{t('status.lost')}</SelectItem>
                    <SelectItem value="found">{t('status.found')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-base font-semibold text-blue-700 mb-2"><Phone className="inline-block mr-1 h-4 w-4 text-blue-400" />{t('form.contactName')} {t('form.required')}</label>
                <Input className="rounded-lg border-blue-300 focus:ring-2 focus:ring-blue-400" placeholder={t('form.contactNamePlaceholder')} value={formData.contactName} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })} required />
              </div>
              <div>
                <label className="block text-base font-semibold text-blue-700 mb-2"><Phone className="inline-block mr-1 h-4 w-4 text-blue-400" />{t('form.contactPhone')} {t('form.required')}</label>
                <Input className="rounded-lg border-blue-300 focus:ring-2 focus:ring-blue-400" type="tel" placeholder={t('form.contactPhonePlaceholder')} value={formData.contactPhone} onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })} required />
              </div>
            </div>
            <div>
              <label className="block text-base font-semibold text-blue-700 mb-2 flex items-center gap-2">
                <ImagePlus className="inline-block h-5 w-5 text-blue-400" />
                {t('form.imagesAdd')}
              </label>
              <div className="text-sm text-gray-600 mb-4">{t('form.imagesDescription')}</div>
              {/* Main image upload area */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 mb-6 min-h-[220px] relative group transition hover:border-blue-400">
                {imagePreviews.length === 0 ? (
                  <>
                    <div className="flex flex-col items-center justify-center">
                      <ImagePlus className="h-12 w-12 text-gray-300 mb-4" />
                      <div className="text-gray-700 font-medium text-center mb-1">{t('form.imagesDragDrop')}</div>
                      <div className="text-xs text-gray-400 mb-4">{t('form.imagesPrimary')}</div>
                      <label htmlFor="main-image-upload" className="inline-block cursor-pointer">
                        <span className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-2 rounded-lg shadow transition">{t('form.imagesBrowseFiles')}</span>
                        <Input id="main-image-upload" type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                      </label>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center w-full">
                    <div className="relative w-48 h-48 mb-2">
                      <img src={imagePreviews[formData.mainImageIndex]} alt="Main preview" className="w-full h-full object-cover rounded-xl border-4 border-blue-500 shadow" />
                      <button type="button" onClick={() => removeImage(formData.mainImageIndex)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600">
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="text-xs text-blue-500 font-medium mb-2">{t('form.imagesCurrentPrimary')}</div>
                    <label htmlFor="main-image-upload" className="inline-block cursor-pointer">
                      <span className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-2 rounded-lg shadow transition">{t('form.imagesBrowseFiles')}</span>
                      <Input id="main-image-upload" type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                )}
              </div>
              {/* Additional images grid */}
              <div className="mb-2 text-base font-semibold text-blue-700">{t('form.imagesAdditional')}</div>
              <div className="flex gap-4">
                {[0,1,2,3].map((i) => (
                  <div key={i} className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-white relative overflow-hidden">
                    {imagePreviews[i+1] ? (
                      <>
                        <img src={imagePreviews[i+1]} alt={`Preview ${i+2}`} className="w-full h-full object-cover rounded-xl" />
                        <button type="button" onClick={() => removeImage(i+1)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600 z-10">
                          <X className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => handleSetMainImage(i+1)} className={`absolute bottom-1 left-1 bg-blue-500 text-white p-1 rounded-full shadow ${formData.mainImageIndex === i+1 ? '' : 'opacity-60 hover:opacity-100'}`}> 
                          <Check className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <label htmlFor="main-image-upload" className="w-full h-full flex items-center justify-center cursor-pointer">
                        <span className="text-3xl text-gray-300">+</span>
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between pt-8">
              <Button type="button" variant="outline" onClick={onBack} className="rounded-lg px-6 py-2 text-blue-700 border-blue-400 hover:bg-blue-50">{t('form.backButton')}</Button>
              <Button type="submit" className="rounded-lg px-8 py-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-blue-500">{t('form.publishButton')}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePostForm;