import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Menu, X, Search as SearchIcon, Moon, Sun, Languages, Home, ListChecks, PlusCircle, LogIn, UserPlus, Shield } from 'lucide-react';
import Logo from '/logo.png';
import { useLanguage, Language } from "@/contexts/LanguageContext";

interface HeaderProps {
  onCreatePost?: () => void;
  onViewBrowse?: () => void;
  onViewHome?: () => void;
}

const Header = ({ onCreatePost, onViewBrowse, onViewHome }: HeaderProps) => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log("Raytni Search term:", searchTerm.trim());
      setSearchTerm("");
    }
  };

  const handleCreatePost = () => {
    if (onCreatePost) {
      onCreatePost();
    } else {
      navigate('/create-post');
    }
  };

  const handleViewBrowse = () => {
    if (onViewBrowse) {
      onViewBrowse();
    } else {
      navigate('/browse');
    }
  };

  const handleViewHome = () => {
    if (onViewHome) {
      onViewHome();
    } else {
      navigate('/');
    }
  };

  return (
    <header className="bg-white shadow-lg border-b sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 cursor-pointer" onClick={handleViewHome}>
              <img className="h-8 w-auto" src={Logo} alt="Logo" />
            </div>
            <nav className="hidden md:ml-8 md:flex space-x-4">
              <Button variant="ghost" onClick={handleViewHome} className="text-gray-700 hover:text-blue-600">
                <Home className="mr-2 h-5 w-5"/>{t('nav.home')}
              </Button>
              <Button variant="ghost" onClick={handleViewBrowse} className="text-gray-700 hover:text-blue-600">
                <ListChecks className="mr-2 h-5 w-5"/>{t('nav.browse')}
              </Button>
              <Button variant="ghost" onClick={handleCreatePost} className="text-gray-700 hover:text-blue-600">
                <PlusCircle className="mr-2 h-5 w-5"/>{t('nav.report')}
              </Button>
              <Button variant="ghost" onClick={() => navigate('/police')} className="text-gray-700 hover:text-blue-600">
                <Shield className="mr-2 h-5 w-5"/>{t('nav.police')}
              </Button>
            </nav>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" className="p-2">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;