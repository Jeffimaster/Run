import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, useMap, Marker, Popup } from 'react-leaflet';
import { Coordinate } from '../types';
import L from 'leaflet';

// Fix for default Leaflet marker icons in React
// We create a custom simple dot icon using CSS/HTML
const startIcon = L.divIcon({
  className: 'custom-div-icon',
  html: "<div style='background-color: #10b981; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);'></div>",
  iconSize: [12, 12],
  iconAnchor: [6, 6]
});

interface MapDisplayProps {
  currentPosition: Coordinate | null;
  route: Coordinate[];
}

const RecenterMap: React.FC<{ position: Coordinate }> = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    map.panTo([position.lat, position.lng], { animate: true });
  }, [position, map]);
  return null;
};

const MapDisplay: React.FC<MapDisplayProps> = ({ currentPosition, route }) => {
  // Default to a neutral view if no location yet
  const defaultCenter: [number, number] = [0, 0];
  const zoomLevel = 16;

  if (!currentPosition && route.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Waiting for GPS signal...</p>
      </div>
    );
  }

  const center = currentPosition ? [currentPosition.lat, currentPosition.lng] as [number, number] : defaultCenter;

  return (
    <MapContainer 
      center={center} 
      zoom={zoomLevel} 
      scrollWheelZoom={true} 
      zoomControl={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Route Path */}
      {route.length > 1 && (
        <Polyline 
          positions={route.map(p => [p.lat, p.lng])} 
          pathOptions={{ color: '#0ea5e9', weight: 6, opacity: 0.8 }} 
        />
      )}

      {/* Start Point */}
      {route.length > 0 && (
        <Marker position={[route[0].lat, route[0].lng]} icon={startIcon}>
           <Popup>Start Point</Popup>
        </Marker>
      )}

      {/* Current Position Marker */}
      {currentPosition && (
        <>
          <CircleMarker 
            center={[currentPosition.lat, currentPosition.lng]} 
            pathOptions={{ fillColor: '#3b82f6', color: 'white', weight: 2, fillOpacity: 1 }} 
            radius={8}
          />
          {/* Pulse effect wrapper logic could go here, but circle marker is cleaner for now */}
          <RecenterMap position={currentPosition} />
        </>
      )}
    </MapContainer>
  );
};

export default MapDisplay;