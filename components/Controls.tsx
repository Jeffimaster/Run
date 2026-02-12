import React from 'react';
import { Play, Square, AlertCircle, Navigation } from 'lucide-react';
import { TrackingStatus, RunStats } from '../types';
import { formatDistance, formatDuration } from '../utils/geo';

interface ControlsProps {
  status: TrackingStatus;
  stats: RunStats;
  errorMessage: string | null;
  onStart: () => void;
  onStop: () => void;
}

const Controls: React.FC<ControlsProps> = ({ status, stats, errorMessage, onStart, onStop }) => {
  return (
    <>
      {/* Top Status Bar - Stats */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex justify-center pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl p-4 w-full max-w-md pointer-events-auto border border-white/20">
          <div className="flex justify-between items-center text-center">
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Distance</p>
              <p className="text-2xl font-bold text-slate-800 tabular-nums">
                {formatDistance(stats.distance)}
              </p>
            </div>
            <div className="w-px h-10 bg-gray-200 mx-4"></div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Time</p>
              <p className="text-2xl font-bold text-slate-800 tabular-nums">
                {formatDuration(stats.elapsedTime)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Toast */}
      {errorMessage && (
        <div className="absolute top-24 left-4 right-4 z-[1000] flex justify-center pointer-events-none">
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl shadow-md flex items-center gap-2 max-w-md pointer-events-auto border border-red-100">
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Bottom Action Button */}
      <div className="absolute bottom-8 left-0 right-0 z-[1000] flex justify-center pointer-events-none">
        <div className="pointer-events-auto shadow-2xl rounded-full">
            {status === TrackingStatus.IDLE || status === TrackingStatus.ERROR ? (
              <button
                onClick={onStart}
                className="group flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                <Play fill="currentColor" size={24} />
                <span className="text-lg">Start Run</span>
              </button>
            ) : (
              <button
                onClick={onStop}
                className="group flex items-center justify-center gap-2 bg-white text-red-500 hover:bg-red-50 border-2 border-red-100 font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
              >
                <Square fill="currentColor" size={24} />
                <span className="text-lg">Stop Tracking</span>
              </button>
            )}
        </div>
      </div>
      
      {/* Decorative Branding */}
      <div className="absolute bottom-4 left-4 z-[900] pointer-events-none opacity-50 hidden sm:block">
        <div className="flex items-center gap-1 text-slate-400 font-semibold text-xs">
          <Navigation size={12} />
          <span>WebRun Tracker</span>
        </div>
      </div>
    </>
  );
};

export default Controls;