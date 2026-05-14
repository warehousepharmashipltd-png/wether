import React from "react";
import { format } from "date-fns";
import { Thermometer, Wind, Droplets } from "lucide-react";
import { WeatherData } from "../types";
import { WeatherIcon } from "./WeatherIcon";
import { Clock } from "./Clock";
import { WeatherMap } from "./WeatherMap";
import { motion } from "motion/react";

interface WeatherDisplayProps {
  data: WeatherData;
}

export const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ data }) => {
  const { current, hourly, daily, location } = data;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 px-4 py-6">
      {/* Current Weather Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center justify-between gap-8 py-12"
      >
        <div className="text-center md:text-left space-y-4">
          <Clock />
          <div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-2 drop-shadow-md">
              {location.name}
            </h1>
            <p className="text-lg font-light opacity-80 uppercase tracking-widest">
              {current.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative">
            <WeatherIcon 
              code={current.iconCode} 
              isDay={current.isDay} 
              className="w-32 h-32 md:w-48 md:h-48 drop-shadow-2xl text-white"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-7xl md:text-9xl font-bold tracking-tighter drop-shadow-md">
              {Math.round(current.temp)}°
            </span>
            <span className="text-lg font-medium opacity-80 pl-2">
              Feels like {Math.round(current.feelsLike)}°
            </span>
          </div>
        </div>
      </motion.div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Humidity", value: `${current.humidity}%`, icon: Droplets, color: "text-blue-200" },
          { label: "Wind Speed", value: `${current.windSpeed} km/h`, icon: Wind, color: "text-slate-200" },
          { label: "Feels Like", value: `${Math.round(current.feelsLike)}°`, icon: Thermometer, color: "text-orange-200" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * i }}
            className="flex items-center gap-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl"
          >
            <div className={`p-3 rounded-2xl bg-white/10 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium opacity-60 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Map Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold opacity-90 px-2 tracking-wide">Location View</h2>
        <WeatherMap 
          lat={location.latitude} 
          lng={location.longitude} 
          locationName={location.name} 
        />
      </section>

      {/* Hourly Forecast */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold opacity-90 px-2 tracking-wide">Hourly Forecast</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
          {hourly.map((hour, i) => (
            <motion.div
              key={hour.time}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="flex flex-col items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl py-6 px-5 min-w-[100px] shadow-lg hover:bg-white/20 transition-colors"
            >
              <span className="text-sm font-medium opacity-70">
                {format(new Date(hour.time), "HH:mm")}
              </span>
              <WeatherIcon 
                code={hour.iconCode} 
                className="w-10 h-10 text-white"
              />
              <span className="text-xl font-bold">{Math.round(hour.temp)}°</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Daily Forecast */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold opacity-90 px-2 tracking-wide">7-Day Outlook</h2>
        <div className="grid grid-cols-1 gap-3">
          {daily.map((day, i) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="flex items-center justify-between bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 shadow-lg px-8 hover:bg-white/20 transition-colors"
            >
              <div className="w-24">
                <p className="font-semibold text-lg">
                  {i === 0 ? "Today" : format(new Date(day.date), "EEE")}
                </p>
                <p className="text-xs opacity-60">{format(new Date(day.date), "MMM d")}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <WeatherIcon code={day.iconCode} className="w-8 h-8" />
                <span className="text-sm font-medium hidden sm:block opacity-70">
                  {getWeatherDescription(day.iconCode)}
                </span>
              </div>

              <div className="flex items-center gap-4 text-right">
                <span className="font-bold text-xl w-12">{Math.round(day.maxTemp)}°</span>
                <span className="font-medium opacity-50 w-12">{Math.round(day.minTemp)}°</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: "Clear",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime Fog",
    51: "Light Drizzle",
    53: "Mod. Drizzle",
    55: "Dense Drizzle",
    61: "Slight Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    71: "Slight Snow",
    73: "Moderate Snow",
    75: "Heavy Snow",
    95: "Thunderstorm",
  };
  return descriptions[code] || "Conditions";
}
