import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'fr' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
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
    'toast.loading': 'Publication en cours...',
    'toast.error': 'Erreur lors de la publication',
    'image.main': 'Image principale',
    'image.select.main': 'Définir comme image principale',
    'image.remove': 'Supprimer cette image',
    'image.count': 'Image {current} sur {total}',
    'image.upload.multiple': 'Vous pouvez télécharger plusieurs photos',
    'image.main.info': 'Cliquez sur une image pour la définir comme principale',

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
    'page.police.contentText': 'Liste des commissariats à proximité.',
    'page.police.getDirections': 'Obtenir l\'itinéraire',
    'page.police.loadingLocation': 'Chargement de votre position...',
    'page.police.locationError': 'Impossible d\'obtenir votre position. Veuillez autoriser l\'accès à la localisation.',
    'page.police.distanceAway': '{distance} km',
    'page.police.geolocationNotSupported': 'La géolocalisation n\'est pas supportée par ce navigateur.',
    'page.police.showingNearestFirst': 'Affichage des plus proches en premier.',
    
    // CreatePostPage
    'page.createpost.toast.loading': 'Publication en cours...',
    'page.createpost.toast.success': 'Signalement publié avec succès!',
    'page.createpost.toast.error.generic': 'Erreur lors de la publication. Veuillez réessayer.',
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
    'toast.loading': 'جاري النشر...',
    'toast.error': 'خطأ في النشر',
    'image.main': 'الصورة الرئيسية',
    'image.select.main': 'تعيين كصورة رئيسية',
    'image.remove': 'إزالة هذه الصورة',
    'image.count': 'صورة {current} من {total}',
    'image.upload.multiple': 'يمكنك تحميل عدة صور',
    'image.main.info': 'انقر على صورة لتعيينها كصورة رئيسية',

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
    'page.police.contentText': 'قائمة مراكز الشرطة القريبة.',
    'page.police.getDirections': 'الحصول على الاتجاهات',
    'page.police.loadingLocation': 'جاري تحميل موقعك...',
    'page.police.locationError': 'تعذر الحصول على موقعك. يرجى السماح بالوصول إلى الموقع.',
    'page.police.distanceAway': '{distance} كم',
    'page.police.geolocationNotSupported': 'المتصفح لا يدعم خدمة تحديد الموقع.',
    'page.police.showingNearestFirst': 'يتم عرض الأقرب أولاً.',
    
    // CreatePostPage
    'page.createpost.toast.loading': 'جاري النشر...',
    'page.createpost.toast.success': 'تم نشر البلاغ بنجاح!',
    'page.createpost.toast.error.generic': 'خطأ في النشر. يرجى المحاولة مرة أخرى.',
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation = (translations[language] && translations[language][key]) || key;
    if (params) {
      Object.keys(params).forEach(paramKey => {
        translation = translation.replace(`{${paramKey}}`, String(params[paramKey]));
      });
    }
    return translation;
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