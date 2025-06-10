import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from 'lucide-react';

const PolicePage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link to="/" className="text-indigo-600 hover:text-indigo-800 transition-colors">
          &larr; Retour à l'accueil
        </Link>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold text-center text-gray-800 flex items-center justify-center">
            <Shield className="h-8 w-8 mr-3 text-indigo-600" />
            Page des Commissariats (Police)
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-4">
          <p className="text-lg text-gray-700 text-center">
            Contenu de la page des commissariats à venir.
          </p>
          {/* TODO: Add map and list of police stations here */}
        </CardContent>
      </Card>
    </div>
  );
};

export default PolicePage; 