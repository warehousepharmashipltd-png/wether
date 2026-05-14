export interface WeatherData {
  current: {
    temp: number;
    description: string;
    iconCode: number;
    humidity: number;
    windSpeed: number;
    feelsLike: number;
    isDay: boolean;
  };
  hourly: {
    time: string;
    temp: number;
    iconCode: number;
  }[];
  daily: {
    date: string;
    maxTemp: number;
    minTemp: number;
    iconCode: number;
  }[];
  location: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  };
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}
