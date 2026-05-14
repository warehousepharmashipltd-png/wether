/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { fetchWeather, getWeatherTheme } from "./services/weatherService";
import { WeatherData } from "./types";
import { SearchBar } from "./components/SearchBar";
import { WeatherDisplay } from "./components/WeatherDisplay";
import { AIInsights } from "./components/AIInsights";
import { Loader2, CloudLightning } from "lucide-react";
import { cn } from "./lib/utils";

const DEFAULT_LOCATION = { lat: 51.5074, lon: -0.1278, name: "London" };

export default function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = async (lat: number, lon: number, name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(lat, lon, name);
      setWeatherData(data);
    } catch (err) {
      setError("Unable to fetch weather data. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Try browser geolocation first
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          loadWeather(position.coords.latitude, position.coords.longitude, "Your Location");
        },
        () => {
          loadWeather(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon, DEFAULT_LOCATION.name);
        }
      );
    } else {
      loadWeather(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon, DEFAULT_LOCATION.name);
    }
  }, []);

  const themeClasses = weatherData 
    ? getWeatherTheme(weatherData.current.iconCode, weatherData.current.isDay)
    : "from-blue-400 to-blue-600";

  return (
    <div className={cn(
      "min-h-screen w-full transition-all duration-1000 bg-linear-to-br text-white font-sans",
      themeClasses
    )}>
      {/* Search Header */}
      <nav className="p-6">
        <SearchBar onSelect={loadWeather} />
      </nav>

      <main className="container mx-auto pb-20 px-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loader2 className="w-12 h-12 animate-spin opacity-50" />
            <p className="text-xl font-medium opacity-50 animate-pulse">Scanning the skies...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 text-center">
            <div className="p-6 bg-white/10 backdrop-blur-xl rounded-full">
              <CloudLightning className="w-16 h-16 text-white" />
            </div>
            <div className="max-w-md space-y-2">
              <h2 className="text-2xl font-bold">Stormy Connection</h2>
              <p className="opacity-70">{error}</p>
              <button 
                onClick={() => loadWeather(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon, DEFAULT_LOCATION.name)}
                className="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-full font-semibold transition-colors"
              >
                Back to London
              </button>
            </div>
          </div>
        ) : (
          weatherData && (
            <div className="space-y-8">
              <div className="max-w-6xl mx-auto">
                <AIInsights weather={weatherData} />
              </div>
              <WeatherDisplay data={weatherData} />
            </div>
          )
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 text-center text-xs opacity-40 font-medium">
        Data provided by Open-Meteo • Designed for AI Studio
      </footer>
    </div>
  );
}
