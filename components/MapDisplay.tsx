import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, useMap, Marker, Popup } from 'react-leaflet';
import { Coordinate } from '../types';
import L from 'leaflet';
import { MapPin } from 'lucide-react';

// Fix for default Leaflet marker icons in React
const startIcon = L.divIcon({
  className: 'custom-div-icon',
  html: "<div style='background-color: #10b981; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);'></div>",
  iconSize: [12, 12],
  iconAnchor: [6, 6]
});

interface MapDisplayProps {
  currentPosition: Coordinate | null;
  route: Coordinate[];
  onLocateMe: () => void;
}

const RecenterMap: React.FC<{ position: Coordinate }> = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    map.panTo([position.lat, position.lng], { animate: true });
  }, [position, map]);
  return null;
};

const MapDisplay: React.FC<MapDisplayProps> = ({ currentPosition, route, onLocateMe }) => {
  // Default to a neutral view if no location yet
  const defaultCenter: [number, number] = [0, 0];
  const zoomLevel = 16;

  if (!currentPosition && route.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center text-center max-w-sm w-full border border-slate-100">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-500">
            <MapPin size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Location Needed</h3>
          <p className="text-slate-500 mb-6 text-sm">
            To track your run and visualize your route, please enable location access.
          </p>
          <button 
            onClick={onLocateMe}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
          >
            Enable Location
          </button>
        </div>
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
          <RecenterMap position={currentPosition} />
        </>
      )}
    </MapContainer>
  );
};

export default MapDisplay;