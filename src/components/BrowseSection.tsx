import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, Filter, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PostCard from "./PostCard";
import { getPosts, PostFilter } from "@/services/postService";

interface Post {
  id: string;
  type: string;
  category: string;
  title: string;
  description: string;
  location: string;
  dateTime: string;
  contactName: string;
  contactPhone: string;
  status: string;
  createdAt: string;
  imageUrl?: string;
}

interface BrowseSectionProps {
  posts: Post[];
  onBack: () => void;
}

const BrowseSection = ({ posts: initialPosts, onBack }: BrowseSectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);

  // City names in both French and Arabic
  const mauritanianCities = [
    { fr: "Nouakchott", ar: "نواكشوط" },
    { fr: "Nouadhibou", ar: "نواذيبو" },
    { fr: "Kaédi", ar: "كيهيدي" },
    { fr: "Zouérat", ar: "ازويرات" },
    { fr: "Rosso", ar: "روصو" },
    { fr: "Atar", ar: "أطار" },
    { fr: "Aleg", ar: "ألاك" },
    { fr: "Selibaby", ar: "سيليبابي" },
    { fr: "Boutilimit", ar: "بوتلميت" },
    { fr: "Kiffa", ar: "كيفه" },
    { fr: "Néma", ar: "النعمة" },
    { fr: "Akjoujt", ar: "أكجوجت" }
  ];
  const { currentLanguage, t } = useLanguage();
  const lang = currentLanguage;

  // Apply filters whenever filter state changes
  useEffect(() => {
    const applyFilters = async () => {
      // If no filters are active, just use the initial posts
      if (!hasActiveFilters) {
        setFilteredPosts(initialPosts);
        return;
      }

      setIsLoading(true);
      try {
        // Build filter object for the service
        const filters: PostFilter = {};
        
        if (filterType !== "all") {
          filters.category = filterType;
        }
        
        if (filterStatus !== "all") {
          filters.status = filterStatus as 'lost' | 'found';
        }
        
        if (filterLocation !== "all") {
          filters.locationName = filterLocation;
        }
        
        if (searchTerm) {
          filters.searchTerm = searchTerm;
        }

        // Use the service to get filtered posts
        const posts = await getPosts(filters);
        
        // Convert to the format expected by the component
        const displayPosts = posts.map(post => ({
          id: post.id,
          type: post.category,
          category: post.subCategory,
          title: post.title,
          description: post.description,
          location: post.locationName,
          dateTime: post.dateTimeLostOrFound || post.createdAt.toDate().toISOString(),
          contactName: post.contactName,
          contactPhone: post.contactPhone,
          status: post.status,
          createdAt: post.createdAt.toDate().toISOString(),
          imageUrl: post.imageUrl
        }));
        
        setFilteredPosts(displayPosts);
      } catch (error) {
        console.error("Error applying filters:", error);
        // If there's an error, fall back to client-side filtering
        const filtered = initialPosts.filter(post => {
          const matchesSearch = searchTerm ? 
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.description.toLowerCase().includes(searchTerm.toLowerCase()) : 
            true;
          const matchesType = filterType === "all" || post.type === filterType;
          const matchesStatus = filterStatus === "all" || post.status === filterStatus;
          const matchesLocation = filterLocation === "all" || post.location === filterLocation;
          
          return matchesSearch && matchesType && matchesStatus && matchesLocation;
        });
        
        setFilteredPosts(filtered);
      } finally {
        setIsLoading(false);
      }
    };

    applyFilters();
  }, [initialPosts, searchTerm, filterType, filterStatus, filterLocation]);

  const clearFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setFilterStatus("all");
    setFilterLocation("all");
  };

  const hasActiveFilters = searchTerm || filterType !== "all" || filterStatus !== "all" || filterLocation !== "all";

  return (
  <div className={`max-w-7xl mx-auto px-4 py-8 ${lang === 'ar' ? 'text-right' : ''}`}> 
      <div className="flex items-center justify-between mb-8">
        <div className="animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{lang === 'ar' ? 'البلاغات' : 'Signalements'}</h1>
          <p className="text-gray-600">{lang === 'ar' ? 'استكشف جميع البلاغات من المجتمع' : 'Explorez tous les signalements de la communauté'}</p>
        </div>
        <Button variant="outline" onClick={onBack} className="hover:bg-gray-50 transition-colors">
          {lang === 'ar' ? 'العودة إلى الرئيسية' : "Retour à l'accueil"}
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border mb-8 animate-fade-in">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder={lang === 'ar' ? 'ابحث بالعنوان أو الوصف...' : 'Rechercher par titre ou description...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 h-12 text-lg border-2 focus:border-blue-500 transition-colors ${lang === 'ar' ? 'text-right' : ''}`}
              />
            </div>
          </div>

          {/* Filter Toggle Button */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="h-12 px-6 border-2 hover:bg-gray-50 transition-all"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            {lang === 'ar' ? 'فلاتر' : 'Filtres'}
            {hasActiveFilters && (
              <Badge className="ml-2 bg-blue-600 text-white">
                {[searchTerm, filterType !== "all", filterStatus !== "all", filterLocation !== "all"].filter(Boolean).length}
              </Badge>
            )}
          </Button>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t animate-fade-in">
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <Select onValueChange={setFilterType} value={filterType}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={lang === 'ar' ? 'النوع' : 'Type'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{lang === 'ar' ? 'كل الأنواع' : 'Tous types'}</SelectItem>
                  <SelectItem value="personne">👤 {lang === 'ar' ? 'شخص' : 'Personne'}</SelectItem>
                  <SelectItem value="objet">📦 {lang === 'ar' ? 'غرض' : 'Objet'}</SelectItem>
                  <SelectItem value="animal">🐾 {lang === 'ar' ? 'حيوان' : 'Animal'}</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={setFilterStatus} value={filterStatus}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={lang === 'ar' ? 'الحالة' : 'Statut'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{lang === 'ar' ? 'كل الحالات' : 'Tous statuts'}</SelectItem>
                  <SelectItem value="lost">🔴 {lang === 'ar' ? 'مفقود' : 'Perdu'}</SelectItem>
                  <SelectItem value="found">🟢 {lang === 'ar' ? 'تم العثور عليه' : 'Trouvé'}</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={setFilterLocation} value={filterLocation}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={lang === 'ar' ? 'المدينة' : 'Lieu'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{lang === 'ar' ? 'كل المدن' : 'Toutes villes'}</SelectItem>
                  {mauritanianCities.map((city) => (
                    <SelectItem key={city.fr} value={lang === 'ar' ? city.ar : city.fr}>
                      {lang === 'ar' ? city.ar : city.fr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-2" />
                {lang === 'ar' ? 'مسح الفلاتر' : 'Effacer les filtres'}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <p className="text-gray-600 text-lg">
            <span className="font-semibold text-gray-900">{filteredPosts.length}</span> {lang === 'ar' ? 'بلاغ' : ''}{filteredPosts.length !== 1 && lang === 'ar' ? 'ات' : ''}{lang === 'ar' ? ' تم العثور عليها' : ` signalement${filteredPosts.length !== 1 ? 's' : ''} trouvé${filteredPosts.length !== 1 ? 's' : ''}`}
          </p>
          {hasActiveFilters && (
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              {lang === 'ar' ? 'فلاتر مفعلة' : 'Filtres actifs'}
            </Badge>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Posts Grid */}
      {!isLoading && filteredPosts.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <div className="text-gray-300 text-8xl mb-6">🔍</div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">{lang === 'ar' ? 'لم يتم العثور على أي بلاغ' : 'Aucun signalement trouvé'}</h3>
          <p className="text-gray-600 mb-8 text-lg">{lang === 'ar' ? 'حاول تغيير معايير البحث أو أنشئ بلاغًا جديدًا' : 'Essayez de modifier vos critères de recherche ou créez un nouveau signalement'}</p>
          <Button
            onClick={clearFilters}
            variant="outline"
            className="mr-4"
          >
            {lang === 'ar' ? 'مسح الفلاتر' : 'Effacer les filtres'}
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
          {filteredPosts.map((post, index) => (
            <div key={post.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseSection;