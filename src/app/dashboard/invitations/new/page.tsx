"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createInvitationAction } from "@/actions";
import { Sparkles, Church, Flower2, Moon, Users, Loader2, HeartHandshake } from "lucide-react";

export default function NewInvitationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("christian");

  const templates = [
    {
      id: "christian",
      title: "Christian Matrimony",
      tagline: "Holy Matrimony & Nuptial Blessing",
      icon: Church,
      description: "Solemn church service, exchange of vows and rings, followed by an evening banquet & dance.",
      events: ["Holy Matrimony", "Reception Dinner"],
      suggestedTheme: "Cathedral Holy Matrimony",
      palette: "Ivory, Champagne Gold & Sage",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-200",
    },
    {
      id: "hindu",
      title: "Hindu Vivah",
      tagline: "Auspicious Vedic & Regional Traditions",
      icon: Flower2,
      description: "Vibrant Haldi, Mehendi & Sangeet celebrations, followed by auspicious Muhurtham rituals & grand feast.",
      events: ["Mehendi & Sangeet", "Muhurtham Rituals", "Grand Reception"],
      suggestedTheme: "Kerala Kasavu / Royal Rajasthani / Tamil",
      palette: "Kasavu Gold, Deep Vermilion & Turmeric",
      badgeColor: "bg-rose-100 text-rose-900 border-rose-200",
    },
    {
      id: "nikah",
      title: "Muslim Nikah",
      tagline: "Sacred Nikah & Joyous Walima",
      icon: Moon,
      description: "Sacred Islamic marriage contract solemnization with Duas, followed by a royal Walima reception banquet.",
      events: ["Nikah Solemnization", "Walima Feast"],
      suggestedTheme: "Mughal Imperial Nikah",
      palette: "Imperial Emerald & Luminous Gold",
      badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-200",
    },
    {
      id: "sikh",
      title: "Sikh Anand Karaj",
      tagline: "Sacred Four Laavan & Sangeet",
      icon: HeartHandshake,
      description: "Lively Sangeet & Jaago night with traditional Dhol, followed by sacred Anand Karaj ceremony at Gurdwara.",
      events: ["Sangeet & Jaago", "Anand Karaj", "Grand Reception"],
      suggestedTheme: "Royal Punjabi Celebration",
      palette: "Royal Magenta, Orange & Mustard Gold",
      badgeColor: "bg-fuchsia-100 text-fuchsia-900 border-fuchsia-200",
    },
    {
      id: "secular",
      title: "Contemporary / Secular",
      tagline: "Modern Editorial & Bespoke Vows",
      icon: Users,
      description: "Personalized exchange of vows, sunset cocktail hour, and unforgettable dinner party celebration.",
      events: ["Wedding Ceremony", "Cocktail Party & Dinner"],
      suggestedTheme: "Bespoke Elegant Minimal",
      palette: "Warm Stone, Charcoal & Neutral Beige",
      badgeColor: "bg-stone-200 text-stone-800 border-stone-300",
    },
  ];

  const handleCreate = async () => {
    setLoading(true);
    const res = await createInvitationAction(selectedTemplate);
    if (res?.success && res.invitationId) {
      router.push(`/dashboard/invitations/${res.invitationId}/edit`);
    } else {
      alert(res?.error || "Failed to initialize wedding space");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300/60 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            Step 1 of Setup • Religious &amp; Cultural Heritage
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif text-stone-900 tracking-tight">
            Choose Ceremony Tradition
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl mx-auto leading-relaxed">
            Select your marriage culture to automatically tailor event customs, authentic blessings, and recommended designer themes. You can fully customize and switch themes at any time.
          </p>
        </div>

        {/* Ceremony Tradition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {templates.map((tmpl) => {
            const Icon = tmpl.icon;
            const isSelected = selectedTemplate === tmpl.id;

            return (
              <div
                key={tmpl.id}
                onClick={() => setSelectedTemplate(tmpl.id)}
                className={`p-6 sm:p-7 rounded-3xl border-2 cursor-pointer transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? "bg-white border-amber-700 shadow-lg ring-2 ring-amber-700/20 translate-y-[-2px]"
                    : "bg-white/80 border-stone-200 hover:border-stone-300 hover:bg-white hover:shadow-sm"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-700" />
                )}

                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-amber-100 text-amber-900 shadow-inner"
                            : "bg-stone-100 text-stone-600"
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-stone-900 text-lg leading-snug">
                          {tmpl.title}
                        </h3>
                        <p className="text-xs text-amber-800 font-medium">
                          {tmpl.tagline}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shrink-0 ${tmpl.badgeColor}`}
                    >
                      {tmpl.id}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed mb-4">
                    {tmpl.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-stone-100">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-stone-400 uppercase tracking-wider font-semibold">
                      Customary Events:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {tmpl.events.map((ev) => (
                        <span
                          key={ev}
                          className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-medium"
                        >
                          {ev}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] bg-amber-50/50 p-2 rounded-xl border border-amber-100/80">
                    <span className="text-amber-900 font-medium">
                      Recommended Theme:
                    </span>
                    <span className="font-serif font-bold text-stone-900">
                      {tmpl.suggestedTheme}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-stone-600 hover:text-stone-900 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="px-9 py-4 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-widest shadow-xl transition flex items-center gap-2.5 cursor-pointer disabled:opacity-75 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                Creating Wedding Space...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-400" />
                Initialize Wedding Space &rarr;
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
