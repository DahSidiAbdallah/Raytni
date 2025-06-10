import { Search, Plus, MapPin, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import LanguageSelector from "./LanguageSelector";
import { useNavigate, Link } from "react-router-dom";

interface HeaderProps {
  onCreatePost: () => void;
  onViewBrowse: () => void;
  onViewHome: () => void;
}

const Header = ({ onCreatePost, onViewBrowse, onViewHome }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="App Logo" className="h-8 w-auto" /> 
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Mauritania FindItNow</h1>
          </Link>
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
            onClick={toggleMobileMenu}
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
                toggleMobileMenu();
              }}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-3 px-4 rounded-lg hover:bg-blue-50 text-left w-full"
            >
              {t('nav.home')}
            </button>
            <button 
              onClick={() => {
                onViewBrowse();
                toggleMobileMenu();
              }}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-3 px-4 rounded-lg hover:bg-blue-50 text-left w-full"
            >
              {t('nav.browse')}
            </button>
            <button
              onClick={() => {
                navigate('/police');
                toggleMobileMenu();
              }}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-3 px-4 rounded-lg hover:bg-blue-50 text-left w-full"
            >
              Commissariats
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
