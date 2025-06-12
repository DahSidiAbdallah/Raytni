import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/MainLayout";

const SafetyTipsPage = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/" className="text-blue-600 hover:underline mb-4 block">
          &larr; Retour à l'accueil
        </Link>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center">
              <ShieldCheck className="h-8 w-8 mr-2 text-green-600" />
              Conseils de Sécurité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">
              Voici quelques conseils pour assurer votre sécurité et celle de vos biens lors de l'utilisation de notre plateforme :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Vérifiez l'identité :</strong> Si vous rencontrez quelqu'un pour un objet trouvé/perdu, faites-le dans un lieu public et bien éclairé. Informez un ami ou un membre de votre famille de votre lieu de rendez-vous.</li>
              <li><strong>Informations personnelles :</strong> Ne partagez jamais d'informations personnelles sensibles (numéro de carte d'identité, informations bancaires) via la messagerie de la plateforme.</li>
              <li><strong>Méfiez-vous des offres suspectes :</strong> Soyez prudent si une offre semble trop belle pour être vraie ou si l'on vous demande de payer des frais à l'avance.</li>
              <li><strong>Signalements :</strong> Utilisez des descriptions claires et précises, mais évitez de donner des détails qui pourraient être exploités (par exemple, quand votre maison est vide).</li>
              <li><strong>Mot de passe :</strong> Utilisez un mot de passe fort et unique pour votre compte sur la plateforme.</li>
              <li><strong>Contacter la police :</strong> Pour les objets de grande valeur ou les situations suspectes, n'hésitez pas à contacter les autorités compétentes.</li>
            </ul>
            <p className="mt-6 text-sm text-gray-600">
              Votre sécurité est notre priorité. Soyez vigilant et utilisez la plateforme de manière responsable.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SafetyTipsPage;