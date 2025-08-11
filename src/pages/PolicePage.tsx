import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, MapPin, Navigation, AlertTriangle, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  getCurrentPosition, 
  findNearestLocations,
  getDistanceFromLatLonInKm as getDistanceFromLatLonInKmService
} from '@/services/locationService';

interface Commissariat {
  id: string;
  name: string;
  address?: string;
  lat: number;
  lon: number;
  phone: string;
  distance?: number; // Distance in km
}

// Mock data - replace with actual data source later
const mockCommissariats: Commissariat[] = [
  { id: '1', name: 'Commissariat Central', address: 'Avenue Gamal Abdel Nasser, Nouakchott', lat: 18.0731, lon: -15.9582, phone: '+22245251234' },
  { id: '2', name: 'Commissariat Tevragh Zeina 1', address: "Près de l'ancien aéroport, Nouakchott", lat: 18.0988, lon: -15.9734, phone: '+22245251235' },
  { id: '3', name: 'Commissariat Ksar 2', address: 'Carrefour BMD, Nouakchott', lat: 18.0834, lon: -15.9681, phone: '+22245251236' },
  { id: '4', name: 'Commissariat Sebkha', address: 'Marché Sebkha, Nouakchott', lat: 18.0645, lon: -15.9802, phone: '+22245251237' },
  { id: '5', name: 'Commissariat Arafat 3', address: 'Carrefour Hay Mohammédia, Nouakchott', lat: 18.0511, lon: -15.9433, phone: '+22245251238' },
  { id: '6', name: 'Commissariat El Mina', address: 'Quartier El Mina, Nouakchott', lat: 18.0320, lon: -15.9750, phone: '+22245251239' },
  { id: '7', name: 'Commissariat Dar Naïm', address: 'Route de l’Espoir, Dar Naïm', lat: 18.1545, lon: -15.8902, phone: '+22245251240' },
  { id: '8', name: 'Commissariat Toujounine', address: 'Toujounine, Nouakchott', lat: 18.1080, lon: -15.8765, phone: '+22245251241' },
  { id: '9', name: 'Commissariat Teyaret', address: 'Teyaret, Nouakchott', lat: 18.1200, lon: -15.9620, phone: '+22245251242' },
  { id: '10', name: 'Commissariat Riyadh', address: 'Riyadh, Nouakchott', lat: 18.0250, lon: -15.9170, phone: '+22245251243' },
  { id: '11', name: 'Commissariat Nouadhibou', address: 'Avenue Maritime, Nouadhibou', lat: 20.9333, lon: -17.0333, phone: '+22246251244' },
  { id: '12', name: 'Commissariat Kiffa', address: 'Centre-ville, Kiffa', lat: 16.6200, lon: -11.4042, phone: '+22247251245' },
  { id: '13', name: 'Commissariat Rosso', address: 'Quartier Administratif, Rosso', lat: 16.5133, lon: -15.8053, phone: '+22248251246' },
  { id: '14', name: 'Commissariat Sélibaby', address: 'Sélibaby', lat: 15.1587, lon: -12.1842, phone: '+22249251247' },
  { id: '15', name: 'Commissariat Atar', address: 'Atar', lat: 20.5169, lon: -13.0499, phone: '+22250251248' },
];

