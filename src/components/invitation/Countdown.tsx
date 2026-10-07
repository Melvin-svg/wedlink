"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  targetDate: string | Date | null | undefined;
  weddingTime?: string | null;
  accentClass?: string;
  cardClass?: string;
}

export function Countdown({
  targetDate,
  weddingTime,
  accentClass = "text-amber-700",
  cardClass = "bg-white/80 border border-stone-200/80 shadow-sm backdrop-blur-sm",
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
    isToday: boolean;
  } | null>(null);

  useEffect(() => {
    if (!targetDate) return;

    const calculate = () => {
      const now = new Date();
      const target = new Date(targetDate);
      if (weddingTime) {
        const [time, modifier] = weddingTime.split(" ");
        if (time) {
          const parts = time.split(":").map(Number);
          let hours = parts[0] || 0;
          const mins = parts[1] || 0;
          if (modifier?.toLowerCase() === "pm" && hours < 12) hours += 12;
          if (modifier?.toLowerCase() === "am" && hours === 12) hours = 0;
          target.setHours(hours, mins, 0, 0);
        }
      }

      const diff = target.getTime() - now.getTime();
      const isToday =
        now.getFullYear() === target.getFullYear() &&
        now.getMonth() === target.getMonth() &&
        now.getDate() === target.getDate();

      if (diff <= 0) {
        if (isToday) {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false, isToday: true });
        } else {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, isToday: false });
        }
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false, isToday: false });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate, weddingTime]);

  if (!targetDate) {
    return (
      <div className="py-4 text-center text-sm font-medium tracking-widest uppercase opacity-75">
        Date to be announced
      </div>
    );
  }

  if (!timeLeft) return null;

  if (timeLeft.isToday) {
    return (
      <div className="p-6 text-center rounded-2xl bg-gradient-to-r from-rose-500/10 via-amber-500/15 to-rose-500/10 border border-amber-300/40">
        <span className="text-2xl animate-pulse inline-block mb-1">💍</span>
        <h4 className="text-xl md:text-2xl font-serif font-bold text-stone-800">
          TODAY IS THE DAY! ❤️
        </h4>
        <p className="text-sm text-stone-600 mt-1">Celebrating our love with all of you.</p>
      </div>
    );
  }

  if (timeLeft.isPast) {
    return (
      <div className="p-6 text-center rounded-2xl bg-stone-50 border border-stone-200">
        <span className="text-2xl inline-block mb-1">✨</span>
        <h4 className="text-xl md:text-2xl font-serif font-semibold text-stone-800">
          WE GOT MARRIED! ❤️
        </h4>
        <p className="text-sm text-stone-600 mt-1">Thank you for being part of our beautiful journey.</p>
      </div>
    );
  }

  const units = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HOURS", value: timeLeft.hours },
    { label: "MINS", value: timeLeft.minutes },
    { label: "SECS", value: timeLeft.seconds },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto">
        {units.map((u) => (
          <div
            key={u.label}
            className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl text-center transition-all ${cardClass}`}
          >
            <span className={`text-2xl sm:text-3xl md:text-4xl font-serif font-bold tracking-tight ${accentClass}`}>
              {String(u.value).padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-xs tracking-widest uppercase font-semibold text-stone-500 mt-1">
              {u.label}
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs uppercase tracking-widest text-center text-stone-500 mt-3 font-medium">
        UNTIL WE SAY &ldquo;I DO&rdquo;
      </p>
    </div>
  );
}
