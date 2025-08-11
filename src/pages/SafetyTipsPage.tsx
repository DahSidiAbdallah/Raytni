import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";

const SafetyTipsPage = () => {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';

  return (
    <MainLayout>
      <div className={`max-w-4xl mx-auto px-4 py-8 ${isRTL ? 'text-right' : ''}`}>
        <Link to="/" className="text-blue-600 hover:underline mb-4 block">
          {t('page.safetyTips.back')}
        </Link>
        <Card>
          <CardHeader>
            <CardTitle className={`text-2xl text-center flex items-center justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <ShieldCheck className={`h-8 w-8 text-green-600 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('page.safetyTips.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">
              {t('page.safetyTips.intro')}
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>{t('page.safetyTips.tipIdentity')}</li>
              <li>{t('page.safetyTips.tipPersonalInfo')}</li>
              <li>{t('page.safetyTips.tipSuspicious')}</li>
              <li>{t('page.safetyTips.tipReports')}</li>
              <li>{t('page.safetyTips.tipPassword')}</li>
              <li>{t('page.safetyTips.tipPolice')}</li>
            </ul>
            <p className="mt-6 text-sm text-gray-600">
              {t('page.safetyTips.footer')}
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SafetyTipsPage;