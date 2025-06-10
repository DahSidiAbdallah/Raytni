import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'fr' | 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  fr: {
    'app.name': 'TrouveMauritanie',
    'nav.home': 'Accueil',
    'nav.browse': 'Parcourir',
    'nav.report': 'Signaler',
    'hero.title': 'Retrouvez ce qui compte le plus',
    'hero.subtitle': 'Plateforme dédiée à la recherche de personnes disparues et d\'objets perdus en Mauritanie',
    'hero.getStarted': 'Commencer',
    'hero.learnMore': 'En savoir plus',
    'features.findPeople': 'Retrouver des personnes',
    'features.findPeople.desc': 'Signalez et recherchez des personnes disparues',
    'features.findItems': 'Retrouver des objets',
    'features.findItems.desc': 'Retrouvez vos biens perdus ou volez',
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
    'browse.title': 'Parcourir les publications',
    'browse.subtitle': 'Explorez toutes les publications actives',
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
    'app.name': 'العثور موريتانيا',
    'nav.home': 'الرئيسية',
    'nav.browse': 'تصفح',
    'nav.report': 'بلاغ',
    'hero.title': 'اعثر على ما يهمك أكثر',
    'hero.subtitle': 'منصة مخصصة للبحث عن الأشخاص المفقودين والأشياء الضائعة في موريتانيا',
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
    'browse.title': 'تصفح المنشورات',
    'browse.subtitle': 'استكشف جميع المنشورات النشطة',
    'home.recentPosts': 'التقارير الأخيرة',
    'home.recentPosts.subtitle': 'اكتشف أحدث تقارير المجتمع',
    'home.noPosts': 'لا توجد تقارير في الوقت الحالي',
    'home.noPosts.subtitle': 'كن أول من ينشر تقريراً',
    'home.createPost': 'إنشاء تقرير',
    'home.viewAll': 'عرض جميع التقارير',
    'status.lost': 'مفقود',
    'status.found': 'موجود',
    'toast.success': '✅ تم نشر التقرير بنجاح!',
    'toast.success.desc': 'تقريرك مرئي الآن للمجتمع.'
  },
  en: {
    'app.name': 'TrouveMauritanie',
    'nav.home': 'Home',
    'nav.browse': 'Browse',
    'nav.report': 'Report',
    'hero.title': 'Find What Matters Most',
    'hero.subtitle': 'Platform dedicated to finding missing persons and lost items in Mauritania',
    'hero.getStarted': 'Get Started',
    'hero.learnMore': 'Learn More',
    'features.findPeople': 'Find People',
    'features.findPeople.desc': 'Report and search for missing persons',
    'features.findItems': 'Find Items',
    'features.findItems.desc': 'Recover your lost or stolen belongings',
    'features.community': 'United Community',
    'features.community.desc': 'Together, we can help each other',
    'post.contactInfo': 'Contact Information',
    'post.phone': 'Phone',
    'post.email': 'Email',
    'post.location': 'Location',
    'post.description': 'Description',
    'post.readMore': 'Read More',
    'post.readLess': 'Read Less',
    'loading.posts': 'Loading posts...',
    'loading.text': 'Loading...',
    'browse.title': 'Browse Posts',
    'browse.subtitle': 'Explore all active posts',
    'home.recentPosts': 'Recent Reports',
    'home.recentPosts.subtitle': 'Discover the latest community reports',
    'home.noPosts': 'No reports at the moment',
    'home.noPosts.subtitle': 'Be the first to post a report',
    'home.createPost': 'Create Report',
    'home.viewAll': 'View All Reports',
    'status.lost': 'LOST',
    'status.found': 'FOUND',
    'toast.success': '✅ Report published successfully!',
    'toast.success.desc': 'Your report is now visible to the community.'
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string): string => {
    return translations[language][key] || key;
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
