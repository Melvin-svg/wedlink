"use client";

import { useState } from "react";
import { submitRsvpAction } from "@/actions";
import { CheckCircle2, HeartHandshake, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";

interface RsvpSectionProps {
  invitationId: string;
  events?: Array<{ id: string; name: string }>;
  themeStyle?: "minimal" | "traditional";
}

export function RsvpSection({
  invitationId,
  events = [],
  themeStyle = "minimal",
}: RsvpSectionProps) {
  const [status, setStatus] = useState<"accepted" | "declined" | "maybe">("accepted");
  const [guestCount, setGuestCount] = useState(1);
  const [mealPreference, setMealPreference] = useState("Non-Vegetarian");
  const [eventId, setEventId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("invitationId", invitationId);
    formData.set("status", status);
    formData.set("guestCount", String(guestCount));
    formData.set("mealPreference", mealPreference);
    if (eventId) formData.set("eventId", eventId);

    const res = await submitRsvpAction(formData);

    if (res.error) {
      setErrorMessage(res.error);
      setIsSubmitting(false);
    } else {
      setSubmitted(true);
      setIsSubmitting(false);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#b45309", "#d97706", "#f59e0b", "#ec4899", "#8b5cf6"],
        });
      } catch {
        // ignore
      }
    }
  };

  const isTraditional = themeStyle === "traditional";

  if (submitted) {
    return (
      <div
        className={`p-8 rounded-3xl text-center max-w-lg mx-auto shadow-sm transition-all duration-300 ${
          isTraditional
            ? "bg-amber-50/90 border border-amber-300 text-amber-950"
            : "bg-stone-50/90 border border-stone-200 text-stone-900"
        }`}
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h3 className="text-2xl font-serif font-bold">
          {status === "declined" ? "Thank You for Letting Us Know" : "RSVP Confirmed!"}
        </h3>
        <p className="mt-2 text-stone-600 text-sm leading-relaxed">
          {status === "declined"
            ? "We will truly miss you on our special day. Your blessings and warm thoughts mean the world to us!"
            : "We are thrilled to celebrate with you! Your response has been securely saved."}
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 text-xs uppercase tracking-wider underline text-stone-500 hover:text-stone-800 transition-colors"
        >
          Submit another RSVP
        </button>
      </div>
    );
  }

  return (
    <div
      className={`p-6 sm:p-10 rounded-3xl max-w-xl mx-auto shadow-xl backdrop-blur-md ${
        isTraditional
          ? "bg-amber-950/5 border border-amber-800/15 text-stone-900"
          : "bg-white/80 border border-stone-200/80 text-stone-900 shadow-stone-200/50"
      }`}
    >
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-100 text-amber-800 mb-2">
          <HeartHandshake className="w-3.5 h-3.5" /> Will You Join Us?
        </span>
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
          Kindly Respond
        </h3>
        <p className="text-stone-600 text-sm mt-1">
          Please confirm your presence so we can prepare warmly for your arrival.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Attendance choice tabs */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
            Attendance Status
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "accepted", label: "Joyfully Accepts", icon: "✨" },
              { id: "maybe", label: "Unsure / Maybe", icon: "⏳" },
              { id: "declined", label: "Regretfully Declines", icon: "💌" },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setStatus(option.id as "accepted" | "declined" | "maybe")}
                className={`py-3 px-2 text-center rounded-xl text-xs sm:text-sm font-medium transition-all flex flex-col items-center justify-center gap-1 ${
                  status === option.id
                    ? isTraditional
                      ? "bg-amber-800 text-amber-50 shadow-md scale-[1.02]"
                      : "bg-stone-900 text-white shadow-md scale-[1.02]"
                    : "bg-stone-100 hover:bg-stone-200/80 text-stone-700"
                }`}
              >
                <span>{option.icon}</span>
                <span className="leading-tight">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Guest name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            name="guestName"
            type="text"
            required
            placeholder="e.g. Melvin Mathews & Family"
            className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition text-sm"
          />
        </div>

        {/* Contact info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
              Email Address
            </label>
            <input
              name="guestEmail"
              type="email"
              placeholder="name@domain.com"
              className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
              Phone / WhatsApp
            </label>
            <input
              name="guestPhone"
              type="tel"
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition text-sm"
            />
          </div>
        </div>

        {/* Number of guests & meal preferences if attending */}
        {status !== "declined" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                Number of Guests
              </label>
              <div className="flex items-center rounded-xl border border-stone-300 bg-white p-1">
                <button
                  type="button"
                  onClick={() => setGuestCount((prev) => Math.max(1, prev - 1))}
                  className="w-9 h-9 rounded-lg hover:bg-stone-100 flex items-center justify-center font-bold text-stone-700"
                >
                  -
                </button>
                <span className="flex-1 text-center font-semibold text-stone-900 text-sm">
                  {guestCount} {guestCount === 1 ? "Person" : "People"}
                </span>
                <button
                  type="button"
                  onClick={() => setGuestCount((prev) => Math.min(15, prev + 1))}
                  className="w-9 h-9 rounded-lg hover:bg-stone-100 flex items-center justify-center font-bold text-stone-700"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                Meal Preference
              </label>
              <select
                value={mealPreference}
                onChange={(e) => setMealPreference(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition text-sm"
              >
                <option value="Non-Vegetarian">Traditional Sadhya / Non-Veg</option>
                <option value="Vegetarian">Pure Vegetarian Sadhya</option>
                <option value="Jain / Vegan">Jain / Vegan</option>
              </select>
            </div>
          </div>
        )}

        {/* Event selection if multiple events exist */}
        {events.length > 1 && status !== "declined" && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
              Attending for
            </label>
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition text-sm"
            >
              <option value="">All Events (Full Wedding Celebration)</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Wishes / Personal Note */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
            Wishes & Note for the Couple
          </label>
          <textarea
            name="message"
            rows={3}
            placeholder="Wishing you both a lifetime of happiness, love, and laughter! ❤️"
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition text-sm"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3.5 px-6 rounded-xl font-medium tracking-wide uppercase text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
            isTraditional
              ? "bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white"
              : "bg-stone-900 hover:bg-stone-800 text-white"
          } ${isSubmitting ? "opacity-75 cursor-wait" : ""}`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Recording Response...
            </>
          ) : (
            <>Send RSVP</>
          )}
        </button>
      </form>
    </div>
  );
}