import MainLayout from '@/components/MainLayout';
const PolicePage = () => {
  const { t } = useLanguage();
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [sortedCommissariats, setSortedCommissariats] = useState<Commissariat[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [sortByProximity, setSortByProximity] = useState(false);

  // Get user location on component mount
  useEffect(() => {
    const fetchLocation = async () => {
      setIsLoadingLocation(true);
      try {
        const coords = await getCurrentPosition();
        setUserLocation({ lat: coords.latitude, lon: coords.longitude });
        setLocationError(null);
        setSortByProximity(true);
      } catch (error) {
        setLocationError(t('page.police.locationError'));
        setSortByProximity(false);
      } finally {
        setIsLoadingLocation(false);
      }
    };
    fetchLocation();
  }, [t]);

  // Update sorted commissariats when user location changes or sort preference changes
  useEffect(() => {
    if (userLocation) {
      if (sortByProximity) {
        // Use the findNearestLocations function from the service
        const nearest = findNearestLocations(
          mockCommissariats.map(c => ({
            ...c,
            latitude: c.lat,
            longitude: c.lon
          })),
          { latitude: userLocation.lat, longitude: userLocation.lon },
          mockCommissariats.length // Show all commissariats but sorted by distance
        );
        
        setSortedCommissariats(nearest);
      } else {
        // Sort by name
        const sortedByName = [...mockCommissariats].sort((a, b) => 
          a.name.localeCompare(b.name)
        );
        setSortedCommissariats(sortedByName);
      }
    } else {
      // If no user location, just sort by name
      const sortedByName = [...mockCommissariats].sort((a, b) => 
        a.name.localeCompare(b.name)
      );
      setSortedCommissariats(sortedByName);
    }
  }, [userLocation, sortByProximity]);

  const toggleSortByProximity = async () => {
    if (!sortByProximity) {
      setIsLoadingLocation(true);
      try {
        // Request location permission first
        const coords = await getCurrentPosition();
        setUserLocation({ lat: coords.latitude, lon: coords.longitude });
        setLocationError(null);
        setSortByProximity(true);
      } catch (error) {
        setLocationError(t('page.police.locationError'));
        setSortByProximity(false);
      } finally {
        setIsLoadingLocation(false);
      }
    } else {
      setSortByProximity(false);
    }
  };


  const handleGetDirections = (lat: number, lon: number) => {
    if (userLocation) {
      window.open(`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lon}&destination=${lat},${lon}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`, '_blank');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link to="/" className="text-indigo-600 hover:text-indigo-800 transition-colors duration-150 ease-in-out">
          {t('page.police.backLink')}
        </Link>
      </div>
        
        <Card className="shadow-lg mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <Shield className="h-8 w-8 mr-3 text-indigo-600" />
              {t('page.police.title')}
            </CardTitle>
            
            <Button 
              onClick={toggleSortByProximity}
              variant={sortByProximity ? "default" : "outline"}
              disabled={isLoadingLocation}
              className="whitespace-nowrap"
            >
              {isLoadingLocation ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('page.police.loadingLocation')}
                </>
              ) : (
                sortByProximity ? "Trier par nom" : "Trier par proximité"
              )}
            </Button>
          </CardHeader>
          
          <CardContent className="mt-4">
            {locationError && (
              <div className="my-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-md flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <p>{locationError}</p>
              </div>
            )}
            
            {userLocation && sortByProximity && (
              <p className="text-sm text-gray-600 mb-4">
                {t('page.police.showingNearestFirst')}
              </p>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCommissariats.map((commissariat) => (
            <Card 
              key={commissariat.id} 
              className="group flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
            >
              <div className="relative
                bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900
                p-1 flex items-center justify-center h-32 overflow-hidden
                bg-[radial-gradient(theme(colors.blue.100)_1px,transparent_1px)]
                dark:bg-[radial-gradient(theme(colors.gray.700)_1px,transparent_1px)]
                bg-[length:20px_20px]"
              >
                <div className="absolute inset-0 bg-white/30 dark:bg-black/20 backdrop-blur-sm" />
                
                <div className="relative z-10 text-center p-4">
                  <div className="w-16 h-16 mx-auto mb-3 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                    <Shield className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">
                    return (
                      <MainLayout>
                        <div className="max-w-4xl mx-auto px-4 py-8">
                          <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
                            <Shield className="h-7 w-7 text-blue-600" />
                            {t('page.police.title')}
                          </h1>
                          {/* ...existing code for controls, error, and commissariats grid... */}
                        </div>
                      </MainLayout>
                    );
export default PolicePage;
