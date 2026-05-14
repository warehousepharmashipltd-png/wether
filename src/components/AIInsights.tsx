import React, { useState, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Loader2 } from "lucide-react";
import { WeatherData } from "../types";
import { motion } from "motion/react";

interface AIInsightsProps {
  weather: WeatherData;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ weather }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateInsight = async () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey === "GEMINI_API_KEY") return;
    
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Based on the current weather in ${weather.location.name}: 
      Temperature: ${weather.current.temp}°C, 
      Condition: ${weather.current.description}, 
      Humidity: ${weather.current.humidity}%,
      Wind: ${weather.current.windSpeed} km/h.
      
      Give a very short (max 15 words) and clever advice or "vibe check" for the day. 
      Be witty and use one emoji. No title, just the advice.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });

      const text = response.text || "Enjoy the skies! ✨";
      setInsight(text.trim());
    } catch (error) {
      console.error("AI Insight failed", error);
      setInsight("Enjoy the skies, whatever they bring! ✨");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateInsight();
  }, [weather.location.name, weather.current.temp]);

  const apiKey = process.env.GEMINI_API_KEY;
  const hasKey = apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey !== "GEMINI_API_KEY" && apiKey !== "";

  if (!hasKey && !insight) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl flex items-center gap-4"
    >
      <div className="p-3 rounded-full bg-linear-to-tr from-purple-500 to-pink-500 shadow-lg shrink-0">
        <Sparkles className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1">
        <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Aura Insight</h3>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-3 h-3 animate-spin opacity-50" />
            <span className="text-sm opacity-50 italic">Consulting the oracle...</span>
          </div>
        ) : (
          <p className="text-sm font-medium leading-relaxed italic">
            "{insight}"
          </p>
        )}
      </div>
    </motion.div>
  );
};
