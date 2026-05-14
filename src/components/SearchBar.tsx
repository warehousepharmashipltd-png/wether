import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { searchLocation } from "../services/weatherService";
import { GeocodingResult } from "../types";
import { cn } from "../lib/utils";

interface SearchBarProps {
  onSelect: (lat: number, lon: number, name: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (query.length >= 2) {
        setIsLoading(true);
        try {
          const res = await searchLocation(query);
          setResults(res);
          setIsOpen(true);
        } catch (error) {
          console.error("Search failed", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [query]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto z-50 text-slate-900" ref={dropdownRef}>
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..."
          className="w-full pl-12 pr-4 py-3 bg-white/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
          onFocus={() => query.length >= 2 && setIsOpen(true)}
        />
        {isLoading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-blue-500" />
        )}
      </div>

      {isOpen && query.length >= 2 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden z-50">
          {results.length > 0 ? (
            results.map((result) => (
              <button
                key={result.id}
                onClick={() => {
                  onSelect(result.latitude, result.longitude, result.name);
                  setQuery("");
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50 transition-colors text-left"
              >
                <MapPin className="w-4 h-4 text-slate-400" />
                <div className="flex-1 overflow-hidden">
                  <p className="font-semibold text-slate-800 truncate">{result.name}</p>
                  <p className="text-xs text-slate-500 truncate">
                    {result.admin1 ? `${result.admin1}, ` : ""}{result.country}
                  </p>
                </div>
              </button>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-slate-500 bg-white/50">
              <p className="text-sm font-medium">No locations found</p>
              <p className="text-xs opacity-60">Try a different city name</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
