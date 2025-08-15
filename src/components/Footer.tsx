import { MapPin, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';
  return (
    <footer className={`bg-primary text-primary-foreground py-10 mt-16 w-full`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isRTL ? 'text-right' : ''}`}>
        <div className="grid md:grid-cols-3 gap-6"> 
          <div>
            <div className="flex items-center mb-3">
              <img src="/footer.png" alt="Logo" className="h-10 w-10" />
            </div>
            <p className="text-primary-foreground/80 text-sm">
              {t('footer.description')}
            </p>
          </div>
          
          <div>
            <h3 className="text-base font-medium mb-3">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2 text-primary-foreground/80 text-sm">
              <li><Link to="/create-post" className="hover:text-primary-foreground hover:translate-x-1 transition-all duration-200">{t('footer.reportMissing')}</Link></li>
              <li><Link to="/browse" className="hover:text-primary-foreground hover:translate-x-1 transition-all duration-200">{t('footer.browseReports')}</Link></li>
              <li><Link to="/safety-tips" className="hover:text-primary-foreground hover:translate-x-1 transition-all duration-200">{t('footer.safetyTips')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-base font-medium mb-3">{t('footer.contact')}</h3>
            <p className="text-primary-foreground/80 text-sm">
              {t('footer.contactDescription')}
            </p>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 mt-6 pt-6 text-center text-primary-foreground/60 text-sm">
          <p className="flex items-center justify-center">
            {t('footer.madeWithLove')} <Heart className="h-3 w-3 mx-1 text-red-400" /> {t('footer.forCommunity')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
