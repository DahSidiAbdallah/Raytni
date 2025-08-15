
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
    <section className="bg-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
            {t('home.title')}{" "}
            <span className="text-primary">
              {t('home.titleHighlight')}
            </span>
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onCreatePost}
              size="lg"
              className="bg-primary text-white px-8 py-3 text-base"
            >
              <Search className="h-4 w-4 mr-2" />
              {t('home.signalerUneDisparition')}
            </Button>
            <Button 
              onClick={onViewBrowse}
              variant="outline" 
              size="lg"
              className="border border-primary text-primary px-8 py-3 text-base"
            >
              <Package className="h-4 w-4 mr-2" />
              {t('home.parcourirLesSignalements')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
