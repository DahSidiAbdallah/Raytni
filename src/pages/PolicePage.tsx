import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, MapPin, Navigation, AlertTriangle, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Commissariat {
  id: string;
  name: string;
  address?: string;
  lat: number;
  lon: number;
  distance?: number; // Distance in km
}

// Mock data - replace with actual data source later
const mockCommissariats: Commissariat[] = [
  { id: '1', name: 'Commissariat Central', address: 'Avenue Gamal Abdel Nasser, Nouakchott', lat: 18.0731, lon: -15.9582 },
  { id: '2', name: 'Commissariat Tevragh Zeina 1', address: 'Près de l\'ancien aéroport, Nouakchott', lat: 18.0988, lon: -15.9734 },
  { id: '3', name: 'Commissariat Ksar 2', address: 'Carrefour BMD, Nouakchott', lat: 18.0834, lon: -15.9681 },
  { id: '4', name: 'Commissariat Sebkha', address: 'Marché Sebkha, Nouakchott', lat: 18.0645, lon: -15.9802 },
  { id: '5', name: 'Commissariat Arafat 3', address: 'Carrefour Hay Mohammédia, Nouakchott', lat: 18.0511, lon: -15.9433 },
];

// Haversine formula to calculate distance between two points on Earth
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return parseFloat(distance.toFixed(1)); // Round to 1 decimal place
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

const PolicePage = () => {
  const { t } = useLanguage();
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [sortedCommissariats, setSortedCommissariats] = useState<Commissariat[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [sortByProximity, setSortByProximity] = useState(false);

  // Get user location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lon: longitude });
          setLocationError(null);
          setIsLoadingLocation(false);
          // Auto-sort by proximity when location is available
          setSortByProximity(true);
        },
        (error) => {
          console.error("Error getting location: ", error);
          setLocationError(t('page.police.locationError'));
          setIsLoadingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocationError(t('page.police.geolocationNotSupported'));
      setIsLoadingLocation(false);
    }
  }, [t]);

  // Update sorted commissariats when user location changes or sort preference changes
  useEffect(() => {
    if (userLocation) {
      // Calculate distances for all commissariats
      const commissariatsWithDistance = mockCommissariats.map(commissariat => ({
        ...commissariat,
        distance: getDistanceFromLatLonInKm(
          userLocation.lat, 
          userLocation.lon, 
          commissariat.lat, 
          commissariat.lon
        )
      }));
      
      // Sort by proximity if requested
      if (sortByProximity) {
        commissariatsWithDistance.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
      } else {
        // Otherwise sort by name
        commissariatsWithDistance.sort((a, b) => a.name.localeCompare(b.name));
      }
      
      setSortedCommissariats(commissariatsWithDistance);
    } else {
      // If no user location, just sort by name
      const unsortedCommissariats = mockCommissariats.map(commissariat => ({
        ...commissariat,
        distance: undefined
      }));
      setSortedCommissariats(unsortedCommissariats.sort((a, b) => a.name.localeCompare(b.name)));
    }
  }, [userLocation, sortByProximity]);

  const toggleSortByProximity = () => {
    if (!userLocation) {
      // Try to get location again if not available
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lon: longitude });
          setSortByProximity(true);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting location: ", error);
          setLocationError(t('page.police.locationError'));
          setIsLoadingLocation(false);
        }
      );
    } else {
      // Toggle sorting if location is available
      setSortByProximity(!sortByProximity);
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
          <Card key={commissariat.id} className="flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                <MapPin className="h-6 w-6 mr-2 text-indigo-500" />
                {commissariat.name} 
              </CardTitle>
              {commissariat.address && <p className="text-sm text-gray-500 mt-1">{commissariat.address}</p>}
            </CardHeader>
            
            <CardContent className="flex-grow py-2">
              {commissariat.distance !== undefined && (
                <p className="text-indigo-600 font-medium flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-indigo-400" />
                  {t('page.police.distanceAway', { distance: commissariat.distance })}
                </p>
              )}
            </CardContent>
            
            <CardFooter>
              <Button 
                onClick={() => handleGetDirections(commissariat.lat, commissariat.lon)} 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Navigation className="mr-2 h-5 w-5" />
                {t('page.police.getDirections')}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PolicePage;