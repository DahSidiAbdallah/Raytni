import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const PolicePage = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link to="/" className="text-indigo-600 hover:text-indigo-800 transition-colors duration-150 ease-in-out">
          {t('page.police.backLink')}
        </Link>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold text-center text-gray-800 flex items-center justify-center">
            <Shield className="h-8 w-8 mr-3 text-indigo-600" />
            {t('page.police.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-4">
          <p className="text-lg text-gray-700 text-center">
            {t('page.police.contentText')}
          </p>
          {/* TODO: Add map and list of police stations here */}
          <div className="mt-6 h-64 bg-gray-200 rounded-md flex items-center justify-center">
            <p className="text-gray-500">Map placeholder</p>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Liste des commissariats (Exemple)</h3>
            <ul className="space-y-3">
              <li className="p-3 bg-gray-50 rounded-md shadow-sm">Commissariat Central de Nouakchott</li>
              <li className="p-3 bg-gray-50 rounded-md shadow-sm">Commissariat de Tevragh Zeina</li>
              <li className="p-3 bg-gray-50 rounded-md shadow-sm">Commissariat de Ksar</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PolicePage; 