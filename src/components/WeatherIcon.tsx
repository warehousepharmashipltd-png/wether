import React from "react";
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudFog, 
  CloudDrizzle, 
  Moon,
  CloudMoon,
  LucideIcon
} from "lucide-react";

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ code, isDay = true, className }) => {
  let Icon: LucideIcon = Sun;

  if (code === 0) {
    Icon = isDay ? Sun : Moon;
  } else if (code <= 2) {
    Icon = isDay ? Cloud : CloudMoon;
  } else if (code === 3) {
    Icon = Cloud;
  } else if (code <= 48) {
    Icon = CloudFog;
  } else if (code <= 55) {
    Icon = CloudDrizzle;
  } else if (code <= 67 || (code >= 80 && code <= 82)) {
    Icon = CloudRain;
  } else if (code <= 77 || (code >= 85 && code <= 86)) {
    Icon = CloudSnow;
  } else if (code >= 95) {
    Icon = CloudLightning;
  }

  return <Icon className={className} />;
};
