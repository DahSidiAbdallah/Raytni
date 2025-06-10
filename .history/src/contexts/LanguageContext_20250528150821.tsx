import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'fr' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  fr: {
    'app.name': 'Raytni',
    'nav.home': 'Accueil',
    'nav.browse': 'Parcourir',
    'nav.report': 'Signaler',
    'nav.police': 'Commissariats',
    'auth.signIn': 'Se connecter',
    'auth.signUp': 'S\'inscrire',
    'settings.language': 'Langue',
    'hero.title': 'Retrouvez ce qui compte le plus',
    'hero.subtitle': 'Plateforme Raytni dédiée à la recherche de personnes disparues et d\'objets perdus en Mauritanie',
    'hero.getStarted': 'Commencer',
    'hero.learnMore': 'En savoir plus',
    'features.findPeople': 'Retrouver des personnes',
    'features.findPeople.desc': 'Signalez et recherchez des personnes disparues',
    'features.findItems': 'Retrouver des objets',
    'features.findItems.desc': 'Retrouvez vos biens perdus ou volés',
    'features.community': 'Communauté unie',
    'features.community.desc': 'Ensemble, nous pouvons nous entraider',
    'post.contactInfo': 'Informations de contact',
    'post.phone': 'Téléphone',
    'post.email': 'Email',
    'post.location': 'Lieu',
    'post.description': 'Description',
    'post.readMore': 'Lire plus',
    'post.readLess': 'Lire moins',
    'loading.posts': 'Chargement des publications...',
    'loading.text': 'Chargement...',
    'browse.title': 'Parcourir les signalements',
    'browse.subtitle': 'Explorez tous les signalements actifs',
    'home.recentPosts': 'Signalements récents',
    'home.recentPosts.subtitle': 'Découvrez les derniers signalements de la communauté',
    'home.noPosts': 'Aucun signalement pour le moment',
    'home.noPosts.subtitle': 'Soyez le premier à publier un signalement',
    'home.createPost': 'Créer un signalement',
    'home.viewAll': 'Voir tous les signalements',
    'status.lost': 'PERDU',
    'status.found': 'TROUVÉ',
    'toast.success': '✅ Signalement publié avec succès!',
    'toast.success.desc': 'Votre signalement est maintenant visible par la communauté.'
  },
  ar: {
    'app.name': 'رايتني',
    'nav.home': 'الرئيسية',
    'nav.browse': 'تصفح',
    'nav.report': 'بلاغ',
    'nav.police': 'مراكز الشرطة',
    'auth.signIn': 'تسجيل الدخول',
    'auth.signUp': 'إنشاء حساب',
    'settings.language': 'اللغة',
    'hero.title': 'اعثر على ما يهمك أكثر',
    'hero.subtitle': 'منصة رايتني مخصصة للبحث عن الأشخاص المفقودين والأشياء الضائعة في موريتانيا',
    'hero.getStarted': 'ابدأ الآن',
    'hero.learnMore': 'اعرف المزيد',
    'features.findPeople': 'العثور على الأشخاص',
    'features.findPeople.desc': 'بلغ عن الأشخاص المفقودين وابحث عنهم',
    'features.findItems': 'العثور على الأشياء',
    'features.findItems.desc': 'استرد ممتلكاتك المفقودة أو المسروقة',
    'features.community': 'مجتمع متحد',
    'features.community.desc': 'معاً، يمكننا مساعدة بعضنا البعض',
    'post.contactInfo': 'معلومات الاتصال',
    'post.phone': 'الهاتف',
    'post.email': 'البريد الإلكتروني',
    'post.location': 'الموقع',
    'post.description': 'الوصف',
    'post.readMore': 'اقرأ المزيد',
    'post.readLess': 'اقرأ أقل',
    'loading.posts': 'جارٍ تحميل المنشورات...',
    'loading.text': 'جارٍ التحميل...',
    'browse.title': 'تصفح البلاغات',
    'browse.subtitle': 'استكشف جميع البلاغات النشطة',
    'home.recentPosts': 'البلاغات الأخيرة',
    'home.recentPosts.subtitle': 'اكتشف أحدث بلاغات المجتمع',
    'home.noPosts': 'لا توجد بلاغات في الوقت الحالي',
    'home.noPosts.subtitle': 'كن أول من ينشر بلاغاً',
    'home.createPost': 'إنشاء بلاغ',
    'home.viewAll': 'عرض جميع البلاغات',
    'status.lost': 'مفقود',
    'status.found': 'موجود',
    'toast.success': '✅ تم نشر البلاغ بنجاح!',
    'toast.success.desc': 'بلاغك مرئي الآن للمجتمع.'
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string): string => {
    return (translations[language] && translations[language][key]) || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div className={language === 'ar' ? 'rtl' : 'ltr'} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
