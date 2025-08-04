import { MapPin, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img src="/footer.png" alt="Logo" className="h-16 w-16" />
            </div>
            <p className="text-gray-300">
              {t('footer.description')}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/create-post" className="hover:text-white transition-colors">{t('footer.reportMissing')}</Link></li>
              <li><Link to="/browse" className="hover:text-white transition-colors">{t('footer.browseReports')}</Link></li>
              <li><Link to="/safety-tips" className="hover:text-white transition-colors">{t('footer.safetyTips')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contact')}</h3>
            <p className="text-gray-300">
              {t('footer.contactDescription')}
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p className="flex items-center justify-center">
            {t('footer.madeWithLove')} <Heart className="h-4 w-4 mx-1 text-red-500" /> {t('footer.forCommunity')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
