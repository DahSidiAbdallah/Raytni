import { useState } from "react";
import { Search, Filter, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PostCard from "./PostCard";

interface Post {
  id: number;
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
}

interface BrowseSectionProps {
  posts: Post[];
  onBack: () => void;
}

const BrowseSection = ({ posts, onBack }: BrowseSectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const mauritanianCities = [
    "Nouakchott", "Nouadhibou", "Kaédi", "Zouérat", "Rosso", "Atar", 
    "Aleg", "Selibaby", "Boutilimit", "Kiffa", "Néma", "Akjoujt"
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || post.type === filterType;
    const matchesStatus = filterStatus === "all" || post.status === filterStatus;
    const matchesLocation = filterLocation === "all" || post.location === filterLocation;
    
    return matchesSearch && matchesType && matchesStatus && matchesLocation;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setFilterStatus("all");
    setFilterLocation("all");
  };

  const hasActiveFilters = searchTerm || filterType !== "all" || filterStatus !== "all" || filterLocation !== "all";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Signalements</h1>
          <p className="text-gray-600">Explorez tous les signalements de la communauté</p>
        </div>
        <Button variant="outline" onClick={onBack} className="hover:bg-gray-50 transition-colors">
          Retour à l'accueil
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
                placeholder="Rechercher par titre ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg border-2 focus:border-blue-500 transition-colors"
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
            Filtres
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
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous types</SelectItem>
                  <SelectItem value="personne">👤 Personne</SelectItem>
                  <SelectItem value="objet">📦 Objet</SelectItem>
                  <SelectItem value="animal">🐾 Animal</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={setFilterStatus} value={filterStatus}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous statuts</SelectItem>
                  <SelectItem value="lost">🔴 Perdu</SelectItem>
                  <SelectItem value="found">🟢 Trouvé</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={setFilterLocation} value={filterLocation}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Lieu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes villes</SelectItem>
                  {mauritanianCities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
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
                Effacer les filtres
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <p className="text-gray-600 text-lg">
            <span className="font-semibold text-gray-900">{filteredPosts.length}</span> signalement{filteredPosts.length !== 1 ? 's' : ''} trouvé{filteredPosts.length !== 1 ? 's' : ''}
          </p>
          {hasActiveFilters && (
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              Filtres actifs
            </Badge>
          )}
        </div>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <div className="text-gray-300 text-8xl mb-6">🔍</div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">Aucun signalement trouvé</h3>
          <p className="text-gray-600 mb-8 text-lg">Essayez de modifier vos critères de recherche ou créez un nouveau signalement</p>
          <Button
            onClick={clearFilters}
            variant="outline"
            className="mr-4"
          >
            Effacer les filtres
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
