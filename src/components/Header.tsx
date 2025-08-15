import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Menu, X, Search as SearchIcon, Moon, Sun, Languages, Home, ListChecks, PlusCircle, LogIn, UserPlus, Shield } from 'lucide-react';
import Logo from '/logo.png';
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from './LanguageSelector';

interface HeaderProps {
  onCreatePost?: () => void;
  onViewBrowse?: () => void;
  onViewHome?: () => void;
}

const Header = ({ onCreatePost, onViewBrowse, onViewHome }: HeaderProps) => {
  const navigate = useNavigate();
  const { currentLanguage, setLanguage, t } = useLanguage();
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
    <header className="bg-background border-b sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center">
            <div className="flex-shrink-0 cursor-pointer" onClick={handleViewHome}>
              <img className="h-8 w-auto" src={Logo} alt="Logo" />
            </div>
            <nav className="hidden md:ml-8 md:flex space-x-2">
              <Button variant="ghost" onClick={handleViewHome} className="text-foreground transition-all duration-200 hover:bg-primary/10 hover:shadow-sm">
                <Home className="mr-2 h-4 w-4 text-primary"/>{t('nav.home')}
              </Button>
              <Button variant="ghost" onClick={handleViewBrowse} className="text-foreground transition-all duration-200 hover:bg-primary/10 hover:shadow-sm">
                <ListChecks className="mr-2 h-4 w-4 text-primary"/>{t('nav.browse')}
              </Button>
              <Button variant="ghost" onClick={handleCreatePost} className="text-foreground transition-all duration-200 hover:bg-primary/10 hover:shadow-sm">
                <PlusCircle className="mr-2 h-4 w-4 text-primary"/>{t('nav.report')}
              </Button>
              <Button variant="ghost" onClick={() => navigate('/police')} className="text-foreground transition-all duration-200 hover:bg-primary/10 hover:shadow-sm">
                <Shield className="mr-2 h-4 w-4 text-primary"/>{t('nav.police')}
              </Button>
            </nav>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="p-1 transition-all duration-200 hover:bg-primary/10 hover:shadow-sm" onClick={() => setIsMobileMenuOpen(true)}>
                  <Menu className="h-5 w-5 text-primary" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 border-r">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between px-4 py-3 border-b">
                    <img className="h-7 w-auto" src={Logo} alt="Logo" onClick={() => { setIsMobileMenuOpen(false); handleViewHome(); }} />
                  </div>
                  <nav className="flex flex-col gap-1 px-2 py-4">
                    <Button variant="ghost" onClick={() => { setIsMobileMenuOpen(false); handleViewHome(); }} className="justify-start text-foreground transition-all duration-200 hover:translate-x-1 hover:shadow-sm">
                      <Home className="mr-2 h-4 w-4 text-primary"/>{t('nav.home')}
                    </Button>
                    <Button variant="ghost" onClick={() => { setIsMobileMenuOpen(false); handleViewBrowse(); }} className="justify-start text-foreground transition-all duration-200 hover:translate-x-1 hover:shadow-sm">
                      <ListChecks className="mr-2 h-4 w-4 text-primary"/>{t('nav.browse')}
                    </Button>
                    <Button variant="ghost" onClick={() => { setIsMobileMenuOpen(false); handleCreatePost(); }} className="justify-start text-foreground transition-all duration-200 hover:translate-x-1 hover:shadow-sm">
                      <PlusCircle className="mr-2 h-4 w-4 text-primary"/>{t('nav.report')}
                    </Button>
                    <Button variant="ghost" onClick={() => { setIsMobileMenuOpen(false); navigate('/police'); }} className="justify-start text-foreground transition-all duration-200 hover:translate-x-1 hover:shadow-sm">
                      <Shield className="mr-2 h-4 w-4 text-primary"/>{t('nav.police')}
                    </Button>
                  </nav>
                  <div className="px-4 py-4 border-t mt-auto">
                    <LanguageSelector />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;