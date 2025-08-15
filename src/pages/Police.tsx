import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, MapPin, ArrowLeft, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { getCurrentPosition } from '@/services/locationService';
import LeafletMap from '@/components/LeafletMap';
import { useLanguage } from '@/contexts/LanguageContext';

// Example commissariats data
interface Commissariat {
  name: string;
  address: string;
  phone: string;
  position: [number, number];
  distance?: number; // Add distance property
}

const commissariats: Commissariat[] = [
  {
    name: 'Commissariat de Tevragh Zeina 1',
    address: 'Tevragh Zeina, Nouakchott',
    phone: '+22245252310',
    position: [18.0947, -15.9736],
  },
  {
    name: 'Commissariat de Tevragh Zeina 2',
    address: 'Tevragh Zeina, Nouakchott',
    phone: '+22245242952',
    position: [18.0925, -15.9712],
  },
  {
    name: 'Commissariat de Ksar 1',
    address: 'Ksar, Nouakchott',
    phone: '+22245252166',
    position: [18.0858, -15.9785],
  },
  {
    name: 'Commissariat de Ksar 2',
    address: 'Ksar, Nouakchott',
    phone: '+22245252738',
    position: [18.0835, -15.9768],
  },
  {
    name: 'Commissariat du Port 1',
    address: 'Port de Nouakchott',
    phone: '+22245251297',
    position: [18.0320, -15.9750],
  },
  {
    name: 'Commissariat du Port 2',
    address: 'Port de Nouakchott',
    phone: '+22245242524',
    position: [18.0298, -15.9738],
  },
  {
    name: 'Commissariat de Sebkha 1',
    address: 'Sebkha, Nouakchott',
    phone: '+22245253821',
    position: [18.0645, -15.9802],
  },
  {
    name: 'Commissariat de Sebkha 2',
    address: 'Sebkha, Nouakchott',
    phone: '+22245242982',
    position: [18.0622, -15.9785],
  },
  {
    name: 'Commissariat de Riyadh 1',
    address: 'Riyadh, Nouakchott',
    phone: '+22245242935',
    position: [18.0250, -15.9170],
  },
  {
    name: 'Commissariat de Riyadh 2',
    address: 'Riyadh, Nouakchott',
    phone: '+22245242950',
    position: [18.0228, -15.9145],
  },
  {
    name: 'Commissariat de Arafat 1',
    address: 'Arafat, Nouakchott',
    phone: '+22245251013',
    position: [18.0511, -15.9433],
  },
  {
    name: 'Commissariat Dar Naïm',
    address: 'Route de l’Espoir, Dar Naïm',
    phone: '+22245251241',
    position: [18.1545, -15.8902],
  },
  {
    name: 'Commissariat de Toujounine 1',
    address: 'Toujounine, Nouakchott',
    phone: '+22245252930',
    position: [18.1080, -15.8765],
  },
  {
    name: 'Commissariat de Tiyaret 1',
    address: 'Teyaret, Nouakchott',
    phone: '+22245252471',
    position: [18.1200, -15.9620],
  },
  {
    name: 'Commissariat de Dar Naïm 2',
    address: 'Dar Naïm, Nouakchott',
    phone: '+22245242938',
    position: [18.1522, -15.8885],
  },
  {
    name: 'Commissariat de Tiyaret 2',
    address: 'Teyaret, Nouakchott',
    phone: '+22245242951',
    position: [18.1178, -15.9598],
  },
  {
    name: 'Police de l\'aéroport',
    address: 'Aéroport International Oumtounsy, Nouakchott',
    phone: '+22245252183',
    position: [18.3100, -15.9450],
  },
];

// Remove the old fix for default marker icon in Leaflet
// if (typeof window !== 'undefined') {
//   L.Icon.Default.mergeOptions({
//     iconRetinaUrl: markerIcon2x,
//     iconUrl: markerIcon,
//     shadowUrl: markerShadow,
//   });
// }

