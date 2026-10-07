import React from "react";
import Image from "next/image";
import { MapPin, Calendar, Clock, Navigation, Heart, Sparkles } from "lucide-react";
import { ThemeProps } from "./types";
import { Countdown } from "@/components/invitation/Countdown";
import { RsvpSection } from "@/components/invitation/RsvpSection";
import { GalleryViewer } from "@/components/invitation/GalleryViewer";
import { ShareSheet } from "@/components/invitation/ShareSheet";

export function KeralaTraditionalTheme({ invitation, previewMode = false }: ThemeProps) {
  const coupleName = `${invitation.brideName} & ${invitation.groomName}`;
  const formattedDate = invitation.weddingDate
    ? new Date(invitation.weddingDate).toLocaleDateString("en-IN", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const mapSearchQuery = encodeURIComponent(
    `${invitation.venueName || ""} ${invitation.venueAddress || ""} ${invitation.city || ""} ${invitation.state || ""}`.trim()
  );

  return (
    <div className="min-h-screen bg-[#fffdf5] text-stone-900 font-sans selection:bg-amber-200">
      {/* Top Bar for Preview */}
      {previewMode && (
        <div className="sticky top-0 z-40 bg-amber-950 text-amber-200 text-xs py-2 px-4 text-center tracking-widest uppercase font-mono border-b border-amber-800">
          Live Theme Preview: Kerala Traditional (കേരളം)
        </div>
      )}

      {/* Traditional Kasavu Border Banner at top */}
      <div className="w-full h-3 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-700 shadow-sm" />

      {/* 1. Hero Section with Kerala Kasavu aesthetic & auspicious motifs */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 py-16 overflow-hidden">
        {invitation.coverMediaUrl && (
          <div className="absolute inset-0 z-0">
            <Image
              src={invitation.coverMediaUrl}
              alt={coupleName}
              fill
              className="object-cover opacity-20 filter contrast-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#fffdf5]/50 via-[#fffdf5]/85 to-[#fffdf5]" />
          </div>
        )}

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          {/* Traditional motif badge */}
          <div className="flex items-center gap-2 px-5 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-xs font-semibold uppercase tracking-[0.2em] mb-8 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>മംഗള മുഹൂർത്തം • Auspicious Union</span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif text-amber-950 tracking-tight leading-[1.08] mb-4">
            <span className="block font-semibold drop-shadow-sm">{invitation.brideName}</span>
            <span className="block text-xl sm:text-2xl font-serif text-amber-700 tracking-[0.3em] font-normal my-2">
              ✦ വെഡ്സ് ✦
            </span>
            <span className="block font-semibold drop-shadow-sm">{invitation.groomName}</span>
          </h1>

          {(invitation.brideFamilyName || invitation.groomFamilyName) && (
            <div className="mt-2 mb-8 p-3 rounded-2xl bg-amber-50/80 border border-amber-200/70 max-w-lg text-amber-900 text-xs sm:text-sm font-serif">
              {invitation.brideFamilyName && (
                <div className="font-medium">മകൾ / Daughter of: {invitation.brideFamilyName}</div>
              )}
              {invitation.groomFamilyName && (
                <div className="font-medium mt-0.5">മകൻ / Son of: {invitation.groomFamilyName}</div>
              )}
            </div>
          )}

          {formattedDate && (
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border-2 border-amber-400 bg-amber-50/90 text-amber-950 text-sm md:text-base font-serif mb-10 shadow-md">
              <Calendar className="w-4 h-4 text-amber-700" />
              <span className="font-bold">{formattedDate}</span>
              {invitation.weddingTime && (
                <>
                  <span className="text-amber-300">|</span>
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span className="font-semibold">{invitation.weddingTime}</span>
                </>
              )}
            </div>
          )}

          {/* 4. Countdown */}
          <div className="w-full max-w-md my-4">
            <Countdown
              targetDate={invitation.weddingDate}
              weddingTime={invitation.weddingTime}
              accentClass="text-amber-800"
              cardClass="bg-gradient-to-b from-white to-amber-50/70 border-2 border-amber-300/80 shadow-md backdrop-blur-sm"
            />
          </div>

          {invitation.description && (
            <p className="mt-8 text-amber-900/90 max-w-xl text-base md:text-lg font-serif italic leading-relaxed px-4">
              &ldquo;{invitation.description}&rdquo;
            </p>
          )}

          <div className="mt-10">
            <a
              href="#rsvp"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-amber-50 text-xs uppercase tracking-widest font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-amber-300 text-amber-300" /> RSVP / സാന്നിധ്യം അറിയിക്കുക
            </a>
          </div>
        </div>
      </section>

      {/* Golden Kasavu divider */}
      <div className="flex items-center justify-center gap-3 my-4 opacity-70">
        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-amber-500" />
        <span className="text-amber-700 text-lg">🪔</span>
        <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-amber-500" />
      </div>

      {/* 5. RSVP Section (§30 Blueprint: prominent early placement) */}
      {invitation.rsvpEnabled && (
        <section id="rsvp" className="py-16 px-4 bg-amber-50/60 border-y border-amber-200/80">
          <div className="max-w-4xl mx-auto">
            <RsvpSection
              invitationId={invitation.id}
              events={invitation.events.map((e) => ({ id: e.id, name: e.name }))}
              themeStyle="traditional"
            />
          </div>
        </section>
      )}

      {/* 6. Event Schedule Section with Kerala styling */}
      {invitation.events && invitation.events.length > 0 && (
        <section className="py-20 px-4 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-amber-800 font-bold">
              ചടങ്ങുകൾ • Ceremonies
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-amber-950 mt-2 font-bold">
              Wedding Schedule
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 mx-auto mt-4 rounded-full" />
          </div>

          <div className="space-y-6">
            {invitation.events.map((event, idx) => (
              <div
                key={event.id || idx}
                className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-amber-200/70 shadow-md hover:shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-amber-500 to-yellow-500" />

                <div className="space-y-2 flex-1 pl-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-amber-600 font-bold">✦</span>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-amber-950">
                      {event.name}
                    </h3>
                    {event.ceremonyType && (
                      <span className="text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                        {event.ceremonyType}
                      </span>
                    )}
                  </div>

                  {event.description && (
                    <p className="text-stone-700 text-sm leading-relaxed max-w-xl">
                      {event.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 pt-2">
                    {event.venueName && (
                      <span className="flex items-center gap-1 font-semibold text-amber-900">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        {event.venueName}
                      </span>
                    )}
                    {event.dressCode && (
                      <span className="bg-amber-50 px-2.5 py-1 rounded-md border border-amber-300 text-amber-900 font-medium">
                        Dress Code: {event.dressCode}
                      </span>
                    )}
                  </div>
                </div>

                {event.startAt && (
                  <div className="md:text-right border-t md:border-t-0 md:border-l border-amber-100 pt-3 md:pt-0 md:pl-6 min-w-[140px]">
                    <div className="text-sm font-serif font-bold text-amber-950">
                      {new Date(event.startAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-xs text-amber-800 font-semibold mt-0.5">
                      {new Date(event.startAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Venue & Directions */}
      {(invitation.venueName || invitation.venueAddress) && (
        <section className="py-20 px-4 bg-amber-100/40 border-t border-amber-200">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs uppercase tracking-[0.25em] text-amber-800 font-bold">
              വേദി • Venue & Maps
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-amber-950 mt-2 mb-6 font-bold">
              Wedding Venue
            </h2>

            <div className="bg-white p-8 rounded-3xl border-2 border-amber-200 shadow-md max-w-xl mx-auto">
              <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 mx-auto flex items-center justify-center text-amber-800 mb-4 shadow-inner">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-amber-950">
                {invitation.venueName}
              </h3>
              {invitation.venueAddress && (
                <p className="text-stone-700 text-sm mt-1">{invitation.venueAddress}</p>
              )}
              {(invitation.city || invitation.state) && (
                <p className="text-amber-800 font-medium text-xs mt-1">
                  {[invitation.city, invitation.state, invitation.country].filter(Boolean).join(", ")}
                </p>
              )}

              {invitation.travelInfo && (
                <div className="mt-4 p-3.5 bg-amber-50 rounded-xl text-xs text-amber-950 text-left border border-amber-200">
                  <span className="font-bold block mb-0.5">Travel & Parking Guide:</span>
                  {invitation.travelInfo}
                </div>
              )}

              <div className="mt-6">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${mapSearchQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-900 hover:bg-amber-950 text-amber-50 text-xs font-semibold uppercase tracking-wider transition shadow-md"
                >
                  <Navigation className="w-3.5 h-3.5" /> Open Google Maps Directions
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 8. Story Timeline */}
      {invitation.storyItems && invitation.storyItems.length > 0 && (
        <section className="py-20 px-4 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-amber-800 font-bold">
              ഞങ്ങളുടെ പ്രണയകഥ
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-amber-950 mt-2 font-bold">
              Our Wedding Story
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 mx-auto mt-4 rounded-full" />
          </div>

          <div className="relative border-l-2 border-amber-300 ml-4 md:ml-32 space-y-12">
            {invitation.storyItems.map((item, idx) => (
              <div key={item.id || idx} className="relative pl-8 group">
                <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-amber-600 border-2 border-white shadow-sm transition group-hover:scale-125" />
                {item.eventDate && (
                  <span className="md:absolute md:-left-28 md:text-right top-1 text-xs font-serif font-bold text-amber-900 uppercase tracking-widest block mb-1">
                    {item.eventDate}
                  </span>
                )}
                <div className="bg-white p-6 rounded-2xl border-2 border-amber-100 shadow-md">
                  <h3 className="text-xl font-serif font-bold text-amber-950 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-stone-700 text-sm leading-relaxed">{item.description}</p>
                  {item.imageUrl && (
                    <div className="relative mt-4 aspect-video rounded-xl overflow-hidden border border-amber-100">
                      <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 9. Photo Gallery */}
      {invitation.galleryItems && invitation.galleryItems.length > 0 && (
        <section className="py-20 px-4 max-w-5xl mx-auto border-t border-amber-200">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-amber-800 font-bold">
              ഓർമ്മകൾ • Gallery
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-amber-950 mt-2 font-bold">
              Photo Memories
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 mx-auto mt-4 rounded-full" />
          </div>

          <GalleryViewer items={invitation.galleryItems} />
        </section>
      )}

      {/* 11. Share Sheet & Closing Section */}
      <section className="py-16 px-4 bg-amber-950 text-amber-100 text-center relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600" />
        <div className="max-w-2xl mx-auto space-y-6 pt-4">
          <Heart className="w-8 h-8 text-amber-400 mx-auto fill-amber-400/30" />
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-amber-50">
            നിങ്ങളുടെ പ്രാർത്ഥനയും സാന്നിധ്യവും പ്രതീക്ഷിച്ചുകൊണ്ട്...
          </h2>
          <p className="text-amber-200/80 text-sm max-w-md mx-auto leading-relaxed">
            With prayers and joyous anticipation of your presence and blessings for our newly wedded life.
          </p>

          <div className="pt-4">
            <ShareSheet
              slug={invitation.slug}
              coupleTitle={coupleName}
              initialBaseUrl={invitation.baseUrl}
            />
          </div>

          <div className="pt-8 border-t border-amber-900 text-[11px] text-amber-400/60 uppercase tracking-widest font-mono">
            WedLink • കേരള ഡിജിറ്റൽ വെഡ്ഡിംഗ് സ്പേസ്
          </div>
        </div>
      </section>
    </div>
  );
}
