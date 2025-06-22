
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation } from 'lucide-react';
import type { Temple } from '@/hooks/useTemples';

interface GoogleMapProps {
  temples: Temple[];
  selectedTemple?: Temple;
  onTempleSelect?: (temple: Temple) => void;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export const GoogleMap = ({ temples, selectedTemple, onTempleSelect }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC0DhPW6kdTF61dOcLbYABD249I8QU88U0&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google) return;

      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        zoom: 6,
        center: { lat: 20.5937, lng: 78.9629 }, // Center of India
        styles: [
          {
            featureType: 'poi.place_of_worship',
            stylers: [{ visibility: 'on' }, { color: '#ff6b35' }]
          }
        ]
      });

      setIsLoaded(true);
      addMarkers();
    };

    loadGoogleMaps();
  }, []);

  const addMarkers = () => {
    if (!mapInstance.current || !window.google) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    temples.forEach(temple => {
      if (temple.latitude && temple.longitude) {
        const marker = new window.google.maps.Marker({
          position: { lat: temple.latitude, lng: temple.longitude },
          map: mapInstance.current,
          title: temple.name,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#ff6b35" stroke="#fff" stroke-width="2"/>
                <text x="20" y="26" text-anchor="middle" fill="white" font-size="16">🛕</text>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(40, 40)
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="p-3 max-w-sm">
              <h3 class="font-bold text-orange-900">${temple.name}</h3>
              <p class="text-orange-700">${temple.location}</p>
              <p class="text-sm text-orange-600">${temple.deity}</p>
              <p class="text-xs text-gray-600 mt-2">${temple.timing}</p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(mapInstance.current, marker);
          onTempleSelect?.(temple);
        });

        markersRef.current.push(marker);
      }
    });
  };

  useEffect(() => {
    if (isLoaded) {
      addMarkers();
    }
  }, [temples, isLoaded]);

  useEffect(() => {
    if (selectedTemple && mapInstance.current && selectedTemple.latitude && selectedTemple.longitude) {
      mapInstance.current.panTo({
        lat: selectedTemple.latitude,
        lng: selectedTemple.longitude
      });
      mapInstance.current.setZoom(15);
    }
  }, [selectedTemple]);

  const centerOnUserLocation = () => {
    if (navigator.geolocation && mapInstance.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          mapInstance.current.setCenter(pos);
          mapInstance.current.setZoom(10);
        },
        () => {
          console.error('Geolocation failed');
        }
      );
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-orange-900 flex items-center gap-2">
            <MapPin size={20} />
            Temple Locations
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={centerOnUserLocation}
            className="border-orange-300 text-orange-700 hover:bg-orange-50"
          >
            <Navigation size={16} className="mr-2" />
            My Location
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div
          ref={mapRef}
          className="w-full h-96 rounded-lg border border-orange-200"
          style={{ minHeight: '400px' }}
        />
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-orange-50 rounded-lg">
            <p className="text-orange-700">Loading Google Maps...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
