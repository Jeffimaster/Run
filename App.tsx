import React, { useState, useEffect, useRef, useCallback } from 'react';
import MapDisplay from './components/MapDisplay';
import Controls from './components/Controls';
import { Coordinate, RunStats, TrackingStatus } from './types';
import { calculateDistance } from './utils/geo';

const App: React.FC = () => {
  const [status, setStatus] = useState<TrackingStatus>(TrackingStatus.IDLE);
  const [currentPosition, setCurrentPosition] = useState<Coordinate | null>(null);
  const [route, setRoute] = useState<Coordinate[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [stats, setStats] = useState<RunStats>({
    distance: 0,
    elapsedTime: 0,
    currentSpeed: 0,
  });

  // Refs to keep track of mutable state inside intervals/callbacks without triggering re-renders unnecessarily
  const watchId = useRef<number | null>(null);
  const timerId = useRef<number | null>(null);
  const lastPosition = useRef<Coordinate | null>(null);

  // Start tracking location
  const startTracking = useCallback(async () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    setStatus(TrackingStatus.TRACKING);
    setErrorMsg(null);
    setRoute([]);
    setStats({ distance: 0, elapsedTime: 0, currentSpeed: 0 });
    lastPosition.current = null;

    // Start Timer
    const startTime = Date.now();
    timerId.current = window.setInterval(() => {
      setStats((prev) => ({
        ...prev,
        elapsedTime: Math.floor((Date.now() - startTime) / 1000),
      }));
    }, 1000);

    // Start Geolocation Watch
    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, speed } = position.coords;
        const newCoord: Coordinate = {
          lat: latitude,
          lng: longitude,
          timestamp: position.timestamp,
        };

        setCurrentPosition(newCoord);

        // Update Route & Distance
        setRoute((prevRoute) => {
          const updatedRoute = [...prevRoute, newCoord];
          
          if (lastPosition.current) {
             const distIncrement = calculateDistance(lastPosition.current, newCoord);
             // Simple noise filter: don't add distance if it's extremely small movement (GPS jitter)
             if (distIncrement > 0.5) { 
               setStats((prevStats) => ({
                 ...prevStats,
                 distance: prevStats.distance + distIncrement,
                 currentSpeed: speed || 0,
               }));
             }
          }
          
          lastPosition.current = newCoord;
          return updatedRoute;
        });
      },
      (error) => {
        let msg = 'Unable to retrieve location.';
        switch(error.code) {
            case error.PERMISSION_DENIED: msg = 'Location permission denied.'; break;
            case error.POSITION_UNAVAILABLE: msg = 'Location information is unavailable.'; break;
            case error.TIMEOUT: msg = 'The request to get user location timed out.'; break;
        }
        setErrorMsg(msg);
        setStatus(TrackingStatus.ERROR);
        stopTracking();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  const stopTracking = useCallback(() => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    if (timerId.current !== null) {
      clearInterval(timerId.current);
      timerId.current = null;
    }
    // Only change status if we are not in error state
    setStatus((prev) => (prev === TrackingStatus.ERROR ? prev : TrackingStatus.IDLE));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  // Initial location fetch to center map (optional, improves UX before starting)
  useEffect(() => {
    if (navigator.geolocation && status === TrackingStatus.IDLE) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            timestamp: pos.timestamp
          });
        },
        () => {
           // Silently fail for initial fetch, we'll ask for permission properly on Start
        }
      );
    }
  }, [status]);

  return (
    <div className="relative w-full h-full bg-slate-50 overflow-hidden">
      <MapDisplay currentPosition={currentPosition} route={route} />
      <Controls 
        status={status} 
        stats={stats} 
        errorMessage={errorMsg}
        onStart={startTracking}
        onStop={stopTracking}
      />
    </div>
  );
};

export default App;