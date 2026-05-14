import React from "react";
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { motion } from "motion/react";

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || "";
const INVALID_KEYS = ["", "YOUR_API_KEY", "MY_GOOGLE_MAPS_KEY", "MY_GOOGLE_MAPS_PLATFORM_KEY", "undefined", "null"];
const hasValidKey = Boolean(API_KEY) && !INVALID_KEYS.includes(API_KEY.trim());

interface WeatherMapProps {
  lat: number;
  lng: number;
  locationName: string;
}

export const WeatherMap: React.FC<WeatherMapProps> = ({ lat, lng, locationName }) => {
  if (!hasValidKey) {
    return (
      <div className="w-full min-h-[400px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Google Maps API Key Required</h2>
          <p className="text-blue-200/80 max-w-lg mx-auto">
            To view the interactive weather map, you'll need to set up a Google Maps API Key.
          </p>
        </div>
        
        <div className="w-full max-w-md bg-white/5 rounded-2xl p-6 text-left border border-white/10">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-300 mb-4">Setup Instructions</h3>
          <ol className="space-y-4 text-sm text-slate-200 list-decimal pl-4">
            <li>
              <a href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-blue-400 hover:underline inline-flex items-center gap-1 font-medium">
                Get an API Key from Google Cloud
              </a>
            </li>
            <li>
              When the <strong>"Enter your environment variable to continue"</strong> popup appears, paste your API key and press <strong>Enter</strong>.
            </li>
            <li>
              <strong>Or manually:</strong> Open <strong>Settings</strong> (⚙️ gear icon) → <strong>Secrets</strong> → add <code>GOOGLE_MAPS_PLATFORM_KEY</code> → paste key → <strong>Enter</strong>.
            </li>
          </ol>
        </div>
        
        <p className="text-xs text-white/40 italic">
          The app rebuilds automatically after you add the secret. No page reload needed.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-[400px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl"
    >
      <APIProvider apiKey={API_KEY} version="weekly">
        <Map
          defaultCenter={{ lat, lng }}
          defaultZoom={11}
          center={{ lat, lng }}
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
          style={{ width: "100%", height: "100%" }}
          disableDefaultUI={true}
          gestureHandling="cooperative"
        >
          <AdvancedMarker position={{ lat, lng }} title={locationName}>
            <Pin background="#3b82f6" borderColor="#2563eb" glyphColor="#ffffff" />
          </AdvancedMarker>
        </Map>
      </APIProvider>
    </motion.div>
  );
};
