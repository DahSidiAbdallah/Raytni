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
    'toast.success.desc': 'Votre signalement est maintenant visible par la communauté.',

    // SignInPage
    'page.signin.title': 'Se Connecter',
    'page.signin.description': 'Accédez à votre compte Raytni.',
    'page.signin.phoneLabel': 'Numéro de téléphone',
    'page.signin.passwordLabel': 'Mot de passe',
    'page.signin.passwordPlaceholder': 'Votre mot de passe',
    'page.signin.error': 'Échec de la connexion. Veuillez vérifier vos identifiants.',
    'page.signin.loadingButton': 'Connexion...',
    'page.signin.button': 'Se connecter',
    'page.signin.orSeparator': 'Ou',
    'page.signin.noAccount': 'Pas encore de compte ?',
    'page.signin.signUpLink': 'Inscrivez-vous ici',

    // SignUpPage
    'page.signup.title': 'Créer un Compte',
    'page.signup.description': 'Rejoignez la communauté Raytni dès aujourd\'hui.',
    'page.signup.nameLabel': 'Nom complet',
    'page.signup.namePlaceholder': 'Votre nom complet',
    'page.signup.sexLabel': 'Sexe',
    'page.signup.sexPlaceholder': 'Sélectionner votre sexe',
    'page.signup.sexMale': 'Homme',
    'page.signup.sexFemale': 'Femme',
    'page.signup.sexOther': 'Autre',
    'page.signup.passwordPlaceholder': 'Créer un mot de passe',
    'page.signup.confirmPasswordLabel': 'Confirmer le mot de passe',
    'page.signup.confirmPasswordPlaceholder': 'Confirmer le mot de passe',
    'page.signup.passwordsNoMatch': 'Les mots de passe ne correspondent pas.',
    'page.signup.photoLabel': 'Photo de profil (optionnel)',
    'page.signup.photoPreviewAlt': 'Aperçu',
    'page.signup.error': 'Échec de l\'inscription. Veuillez réessayer.',
    'page.signup.loadingButton': 'Création du compte...',
    'page.signup.button': 'S\'inscrire',
    'page.signup.hasAccount': 'Déjà un compte ?',
    'page.signup.signInLink': 'Connectez-vous ici',

    // PolicePage
    'page.police.backLink': '← Retour à l\'accueil',
    'page.police.title': 'Page des Commissariats',
    'page.police.contentText': 'Contenu de la page des commissariats à venir.',
    'page.police.listTitle': 'Liste des commissariats (Exemple)',
    'page.police.exampleListItem1': 'Commissariat Central de Nouakchott',
    'page.police.exampleListItem2': 'Commissariat de Tevragh Zeina',
    'page.police.exampleListItem3': 'Commissariat de Ksar',

    // Footer
    'footer.description': 'Plateforme communautaire pour retrouver ce qui compte le plus en Mauritanie.',
    'footer.quickLinksTitle': 'Liens rapides',
    'footer.reportLink': 'Signaler une disparition',
    'footer.browseLink': 'Parcourir les signalements',
    'footer.safetyTipsLink': 'Conseils de sécurité',
    'footer.contactTitle': 'Contact',
    'footer.contactText': 'Pour toute question ou assistance, contactez notre équipe.',
    'footer.copyright': 'Fait avec {heartIcon} pour la communauté mauritanienne'
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
    'toast.success.desc': 'بلاغك مرئي الآن للمجتمع.',

    // SignInPage
    'page.signin.title': 'تسجيل الدخول',
    'page.signin.description': 'الوصول إلى حسابك في رايتني.',
    'page.signin.phoneLabel': 'رقم الهاتف',
    'page.signin.passwordLabel': 'كلمة المرور',
    'page.signin.passwordPlaceholder': 'كلمة المرور الخاصة بك',
    'page.signin.error': 'فشل تسجيل الدخول. الرجاء التحقق من بياناتك.',
    'page.signin.loadingButton': 'جارٍ تسجيل الدخول...',
    'page.signin.button': 'تسجيل الدخول',
    'page.signin.orSeparator': 'أو',
    'page.signin.noAccount': 'ليس لديك حساب؟',
    'page.signin.signUpLink': 'أنشئ حساباً هنا',

    // SignUpPage
    'page.signup.title': 'إنشاء حساب جديد',
    'page.signup.description': 'انضم إلى مجتمع رايتني اليوم.',
    'page.signup.nameLabel': 'الاسم الكامل',
    'page.signup.namePlaceholder': 'اسمك الكامل',
    'page.signup.sexLabel': 'الجنس',
    'page.signup.sexPlaceholder': 'اختر جنسك',
    'page.signup.sexMale': 'ذكر',
    'page.signup.sexFemale': 'أنثى',
    'page.signup.sexOther': 'آخر',
    'page.signup.passwordPlaceholder': 'إنشاء كلمة مرور',
    'page.signup.confirmPasswordLabel': 'تأكيد كلمة المرور',
    'page.signup.confirmPasswordPlaceholder': 'تأكيد كلمة المرور',
    'page.signup.passwordsNoMatch': 'كلمتا المرور غير متطابقتين.',
    'page.signup.photoLabel': 'صورة الملف الشخصي (اختياري)',
    'page.signup.photoPreviewAlt': 'معاينة',
    'page.signup.error': 'فشل إنشاء الحساب. الرجاء المحاولة مرة أخرى.',
    'page.signup.loadingButton': 'جارٍ إنشاء الحساب...',
    'page.signup.button': 'إنشاء حساب',
    'page.signup.hasAccount': 'لديك حساب بالفعل؟',
    'page.signup.signInLink': 'سجل الدخول هنا',

    // PolicePage
    'page.police.backLink': '→ العودة إلى الرئيسية',
    'page.police.title': 'صفحة مراكز الشرطة',
    'page.police.contentText': 'محتوى صفحة مراكز الشرطة سيأتي لاحقاً.',
    'page.police.listTitle': 'قائمة مراكز الشرطة (مثال)',
    'page.police.exampleListItem1': 'المفوضية المركزية في نواكشوط',
    'page.police.exampleListItem2': 'مفوضية تفرغ زينة',
    'page.police.exampleListItem3': 'مفوضية لكصر',

    // Footer
    'footer.description': 'منصة مجتمعية للعثور على ما يهمكم في موريتانيا.',
    'footer.quickLinksTitle': 'روابط سريعة',
    'footer.reportLink': 'الإبلاغ عن مفقود',
    'footer.browseLink': 'تصفح البلاغات',
    'footer.safetyTipsLink': 'نصائح السلامة',
    'footer.contactTitle': 'اتصل بنا',
    'footer.contactText': 'لطرح الأسئلة أو طلب المساعدة، اتصل بفريقنا.',
    'footer.copyright': 'صنع بـ {heartIcon} للمجتمع الموريتاني'
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string): string => {
    // Ensure all keys from fr are also in ar, and vice-versa, for robustness, or handle missing keys more gracefully.
    const langTranslations = translations[language];
    if (langTranslations && typeof langTranslations[key] === 'string') {
      return langTranslations[key];
    }
    // Fallback to French if key is missing in current language but exists in French
    if (language !== 'fr' && translations.fr && typeof translations.fr[key] === 'string') {
      console.warn(`Translation for '${key}' not found in '${language}'. Falling back to French.`);
      return translations.fr[key];
    }
    // Fallback to the key itself if not found anywhere
    console.warn(`Translation for '${key}' not found in any language.`);
    return key;
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
