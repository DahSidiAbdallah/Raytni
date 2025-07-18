import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Menu, X, Search as SearchIcon, Moon, Sun, Languages, Home, ListChecks, PlusCircle, LogIn, UserPlus, Shield } from 'lucide-react';
import Logo from '/logo.png';
import { useLanguage, Language } from "@/contexts/LanguageContext";

interface HeaderProps {
  onCreatePost: () => void;
  onViewBrowse: () => void;
  onViewHome: () => void;
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

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
              <img src={Logo} alt="Raytni Logo" className="h-12 w-auto" />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <nav className="space-x-4">
              <Button variant="ghost" onClick={onViewHome} className="text-gray-700 hover:text-indigo-600"><Home className="me-2 h-5 w-5"/>{t('nav.home')}</Button>
              <Button variant="ghost" onClick={onViewBrowse} className="text-gray-700 hover:text-indigo-600"><ListChecks className="me-2 h-5 w-5"/>{t('nav.browse')}</Button>
              <Button variant="ghost" onClick={onCreatePost} className="text-gray-700 hover:text-indigo-600"><PlusCircle className="me-2 h-5 w-5"/>{t('nav.report')}</Button>
              <Button variant="ghost" onClick={() => navigate('/police')} className="text-gray-700 hover:text-indigo-600"><Shield className="me-2 h-5 w-5"/>{t('nav.police')}</Button>
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <Button variant="outline" onClick={() => navigate('/signin')} className="text-indigo-600 border-indigo-500 hover:bg-indigo-50">
              <LogIn className="me-2 h-5 w-5" /> {t('auth.signIn')}
            </Button>
            <Button onClick={() => navigate('/signup')} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <UserPlus className="me-2 h-5 w-5" /> {t('auth.signUp')}
            </Button>
            <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
              <SelectTrigger className="w-auto text-gray-700 hover:text-indigo-600 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500">
                <Languages className="h-5 w-5" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:hidden flex items-center">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-700 hover:text-indigo-600">
                  {isMobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                </Button>
              </SheetTrigger>
              <SheetContent side={language === 'ar' ? 'right' : 'left'} className="w-64 p-6">
                <nav className="flex flex-col space-y-4">
                  <SheetClose asChild>
                    <Button variant="ghost" onClick={onViewHome} className="justify-start text-lg hover:text-indigo-600"><Home className="me-3 h-6 w-6"/>{t('nav.home')}</Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button variant="ghost" onClick={onViewBrowse} className="justify-start text-lg hover:text-indigo-600"><ListChecks className="me-3 h-6 w-6"/>{t('nav.browse')}</Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button variant="ghost" onClick={onCreatePost} className="justify-start text-lg hover:text-indigo-600"><PlusCircle className="me-3 h-6 w-6"/>{t('nav.report')}</Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button variant="ghost" onClick={() => { navigate('/police'); setIsMobileMenuOpen(false); }} className="justify-start text-lg hover:text-indigo-600"><Shield className="me-3 h-6 w-6"/>{t('nav.police')}</Button>
                  </SheetClose>
                  <hr className="my-4"/>
                  <SheetClose asChild>
                    <Button variant="outline" onClick={() => navigate('/signin')} className="justify-start text-lg text-indigo-600 border-indigo-500">
                       <LogIn className="me-3 h-6 w-6" /> {t('auth.signIn')}
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button onClick={() => navigate('/signup')} className="justify-start text-lg bg-indigo-600 hover:bg-indigo-700 text-white">
                      <UserPlus className="me-3 h-6 w-6" /> {t('auth.signUp')}
                    </Button>
                  </SheetClose>
                  <hr className="my-4"/>
                  <div className="pt-2">
                    <p className="text-sm font-medium text-gray-500 mb-2 text-start">{t('settings.language')}</p>
                    <Select value={language} onValueChange={(newLang) => { setLanguage(newLang as Language); setIsMobileMenuOpen(false); }}>
                        <SelectTrigger className="w-full focus:ring-indigo-500 focus:border-indigo-500">
                            <Languages className="me-2 h-5 w-5" /> 
                            <span>{language === 'fr' ? 'Français' : 'العربية'}</span>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="ar">العربية</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 