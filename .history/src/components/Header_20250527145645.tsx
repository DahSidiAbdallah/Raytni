import { Search, Plus, MapPin, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import LanguageSelector from "./LanguageSelector";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onCreatePost: () => void;
  onViewBrowse: () => void;
  onViewHome: () => void;
}

const Header = ({ onCreatePost, onViewBrowse, onViewHome }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-lg border-b sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer hover:scale-105 transition-transform duration-200" onClick={onViewHome}>
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {t('app.name')}
            </span>
          </div>
          
          {/* Desktop Navigation - Better aligned */}
          <nav className="hidden md:flex items-center space-x-1">
            <button 
              onClick={onViewHome}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-blue-50 min-w-[80px] text-center"
            >
              {t('nav.home')}
            </button>
            <button 
              onClick={onViewBrowse}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-blue-50 min-w-[80px] text-center"
            >
              {t('nav.browse')}
            </button>
            <button
              onClick={() => navigate('/police')}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-blue-50 min-w-[120px] text-center"
            >
              Commissariats
            </button>
          </nav>

          {/* Right side controls - Better spacing */}
          <div className="flex items-center space-x-2">
            <LanguageSelector />
            <Button 
              onClick={onCreatePost}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 h-9"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{t('nav.report')}</span>
            </Button>
            
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Better organized */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in border-t border-gray-100">
            <nav className="flex flex-col space-y-1">
              <button 
                onClick={() => {
                  onViewHome();
                  setIsMobileMenuOpen(false);
                }}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-3 px-4 rounded-lg hover:bg-blue-50 text-left w-full"
              >
                {t('nav.home')}
              </button>
              <button 
                onClick={() => {
                  onViewBrowse();
                  setIsMobileMenuOpen(false);
                }}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-3 px-4 rounded-lg hover:bg-blue-50 text-left w-full"
              >
                {t('nav.browse')}
              </button>
              <button
                onClick={() => {
                  navigate('/police');
                  setIsMobileMenuOpen(false);
                }}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-3 px-4 rounded-lg hover:bg-blue-50 text-left w-full"
              >
                Commissariats
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
