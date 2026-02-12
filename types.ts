export interface Coordinate {
  lat: number;
  lng: number;
  timestamp: number;
}

export interface RunStats {
  distance: number; // in meters
  elapsedTime: number; // in seconds
  currentSpeed: number; // in m/s
}

export enum TrackingStatus {
  IDLE = 'IDLE',
  TRACKING = 'TRACKING',
  PAUSED = 'PAUSED',
  ERROR = 'ERROR',
}