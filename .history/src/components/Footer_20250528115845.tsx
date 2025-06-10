import { MapPin, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="App Logo" className="h-10 w-auto mb-3" />
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">Mauritania FindItNow</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-center md:text-left">
          <div>
            <div className="flex items-center mb-4">
              <MapPin className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold">TrouveMauritanie</span>
            </div>
            <p className="text-gray-300">
              Plateforme communautaire pour retrouver ce qui compte le plus en Mauritanie.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Signaler une disparition</li>
              <li>Parcourir les signalements</li>
              <li>Conseils de sécurité</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-300">
              Pour toute question ou assistance, contactez notre équipe.
            </p>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-6">
          © {new Date().getFullYear()} Mauritania FindItNow. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