export default function PolicePage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [sortByProximity, setSortByProximity] = useState(false);
  const [sortedCommissariats, setSortedCommissariats] = useState<Commissariat[]>(commissariats);
  const [locationStatus, setLocationStatus] = useState<'requesting' | 'granted' | 'denied' | 'unavailable' | null>(null);
  const [permissionState, setPermissionState] = useState<string>('unknown');

  // Check permission status immediately
  useEffect(() => {
    const checkPermissionStatus = async () => {
      try {
        if ('permissions' in navigator) {
          const permission = await navigator.permissions.query({ name: 'geolocation' });
          setPermissionState(permission.state);
          console.log('Initial permission state:', permission.state);
          
          // Listen for permission changes
          permission.onchange = () => {
            console.log('Permission state changed to:', permission.state);
            setPermissionState(permission.state);
          };
        } else {
          setPermissionState('not-supported');
          console.log('Permissions API not supported');
        }
      } catch (error) {
        console.error('Error checking permission status:', error);
        setPermissionState('error');
      }
    };
    
    checkPermissionStatus();
  }, []);

  // Helper function to show detailed permission help
  const showPermissionHelp = () => {
    const userAgent = navigator.userAgent;
    let instructions = '';
    
    if (userAgent.includes('Chrome')) {
      instructions = `Chrome:
1. Cliquez sur l'icône de cadenas/site à gauche de l'URL
2. Sélectionnez "Site settings" ou "Paramètres du site"
3. Changez "Location" de "Block" à "Allow"
4. Rechargez la page

Alternative:
- Tapez chrome://settings/content/location dans la barre d'adresse
- Supprimez ce site de la liste "Block"`;
    } else if (userAgent.includes('Firefox')) {
      instructions = `Firefox:
1. Cliquez sur l'icône de cadenas à gauche de l'URL
2. Cliquez sur "Connection secure" puis "More information"
3. Allez à l'onglet "Permissions"
4. Changez "Access your location" à "Allow"
5. Rechargez la page`;
    } else if (userAgent.includes('Safari')) {
      instructions = `Safari:
1. Menu Safari > Preferences > Websites
2. Sélectionnez "Location" dans la barre latérale
3. Changez ce site à "Allow"
4. Rechargez la page`;
    } else {
      instructions = `Étapes générales:
1. Cherchez l'icône de cadenas/site dans la barre d'adresse
2. Cliquez dessus et trouvez les paramètres de localisation
3. Changez de "Bloquer" à "Autoriser"
4. Rechargez la page

Si cela ne fonctionne pas, effacez les données du site dans les paramètres du navigateur.`;
    }
    
    alert(instructions);
  };

  useEffect(() => {
    // Use the direct approach that we know works
    console.log('Police component mounted, requesting location...');
    setLocationStatus('requesting');
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location obtained successfully:', position.coords);
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation([lat, lng]);
          setLocationStatus('granted');
          setSortByProximity(true);
        },
        (error) => {
          console.error('Location request failed:', error);
          setLocationStatus('denied');
          
          // Provide specific error messages based on error type
          let errorMessage = '';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = t('police.locationDenied');
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = t('police.locationUnavailable');
              break;
            case error.TIMEOUT:
              errorMessage = t('police.locationTimeout');
              break;
            default:
              errorMessage = t('police.locationError');
              break;
          }
          
          // Show a more helpful dialog with actionable steps
          if (confirm(`${errorMessage}\n\n${t('police.permissionHelp')}?`)) {
            // Open browser help or show detailed instructions
            showPermissionHelp();
          }
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes cache
        }
      );
    } else {
      setLocationStatus('unavailable');
    }
  }, []); // Only run once on mount

  // Function to calculate distance using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  useEffect(() => {
    if (sortByProximity && userLocation) {
      console.log('Sorting commissariats by proximity to:', userLocation);
      const sorted = [...commissariats].sort((a, b) => {
        const distanceA = calculateDistance(userLocation[0], userLocation[1], a.position[0], a.position[1]);
        const distanceB = calculateDistance(userLocation[0], userLocation[1], b.position[0], b.position[1]);
        return distanceA - distanceB;
      });
      
      // Add distances to the sorted commissariats for display
      const sortedWithDistances = sorted.map(commissariat => ({
        ...commissariat,
        distance: calculateDistance(userLocation[0], userLocation[1], commissariat.position[0], commissariat.position[1])
      }));
      
      console.log('Sorted commissariats:', sortedWithDistances.slice(0, 3));
      setSortedCommissariats(sortedWithDistances);
    } else {
      setSortedCommissariats(commissariats);
    }
  }, [sortByProximity, userLocation]);

  const requestLocationPermission = async (): Promise<boolean> => {
    if (!('geolocation' in navigator)) {
      alert('La géolocalisation n\'est pas supportée par votre navigateur.');
      return false;
    }

    // Check if we already have permission
    if ('permissions' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        if (permission.state === 'granted') {
          return true;
        } else if (permission.state === 'denied') {
          alert('L\'accès à la localisation a été refusé. Veuillez l\'autoriser dans les paramètres de votre navigateur.');
          return false;
        }
      } catch (error) {
        console.log('Permission API not supported, falling back to direct request');
      }
    }

    return true; // Proceed with location request
  };

  const handleSortByProximity = async () => {
    if (!userLocation) {
      console.log('Requesting location for proximity sorting...');
      setLocationStatus('requesting');
      
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('Location obtained for sorting:', position.coords);
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setUserLocation([lat, lng]);
            setLocationStatus('granted');
            setSortByProximity(true);
          },
          (error) => {
            console.error('Error getting location for sorting:', error);
            setLocationStatus('denied');
            setSortByProximity(false);
            
            // Show user-friendly error message
            let errorMessage = '';
            switch(error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = t('police.locationDenied');
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = t('police.locationUnavailable');
                break;
              case error.TIMEOUT:
                errorMessage = t('police.locationTimeout');
                break;
              default:
                errorMessage = t('police.locationError');
                break;
            }
            
            if (confirm(`${errorMessage}\n\n${t('police.permissionHelp')}?`)) {
              showPermissionHelp();
            }
          },
          {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 300000
          }
        );
      } else {
        setLocationStatus('unavailable');
        setSortByProximity(false);
      }
    } else {
      setSortByProximity(!sortByProximity); // Toggle if location is already known
    }
  };

  const openDirections = (destinationLat: number, destinationLng: number, commissariatName: string) => {
    if (userLocation) {
      // If we have the user's location, create a route from user to destination
      const origin = `${userLocation[0]},${userLocation[1]}`;
      const destination = `${destinationLat},${destinationLng}`;
      
      // Open Google Maps with directions
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
      window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
    } else {
      // If no user location, just show the destination and let user set their own starting point
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${destinationLat},${destinationLng}`;
      window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
      
      // Optionally, try to get location for future use
      handleSortByProximity();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-4 flex items-center text-primary hover:text-primary/80 hover:translate-x-1 transition-all duration-200"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        {t('police.back')}
      </button>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-center">{t('police.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <div className="text-lg font-semibold mb-3">Numéros d'urgence :</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <Phone className="h-4 w-4" /> 117 - Police d'urgence
                </div>
                <div className="flex items-center gap-2 text-green-700 font-bold">
                  <Phone className="h-4 w-4" /> 102 - Garde nationale
                </div>
                <div className="flex items-center gap-2 text-red-700 font-bold">
                  <Phone className="h-4 w-4" /> 118 - Pompiers
                </div>
                <div className="flex items-center gap-2 text-primary font-bold">
                  <Phone className="h-4 w-4" /> 116 - Gendarmerie nationale
                </div>
                <div className="flex items-center gap-2 text-orange-600 font-bold">
                  <Phone className="h-4 w-4" /> 119 - Sécurité routière
                </div>
              </div>
            </div>
            
            <div>
              <div className="text-lg font-semibold mb-3">Services spécialisés :</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <Phone className="h-4 w-4" /> 45253990 - Gendarmerie maritime
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  <Phone className="h-4 w-4" /> 45252518 - Brigade mixte de gendarmerie
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <Phone className="h-4 w-4" /> 45252159 - Direction générale de la sécurité
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <Phone className="h-4 w-4" /> 45255449 - Police judiciaire
                </div>
              </div>
            </div>
            
            <div>
              <div className="text-lg font-semibold mb-3">Contact :</div>
              <div className="text-primary font-medium">police@interieur.gov.mr</div>
              <div className="text-gray-600 text-sm mt-2">
                Pour toute urgence, composez le 117
              </div>
            </div>
          </div>

        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl text-center">Carte des Commissariats</CardTitle>
          <button 
            onClick={handleSortByProximity}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/80 hover:shadow-md hover:translate-y-[-1px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            disabled={locationStatus === 'requesting'}
          >
            {locationStatus === 'requesting' ? "Localisation..." : 
             sortByProximity ? "Afficher Tout" : "Trier par Proximité"}
          </button>
        </CardHeader>
        <CardContent>
          {locationStatus === 'requesting' && (
            <div className="mb-4 p-3 bg-primary/5 border border-primary/20 text-primary rounded-md">
              🌍 Demande d'accès à votre localisation...
            </div>
          )}
          {locationStatus === 'denied' && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  ⚠️ {t('police.denied')}. {t('police.locationDenied')}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={showPermissionHelp}
                    className="px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded hover:bg-primary/20 hover:shadow-sm hover:translate-y-[-1px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {t('police.permissionHelp')}
                  </button>
                  <button
                    onClick={handleSortByProximity}
                    className="px-3 py-1 text-xs font-medium text-amber-600 bg-amber-100 rounded hover:bg-amber-200 hover:shadow-sm hover:translate-y-[-1px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {t('police.resetPermissions')}
                  </button>
                </div>
              </div>
              <button 
                onClick={() => {
                  setLocationStatus('requesting');
                  handleSortByProximity();
                }}
                className="ml-2 px-3 py-1 bg-amber-600 text-white text-sm rounded hover:bg-amber-700 hover:shadow-sm hover:translate-y-[-1px] transition-all duration-200"
              >
                Réessayer
              </button>
            </div>
          )}
          {locationStatus === 'unavailable' && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              📍 Position indisponible. Vérifiez que le GPS est activé sur votre appareil.
              <button 
                onClick={() => {
                  setLocationStatus('requesting');
                  handleSortByProximity();
                }}
                className="ml-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 hover:shadow-sm hover:translate-y-[-1px] transition-all duration-200"
              >
                Réessayer
              </button>
            </div>
          )}
          {userLocation && sortByProximity && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
              ✅ Commissariats triés par distance de votre position
              <div className="text-sm mt-1">
                💡 Cliquez sur "Itinéraire" pour obtenir des directions vers n'importe quel commissariat
              </div>
            </div>
          )}
          
          <div className="h-96 w-full rounded-lg overflow-hidden">
            <LeafletMap 
              commissariats={sortedCommissariats}
              userLocation={userLocation}
              className="h-full w-full"
              onDirectionsClick={openDirections}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl text-center">Liste des Commissariats</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-gray-200">
            {sortedCommissariats.map((c, idx) => (
              <li key={idx} className="py-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" /> {c.name}
                      {c.distance && (
                        <span className="text-sm text-gray-500 font-normal">
                          ({c.distance.toFixed(1)} km)
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-700 ml-6">{c.address}</div>
                  </div>
                  
                  <div className="flex items-center gap-3 ml-6 md:ml-0">
                    <div className="text-primary font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <a href={`tel:${c.phone}`} onClick={e => e.stopPropagation()} className="hover:underline hover:text-primary/80 transition-colors duration-200">
                        {c.phone}
                      </a>
                    </div>
                    
                    <button
                      onClick={() => openDirections(c.position[0], c.position[1], c.name)}
                      className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 hover:shadow-sm hover:translate-y-[-1px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      title={userLocation ? `Itinéraire vers ${c.name}` : `Voir ${c.name} sur la carte`}
                    >
                      <Navigation className="h-4 w-4" />
                      Itinéraire
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}


