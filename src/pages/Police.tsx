import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, MapPin, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import markerIcon2xUrl from 'leaflet/dist/images/marker-icon-2x.png';
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { getCurrentPosition } from '@/services/locationService';

// Create a custom Leaflet icon
const customMarkerIcon = L.icon({
  iconRetinaUrl: markerIcon2xUrl,
  iconUrl: markerIconUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41], // Standard Leaflet icon size
  iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
  shadowSize: [41, 41] // Size of the shadow
});

// Example commissariats data
const commissariats = [
  {
    name: 'Commissariat Central de Nouakchott',
    address: 'Avenue Gamal Abdel Nasser, Nouakchott',
    phone: '+22245251234',
    position: [18.0858, -15.9785],
  },
  {
    name: 'Commissariat de Police de Nouadhibou',
    address: 'Rue de la Police, Nouadhibou',
    phone: '+22246251235',
    position: [20.9333, -17.0333],
  },
  {
    name: 'Commissariat de Police de Kiffa',
    address: 'Centre-ville, Kiffa',
    phone: '+22247251236',
    position: [16.6200, -11.4042],
  },
  {
    name: 'Commissariat de Police de Rosso',
    address: 'Quartier Administratif, Rosso',
    phone: '+22248251237',
    position: [16.5133, -15.8053],
  },
  {
    name: 'Commissariat Sebkha',
    address: 'Marché Sebkha, Nouakchott',
    phone: '+22245251238',
    position: [18.0645, -15.9802],
  },
  {
    name: 'Commissariat Arafat 3',
    address: 'Carrefour Hay Mohammédia, Nouakchott',
    phone: '+22245251239',
    position: [18.0511, -15.9433],
  },
  {
    name: 'Commissariat El Mina',
    address: 'Quartier El Mina, Nouakchott',
    phone: '+22245251240',
    position: [18.0320, -15.9750],
  },
  {
    name: 'Commissariat Dar Naïm',
    address: 'Route de l’Espoir, Dar Naïm',
    phone: '+22245251241',
    position: [18.1545, -15.8902],
  },
  {
    name: 'Commissariat Toujounine',
    address: 'Toujounine, Nouakchott',
    phone: '+22245251242',
    position: [18.1080, -15.8765],
  },
  {
    name: 'Commissariat Teyaret',
    address: 'Teyaret, Nouakchott',
    phone: '+22245251243',
    position: [18.1200, -15.9620],
  },
  {
    name: 'Commissariat Riyadh',
    address: 'Riyadh, Nouakchott',
    phone: '+22245251244',
    position: [18.0250, -15.9170],
  },
  {
    name: 'Commissariat Sélibaby',
    address: 'Sélibaby',
    phone: '+22249251245',
    position: [15.1587, -12.1842],
  },
  {
    name: 'Commissariat Atar',
    address: 'Atar',
    phone: '+22250251246',
    position: [20.5169, -13.0499],
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
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [sortByProximity, setSortByProximity] = useState(false);
  const [sortedCommissariats, setSortedCommissariats] = useState(commissariats);

  useEffect(() => {
    // Request location on component mount using the service helper
    getCurrentPosition()
      .then((coords) => {
        setUserLocation([coords.latitude, coords.longitude]);
      })
      .catch((error) => {
        console.error('Error getting user location on mount:', error);
      });
  }, []); // Empty dependency array ensures this runs only once on mount

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
      const sorted = [...commissariats].sort((a, b) => {
        const distanceA = calculateDistance(userLocation[0], userLocation[1], a.position[0], a.position[1]);
        const distanceB = calculateDistance(userLocation[0], userLocation[1], b.position[0], b.position[1]);
        return distanceA - distanceB;
      });
      setSortedCommissariats(sorted);
    } else {
      setSortedCommissariats(commissariats);
    }
  }, [sortByProximity, userLocation]);

  const handleSortByProximity = async () => {
    if (!userLocation) {
      try {
        const coords = await getCurrentPosition();
        setUserLocation([coords.latitude, coords.longitude]);
        setSortByProximity(true);
      } catch (error) {
        console.error('Error getting user location:', error);
        alert('Could not get your location. Please ensure location services are enabled.');
        setSortByProximity(false); // Fallback to showing all
      }
    } else {
      setSortByProximity(!sortByProximity); // Toggle if location is already known
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Retour
      </button>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Contact Police</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-lg font-semibold mb-2">Numéro d'urgence :</div>
              <div className="flex items-center gap-2 text-blue-700 text-xl font-bold mb-2">
                <Phone className="h-5 w-5" /> 117
              </div>
              <div className="text-gray-700">Pour toute urgence, appelez le 117 (Police nationale)</div>
            </div>
            <div>
              <div className="text-lg font-semibold mb-2">Email :</div>
              <div className="text-blue-700 font-medium">police@interieur.gov.mr</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl text-center">Carte des Commissariats</CardTitle>
          <button 
            onClick={handleSortByProximity}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {sortByProximity ? "Afficher Tout" : "Trier par Proximité"}
          </button>
        </CardHeader>
        <CardContent>
          <div className="h-96 w-full rounded-lg overflow-hidden">
            <MapContainer center={userLocation || [18.0858, -15.9785]} zoom={userLocation ? 10 : 6} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {sortedCommissariats.map((c, idx) => (
                <Marker key={idx} position={c.position as [number, number]} icon={customMarkerIcon}>
                  <Popup>
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-sm text-gray-700">{c.address}</div>
                    <div className="text-sm text-blue-700 mt-1 flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <a href={`tel:${c.phone}`} onClick={e => e.stopPropagation()} className="hover:underline">
                        {c.phone}
                      </a>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
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
              <li key={idx} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" /> {c.name}
                  </div>
                  <div className="text-sm text-gray-700 ml-6">{c.address}</div>
                </div>
                <div className="text-blue-700 font-medium flex items-center gap-2 ml-6 md:ml-0">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${c.phone}`} onClick={e => e.stopPropagation()} className="hover:underline">
                    {c.phone}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
} 


