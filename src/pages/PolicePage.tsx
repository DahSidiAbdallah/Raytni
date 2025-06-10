import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, MapPin, Navigation, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icon in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom marker icons
const policeIcon = new L.Icon({
  iconUrl: '/police-marker.png',
  iconRetinaUrl: '/police-marker.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  shadowUrl: markerShadow,
  shadowSize: [41, 41],
  shadowAnchor: [12, 41]
});

const userIcon = new L.Icon({
  iconUrl: '/user-marker.png',
  iconRetinaUrl: '/user-marker.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  shadowUrl: markerShadow,
  shadowSize: [41, 41],
  shadowAnchor: [12, 41]
});

// Fallback to default icons if custom icons fail to load
const fallbackToDefaultIcons = () => {
  policeIcon.options.iconUrl = markerIcon;
  policeIcon.options.iconRetinaUrl = markerIcon2x;
  userIcon.options.iconUrl = markerIcon;
  userIcon.options.iconRetinaUrl = markerIcon2x;
};

// Try to preload the custom icons
const preloadIcons = () => {
  const policeImg = new Image();
  policeImg.src = '/police-marker.png';
  policeImg.onerror = fallbackToDefaultIcons;
  
  const userImg = new Image();
  userImg.src = '/user-marker.png';
  userImg.onerror = fallbackToDefaultIcons;
};

preloadIcons();

interface Commissariat {
  id: string;
  name: string;
  address: string;
  phone: string;
  position: [number, number];
  distance?: number; // Distance in km
}

// Commissariats data
const commissariats: Commissariat[] = [
  {
    id: '1',
    name: 'Commissariat Central de Nouakchott',
    address: 'Avenue Gamal Abdel Nasser, Nouakchott',
    phone: '+222 45 25 12 34',
    position: [18.0858, -15.9785],
  },
  {
    id: '2',
    name: 'Commissariat de Police de Nouadhibou',
    address: 'Rue de la Police, Nouadhibou',
    phone: '+222 46 25 12 35',
    position: [20.9333, -17.0333],
  },
  {
    id: '3',
    name: 'Commissariat de Police de Kiffa',
    address: 'Centre-ville, Kiffa',
    phone: '+222 47 25 12 36',
    position: [16.6200, -11.4042],
  },
  {
    id: '4',
    name: 'Commissariat de Police de Rosso',
    address: 'Quartier Administratif, Rosso',
    phone: '+222 48 25 12 37',
    position: [16.5133, -15.8053],
  },
  {
    id: '5',
    name: 'Commissariat de Tevragh Zeina',
    address: 'Près de l\'ancien aéroport, Nouakchott',
    phone: '+222 45 29 84 21',
    position: [18.1023, -15.9532],
  },
  {
    id: '6',
    name: 'Commissariat de Ksar',
    address: 'Quartier Ksar, Nouakchott',
    phone: '+222 45 25 39 46',
    position: [18.0912, -15.9612],
  },
  {
    id: '7',
    name: 'Commissariat d\'Arafat',
    address: 'Quartier Arafat, Nouakchott',
    phone: '+222 45 25 76 54',
    position: [18.0645, -15.9432],
  },
];

