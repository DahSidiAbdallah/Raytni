
import { Search, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeroSectionProps {
  onCreatePost: () => void;
  onViewBrowse: () => void;
}

const HeroSection = ({ onCreatePost, onViewBrowse }: HeroSectionProps) => {
  const { t } = useLanguage();
  
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-orange-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
            Retrouvons ce qui{" "}
            <span className="bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
              compte
            </span>
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onCreatePost}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Search className="h-5 w-5 mr-2" />
              {t('home.signalerUneDisparition')}
            </Button>
            <Button 
              onClick={onViewBrowse}
              variant="outline" 
              size="lg"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg hover:border-blue-700 transition-all duration-200 transform hover:scale-105"
            >
              <Package className="h-5 w-5 mr-2" />
              {t('home.parcourirLesSignalements')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
