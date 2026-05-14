import React, { useState, useEffect } from "react";
import { format } from "date-fns";

export const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center md:items-start">
      <div className="text-5xl md:text-7xl font-bold tracking-tighter tabular-nums drop-shadow-lg">
        {format(time, "HH:mm")}
        <span className="text-2xl md:text-3xl opacity-50 ml-1 font-light">
          {format(time, "ss")}
        </span>
      </div>
      <div className="text-lg md:text-xl font-medium opacity-80 mt-1">
        {format(time, "EEEE, MMMM do, yyyy")}
      </div>
    </div>
  );
};