// Component to recenter map when user location changes
function RecenterMap({ position }: { position: [number, number] | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.setView(position, 10);
    }
  }, [position, map]);
  
  return null;
}

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
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [sortedCommissariats, setSortedCommissariats] = useState<Commissariat[]>(commissariats);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [sortByProximity, setSortByProximity] = useState(false);
  const [mapZoom, setMapZoom] = useState(6);

  // Get user location on component mount
  useEffect(() => {
    getUserLocation();
  }, []);

  // Function to get user location
  const getUserLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setLocationError(null);
          setIsLoadingLocation(false);
          setSortByProximity(true); // Automatically sort by proximity when location is available
          setMapZoom(10); // Zoom in when we have user location
        },
        (error) => {
          console.error("Error getting location: ", error);
          setLocationError(t('page.police.locationError'));
          setIsLoadingLocation(false);
          setSortByProximity(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocationError(t('page.police.geolocationNotSupported'));
      setIsLoadingLocation(false);
      setSortByProximity(false);
    }
  };

  // Sort commissariats by distance when user location changes or sort preference changes
  useEffect(() => {
    if (userLocation) {
      // Calculate distance for each commissariat
      const commissariatsWithDistance = commissariats.map(commissariat => {
        const distance = getDistanceFromLatLonInKm(
          userLocation[0], 
          userLocation[1], 
          commissariat.position[0], 
          commissariat.position[1]
        );
        
        return {
          ...commissariat,
          distance
        };
      });
      
      // Sort by distance if sortByProximity is true
      if (sortByProximity) {
        commissariatsWithDistance.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
      } else {
        // Otherwise sort by name
        commissariatsWithDistance.sort((a, b) => a.name.localeCompare(b.name));
      }
      
      setSortedCommissariats(commissariatsWithDistance);
    } else {
      // If no user location, sort by name
      setSortedCommissariats([...commissariats].sort((a, b) => a.name.localeCompare(b.name)));
    }
  }, [userLocation, sortByProximity, t]);

  // Function to toggle sorting by proximity
  const toggleSortByProximity = () => {
    if (!userLocation) {
      getUserLocation();
    } else {
      setSortByProximity(!sortByProximity);
    }
  };

  // Function to get directions to a commissariat
  const handleGetDirections = (lat: number, lon: number) => {
    if (userLocation) {
      window.open(`https://www.google.com/maps/dir/?api=1&origin=${userLocation[0]},${userLocation[1]}&destination=${lat},${lon}`, '_blank');
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
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="text-2xl md:text-3xl font-bold text-center md:text-left text-gray-800 flex items-center">
            <Shield className="h-8 w-8 mr-3 text-indigo-600" />
            {t('page.police.title')}
          </CardTitle>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={getUserLocation} 
              variant="outline"
              disabled={isLoadingLocation}
              className="flex items-center gap-2"
            >
              {isLoadingLocation ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {t('page.police.refreshLocation')}
            </Button>
            
            <Button 
              onClick={toggleSortByProximity}
              variant={sortByProximity ? "default" : "outline"}
              disabled={!userLocation || isLoadingLocation}
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              {sortByProximity ? t('page.police.showAlphabetical') : t('page.police.showByProximity')}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoadingLocation && (
            <div className="flex items-center justify-center py-6 text-gray-600">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {t('page.police.loadingLocation')}
            </div>
          )}
          
          {locationError && !isLoadingLocation && (
            <div className="my-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-md flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
              <p>{locationError}</p>
            </div>
          )}
          
          {!isLoadingLocation && !locationError && userLocation && (
            <p className="text-sm text-gray-600 text-center mb-4">
              {t('page.police.contentText')}{' '}
              {sortByProximity && t('page.police.showingNearestFirst')}
            </p>
          )}
          
          {/* Map Section */}
          <div className="h-96 w-full rounded-lg overflow-hidden shadow-md border border-gray-200 mt-4">
            <MapContainer 
              center={userLocation || [18.0858, -15.9785]} 
              zoom={mapZoom} 
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* User location marker */}
              {userLocation && (
                <Marker 
                  position={userLocation} 
                  icon={userIcon}
                >
                  <Popup>
                    <div className="font-semibold">{t('page.police.yourLocation')}</div>
                  </Popup>
                </Marker>
              )}
              
              {/* Commissariat markers */}
              {sortedCommissariats.map((c) => (
                <Marker 
                  key={c.id} 
                  position={c.position} 
                  icon={policeIcon}
                >
                  <Popup>
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-sm text-gray-700">{c.address}</div>
                    {c.distance !== undefined && (
                      <div className="text-sm text-indigo-600 font-medium mt-1">
                        {t('page.police.distanceAway', { distance: c.distance })}
                      </div>
                    )}
                    <div className="text-sm text-blue-700 mt-1 flex items-center gap-1">
                      <Button 
                        size="sm" 
                        className="mt-2 w-full"
                        onClick={() => handleGetDirections(c.position[0], c.position[1])}
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        {t('page.police.getDirections')}
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              ))}
              
              {/* Component to recenter map when user location changes */}
              <RecenterMap position={userLocation} />
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      {/* Commissariats List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCommissariats.map((commissariat) => (
          <Card key={commissariat.id} className="flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                <MapPin className="h-6 w-6 mr-2 text-indigo-500 flex-shrink-0" />
                <span className="truncate">{commissariat.name}</span>
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">{commissariat.address}</p>
            </CardHeader>
            
            <CardContent className="flex-grow py-2">
              <div className="flex items-center text-gray-700">
                <span className="font-medium">{commissariat.phone}</span>
              </div>
              
              {commissariat.distance !== undefined && (
                <div className="mt-2 flex items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    <MapPin className="h-3 w-3 mr-1" />
                    {t('page.police.distanceAway', { distance: commissariat.distance })}
                  </span>
                </div>
              )}
            </CardContent>
            
            <CardFooter>
              <Button 
                onClick={() => handleGetDirections(commissariat.position[0], commissariat.position[1])} 
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