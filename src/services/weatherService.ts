import { WeatherData, GeocodingResult } from "../types";

const BASE_URL = "https://api.open-meteo.com/v1/forecast";
const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";

export async function fetchWeather(lat: number, lon: number, name: string = "Current Location"): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m",
    hourly: "temperature_2m,weather_code",
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    timezone: "auto",
    forecast_days: "7",
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch weather data");
  
  const data = await response.json();

  return {
    current: {
      temp: data.current.temperature_2m,
      description: getWeatherDescription(data.current.weather_code),
      iconCode: data.current.weather_code,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      feelsLike: data.current.apparent_temperature,
      isDay: data.current.is_day === 1,
    },
    hourly: data.hourly.time.map((t: string, i: number) => ({
      time: t,
      temp: data.hourly.temperature_2m[i],
      iconCode: data.hourly.weather_code[i],
    })).slice(0, 24),
    daily: data.daily.time.map((d: string, i: number) => ({
      date: d,
      maxTemp: data.daily.temperature_2m_max[i],
      minTemp: data.daily.temperature_2m_min[i],
      iconCode: data.daily.weather_code[i],
    })),
    location: {
      name,
      country: "", // We can enhance this with geocoding if needed
      latitude: lat,
      longitude: lon,
    },
  };
}

export async function searchLocation(query: string): Promise<GeocodingResult[]> {
  if (!query || query.trim().length < 2) return [];
  
  try {
    const params = new URLSearchParams({
      name: query,
      count: "20", // Fetch more to allow for better filtering
      language: "en",
      format: "json",
    });
    
    const response = await fetch(`${GEO_URL}?${params.toString()}`);
    if (!response.ok) throw new Error("Search failed");
    
    const data = await response.json();
    const results: GeocodingResult[] = (data.results || []).map((item: any) => ({
      ...item,
      country: item.country || "Unknown",
      id: item.id || Math.random() // Fallback ID to prevent React key crashes
    }));

    // Sort: Bangladesh first, then by popularity (if available) or relevance
    return results.sort((a, b) => {
      const aIsBD = a.country === "Bangladesh";
      const bIsBD = b.country === "Bangladesh";
      if (aIsBD && !bIsBD) return -1;
      if (!aIsBD && bIsBD) return 1;
      return 0;
    }).slice(0, 10);
  } catch (error) {
    console.error("Geocoding error:", error);
    return [];
  }
}

export function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    95: "Thunderstorm",
  };
  return descriptions[code] || "Unknown";
}

export function getWeatherTheme(code: number, isDay: boolean): string {
  // Returns tailwind classes for background
  if (!isDay) return "from-slate-900 to-indigo-950";
  
  if (code === 0) return "from-blue-400 to-blue-600"; // Clear
  if (code <= 3) return "from-blue-400 to-slate-400"; // Partly cloudy
  if (code <= 48) return "from-slate-400 to-slate-600"; // Fog
  if (code <= 67) return "from-blue-600 to-slate-700"; // Rain
  if (code <= 77) return "from-slate-100 to-blue-200"; // Snow
  if (code <= 82) return "from-blue-700 to-indigo-900"; // Showers
  if (code >= 95) return "from-slate-800 to-purple-900"; // Thunderstorm
  
  return "from-blue-400 to-blue-600";
}
