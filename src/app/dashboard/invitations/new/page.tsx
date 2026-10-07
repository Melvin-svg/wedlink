"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createInvitationAction } from "@/actions";
import { Sparkles, Church, Flower2, Moon, Users, Loader2 } from "lucide-react";

export default function NewInvitationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("christian");

  const templates = [
    {
      id: "christian",
      title: "Christian Matrimony",
      icon: Church,
      description: "Holy Matrimony church ceremony + evening grand reception celebration.",
      events: ["Church Wedding", "Reception Dinner"],
      theme: "Elegant Minimal",
    },
    {
      id: "hindu",
      title: "Kerala Hindu Wedding",
      icon: Flower2,
      description: "Traditional Mehendi, auspicious Muhurtham ceremony & Grand Reception Sadhya.",
      events: ["Mehendi & Sangeet", "Muhurtham Rituals", "Reception Sadhya"],
      theme: "Kerala Traditional",
    },
    {
      id: "nikah",
      title: "Muslim Nikah",
      icon: Moon,
      description: "Sacred Nikah solemnization + celebratory Walima reception feast.",
      events: ["Nikah Solemnization", "Walima Feast"],
      theme: "Elegant Minimal",
    },
    {
      id: "secular",
      title: "Modern Contemporary",
      icon: Users,
      description: "Custom vows exchange + evening cocktail & dance reception.",
      events: ["Wedding Ceremony", "Celebration Party"],
      theme: "Elegant Minimal",
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
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">
            Step 1 of Setup
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-stone-900 mt-1">
            Choose Ceremony Template
          </h1>
          <p className="text-stone-600 text-sm mt-2 max-w-lg mx-auto">
            Select a cultural ceremony structure to automatically pre-fill customary events and timings. You can fully customize everything next.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {templates.map((tmpl) => {
            const Icon = tmpl.icon;
            const isSelected = selectedTemplate === tmpl.id;

            return (
              <div
                key={tmpl.id}
                onClick={() => setSelectedTemplate(tmpl.id)}
                className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? "bg-white border-amber-700 shadow-md ring-2 ring-amber-700/20"
                    : "bg-white/70 border-stone-200 hover:border-stone-300 hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected ? "bg-amber-100 text-amber-800" : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-stone-900 text-base">
                      {tmpl.title}
                    </h3>
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">
                      Suggested: {tmpl.theme}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  {tmpl.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-stone-100">
                  {tmpl.events.map((ev) => (
                    <span
                      key={ev}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium"
                    >
                      {ev}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-stone-600 hover:text-stone-900 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="px-8 py-3.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-75"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Initializing Workspace...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-400" /> Continue to Multi-Step Builder
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
