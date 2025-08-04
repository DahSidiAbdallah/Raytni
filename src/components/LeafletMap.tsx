import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for Leaflet default icons in Webpack environments
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface Commissariat {
  name: string;
  address: string;
  phone: string;
  position: [number, number];
  distance?: number;
}

interface LeafletMapProps {
  commissariats: Commissariat[];
  userLocation: [number, number] | null;
  className?: string;
  onDirectionsClick?: (destLat: number, destLng: number, name: string) => void;
}

const LeafletMap: React.FC<LeafletMapProps> = ({ 
  commissariats, 
  userLocation, 
  className = "h-96 w-full",
  onDirectionsClick
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const center: [number, number] = userLocation || [18.0858, -15.9785];
    const zoom = userLocation ? 13 : 6; // Increased zoom when user location is available

    mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstanceRef.current);

    // Add commissariat markers
    commissariats.forEach((commissariat, index) => {
      const distanceText = commissariat.distance ? ` (${commissariat.distance.toFixed(1)} km)` : '';
      
      const popupContent = `
        <div class="commissariat-popup">
          <div class="font-semibold">${commissariat.name}${distanceText}</div>
          <div class="text-sm text-gray-700 mb-2">${commissariat.address}</div>
          <div class="flex flex-col gap-2">
            <div class="text-sm text-blue-700">
              <a href="tel:${commissariat.phone}" class="hover:underline">
                📞 ${commissariat.phone}
              </a>
            </div>
            <button 
              class="itinerary-btn px-3 py-1 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 cursor-pointer"
              data-lat="${commissariat.position[0]}" 
              data-lng="${commissariat.position[1]}" 
              data-name="${commissariat.name}"
            >
              🧭 Itinéraire
            </button>
          </div>
        </div>
      `;

      const marker = L.marker(commissariat.position)
        .addTo(mapInstanceRef.current!)
        .bindPopup(popupContent);
        
      // Add click handler for the itinerary button after popup opens
      marker.on('popupopen', () => {
        const popup = marker.getPopup();
        if (popup && popup.getElement()) {
          const button = popup.getElement()?.querySelector('.itinerary-btn') as HTMLButtonElement;
          if (button && onDirectionsClick) {
            button.onclick = (e) => {
              e.preventDefault();
              const lat = parseFloat(button.dataset.lat!);
              const lng = parseFloat(button.dataset.lng!);
              const name = button.dataset.name!;
              onDirectionsClick(lat, lng, name);
            };
          }
        }
      });
    });

    // Add user location marker if available
    if (userLocation) {
      // Create a distinctive user location marker
      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: `
          <div style="
            width: 20px;
            height: 20px;
            background: linear-gradient(45deg, #3b82f6, #1d4ed8);
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
            position: relative;
          ">
            <div style="
              position: absolute;
              top: -15px;
              left: -15px;
              width: 50px;
              height: 50px;
              border: 2px solid #3b82f6;
              border-radius: 50%;
              opacity: 0.3;
              animation: userPulse 2s infinite;
            "></div>
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
        popupAnchor: [0, -13],
      });

      const userMarker = L.marker(userLocation, { icon: userIcon })
        .addTo(mapInstanceRef.current!)
        .bindPopup('📍 Votre position');

      // Add the pulse animation CSS to the map container
      const style = document.createElement('style');
      style.textContent = `
        @keyframes userPulse {
          0% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.1;
          }
          100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
        }
        .user-location-marker {
          background: transparent !important;
          border: none !important;
        }
      `;
      document.head.appendChild(style);

      // Open the popup to show user location
      userMarker.openPopup();

      // Center the map on user location with appropriate zoom when location is available
      mapInstanceRef.current!.setView(userLocation, 13, {
        animate: true,
        duration: 1 // Smooth animation to user location
      });
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [commissariats, userLocation]);

  // Separate effect to handle user location changes and maintain zoom
  useEffect(() => {
    if (mapInstanceRef.current && userLocation) {
      // When user location is updated, smoothly pan and zoom to their location
      mapInstanceRef.current.setView(userLocation, 13, {
        animate: true,
        duration: 1.5 // Smooth animation duration
      });
    }
  }, [userLocation]);

  return <div ref={mapRef} className={className} />;
};

export default LeafletMap;
