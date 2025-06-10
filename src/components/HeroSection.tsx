
import { Search, Users, Package, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onCreatePost: () => void;
  onViewBrowse: () => void;
}

const HeroSection = ({ onCreatePost, onViewBrowse }: HeroSectionProps) => {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-orange-50 py-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-100 rounded-full opacity-20 animate-pulse"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Retrouvons ce qui{" "}
              <span className="bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
                compte
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Plateforme communautaire pour retrouver personnes disparues, objets perdus et animaux égarés en Mauritanie
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in">
            <Button 
              onClick={onCreatePost}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Search className="h-5 w-5 mr-2" />
              Signaler une disparition
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button 
              onClick={onViewBrowse}
              variant="outline" 
              size="lg"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg hover:border-blue-700 transition-all duration-200 transform hover:scale-105"
            >
              Parcourir les signalements
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center group hover:scale-105 transition-transform duration-200">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                <Users className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Personnes</h3>
              <p className="text-gray-600 leading-relaxed">Aidez à retrouver des proches disparus</p>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-200">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                <Package className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Objets</h3>
              <p className="text-gray-600 leading-relaxed">Retrouvez vos biens perdus</p>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-200">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                <Heart className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Animaux</h3>
              <p className="text-gray-600 leading-relaxed">Réunissez-vous avec vos compagnons</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
