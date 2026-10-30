import React from "react";
import Image from "next/image";
import { MapPin, Calendar, Clock, Navigation, Heart, Sparkles } from "lucide-react";
import { ThemeProps } from "./types";
import { Countdown } from "@/components/invitation/Countdown";
import { RsvpSection } from "@/components/invitation/RsvpSection";
import { GalleryViewer } from "@/components/invitation/GalleryViewer";
import { ShareSheet } from "@/components/invitation/ShareSheet";

export function MughalNikahTheme({ invitation, previewMode = false }: ThemeProps) {
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
    <div className="min-h-screen bg-[#f5f7f0] text-stone-900 font-sans selection:bg-emerald-200">
      {/* Preview Bar */}
      {previewMode && (
        <div className="sticky top-0 z-40 bg-emerald-950 text-emerald-200 text-xs py-2 px-4 text-center tracking-widest uppercase font-mono border-b border-emerald-800">
          Live Theme Preview: Mughal Nikah (نکاح)
        </div>
      )}

      {/* Islamic geometric top border */}
      <div className="w-full h-4 bg-gradient-to-r from-emerald-800 via-emerald-600 to-emerald-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.2) 8px, rgba(255,255,255,0.2) 10px), repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(255,255,255,0.2) 8px, rgba(255,255,255,0.2) 10px)`
        }} />
      </div>

      {/* 1. Hero Section - Mughal Arch Aesthetic */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 py-16 overflow-hidden">
        {invitation.coverMediaUrl && (
          <div className="absolute inset-0 z-0">
            <Image
              src={invitation.coverMediaUrl}
              alt={coupleName}
              fill
              className="object-cover opacity-15"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#f5f7f0]/60 via-[#f5f7f0]/85 to-[#f5f7f0]" />
          </div>
        )}

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          {/* Bismillah badge */}
          <div className="flex flex-col items-center gap-2 mb-8">
            <div className="text-emerald-800 text-2xl font-serif" style={{ fontFamily: "serif" }}>
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </div>
            <div className="flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 text-emerald-900 text-xs font-bold uppercase tracking-[0.2em] shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Nikah Ceremony • نکاح</span>
            </div>
          </div>

          {/* Couple Names with Mughal-inspired decorative frame */}
          <div className="relative p-8 rounded-[2rem] border-2 border-emerald-200 bg-white/50 backdrop-blur-sm shadow-lg mb-6">
            {/* Decorative corner accents */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-emerald-400 rounded-br-lg" />

            <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif text-emerald-950 tracking-tight leading-[1.08]">
              <span className="block font-bold">{invitation.brideName}</span>
              <span className="block text-xl sm:text-2xl font-serif text-emerald-700 tracking-[0.3em] font-normal my-3">
                ☽ & ☽
              </span>
              <span className="block font-bold">{invitation.groomName}</span>
            </h1>
          </div>

          {(invitation.brideFamilyName || invitation.groomFamilyName) && (
            <div className="mt-2 mb-8 p-4 rounded-2xl bg-gradient-to-b from-emerald-50 to-teal-50/60 border-2 border-emerald-200/70 max-w-lg text-emerald-900 text-xs sm:text-sm font-serif">
              {invitation.brideFamilyName && (
                <div className="font-semibold">
                  <span className="text-emerald-600">☆</span> Daughter of: {invitation.brideFamilyName}
                </div>
              )}
              {invitation.groomFamilyName && (
                <div className="font-semibold mt-0.5">
                  <span className="text-emerald-600">☆</span> Son of: {invitation.groomFamilyName}
                </div>
              )}
            </div>
          )}

          {formattedDate && (
            <div className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full border-2 border-emerald-400 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-950 text-sm md:text-base font-serif mb-10 shadow-lg">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span className="font-bold">{formattedDate}</span>
              {invitation.weddingTime && (
                <>
                  <span className="text-emerald-300">|</span>
                  <Clock className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold">{invitation.weddingTime}</span>
                </>
              )}
            </div>
          )}

          {/* Countdown */}
          <div className="w-full max-w-md my-4">
            <Countdown
              targetDate={invitation.weddingDate}
              weddingTime={invitation.weddingTime}
              accentClass="text-emerald-900"
              cardClass="bg-gradient-to-b from-white to-emerald-50/70 border-2 border-emerald-300/80 shadow-lg backdrop-blur-sm"
            />
          </div>

          {invitation.description && (
            <p className="mt-8 text-emerald-900/90 max-w-xl text-base md:text-lg font-serif italic leading-relaxed px-4">
              &ldquo;{invitation.description}&rdquo;
            </p>
          )}

          <div className="mt-10">
            <a
              href="#rsvp"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-800 to-emerald-950 hover:from-emerald-900 hover:to-emerald-950 text-emerald-50 text-xs uppercase tracking-widest font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-emerald-300 text-emerald-300" /> RSVP • دعوت قبول کریں
            </a>
          </div>
        </div>
      </section>

      {/* Islamic geometric divider */}
      <div className="flex items-center justify-center gap-3 my-4 opacity-70">
        <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-emerald-400 to-emerald-600" />
        <span className="text-emerald-700 text-lg">☽</span>
        <div className="h-[2px] w-24 bg-gradient-to-l from-transparent via-emerald-400 to-emerald-600" />
      </div>

      {/* RSVP Section */}
      {invitation.rsvpEnabled && (
        <section id="rsvp" className="py-16 px-4 bg-emerald-50/60 border-y border-emerald-200/80">
          <div className="max-w-4xl mx-auto">
            <RsvpSection
              invitationId={invitation.id}
              events={invitation.events.map((e) => ({ id: e.id, name: e.name }))}
              themeStyle="traditional"
            />
          </div>
        </section>
      )}

      {/* Event Schedule Section */}
      {invitation.events && invitation.events.length > 0 && (
        <section className="py-20 px-4 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-emerald-800 font-bold">
              تقریبات • Ceremonies
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-emerald-950 mt-2 font-bold">
              Wedding Events
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto mt-4 rounded-full" />
          </div>

          <div className="space-y-6">
            {invitation.events.map((event, idx) => (
              <div
                key={event.id || idx}
                className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-emerald-200/70 shadow-md hover:shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-emerald-600 to-teal-500" />

                <div className="space-y-2 flex-1 pl-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-emerald-600 font-bold">☆</span>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-emerald-950">
                      {event.name}
                    </h3>
                    {event.ceremonyType && (
                      <span className="text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
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
                      <span className="flex items-center gap-1 font-semibold text-emerald-900">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        {event.venueName}
                      </span>
                    )}
                    {event.dressCode && (
                      <span className="bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-300 text-emerald-900 font-medium">
                        Attire: {event.dressCode}
                      </span>
                    )}
                  </div>
                </div>

                {event.startAt && (
                  <div className="md:text-right border-t md:border-t-0 md:border-l border-emerald-100 pt-3 md:pt-0 md:pl-6 min-w-[140px]">
                    <div className="text-sm font-serif font-bold text-emerald-950">
                      {new Date(event.startAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-xs text-emerald-800 font-semibold mt-0.5">
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

      {/* Venue & Directions */}
      {(invitation.venueName || invitation.venueAddress) && (
        <section className="py-20 px-4 bg-emerald-100/40 border-t border-emerald-200">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs uppercase tracking-[0.25em] text-emerald-800 font-bold">
              مقام • Venue & Directions
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-emerald-950 mt-2 mb-6 font-bold">
              Wedding Venue
            </h2>

            <div className="bg-white p-8 rounded-3xl border-2 border-emerald-200 shadow-lg max-w-xl mx-auto">
              <div className="w-14 h-14 rounded-full bg-gradient-to-b from-emerald-100 to-teal-100 border-2 border-emerald-200 mx-auto flex items-center justify-center text-emerald-800 mb-4 shadow-inner">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-emerald-950">
                {invitation.venueName}
              </h3>
              {invitation.venueAddress && (
                <p className="text-stone-700 text-sm mt-1">{invitation.venueAddress}</p>
              )}
              {(invitation.city || invitation.state) && (
                <p className="text-emerald-800 font-medium text-xs mt-1">
                  {[invitation.city, invitation.state, invitation.country].filter(Boolean).join(", ")}
                </p>
              )}

              {invitation.travelInfo && (
                <div className="mt-4 p-3.5 bg-emerald-50 rounded-xl text-xs text-emerald-950 text-left border border-emerald-200">
                  <span className="font-bold block mb-0.5">Travel & Accommodation:</span>
                  {invitation.travelInfo}
                </div>
              )}

              <div className="mt-6">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${mapSearchQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-900 hover:bg-emerald-950 text-emerald-50 text-xs font-semibold uppercase tracking-wider transition shadow-md"
                >
                  <Navigation className="w-3.5 h-3.5" /> Get Directions
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Story Timeline */}
      {invitation.storyItems && invitation.storyItems.length > 0 && (
        <section className="py-20 px-4 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-emerald-800 font-bold">
              ہماری کہانی • Our Story
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-emerald-950 mt-2 font-bold">
              Our Love Story
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto mt-4 rounded-full" />
          </div>

          <div className="relative border-l-2 border-emerald-300 ml-4 md:ml-32 space-y-12">
            {invitation.storyItems.map((item, idx) => (
              <div key={item.id || idx} className="relative pl-8 group">
                <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow-sm transition group-hover:scale-125" />
                {item.eventDate && (
                  <span className="md:absolute md:-left-28 md:text-right top-1 text-xs font-serif font-bold text-emerald-900 uppercase tracking-widest block mb-1">
                    {item.eventDate}
                  </span>
                )}
                <div className="bg-white p-6 rounded-2xl border-2 border-emerald-100 shadow-md">
                  <h3 className="text-xl font-serif font-bold text-emerald-950 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-stone-700 text-sm leading-relaxed">{item.description}</p>
                  {item.imageUrl && (
                    <div className="relative mt-4 aspect-video rounded-xl overflow-hidden border border-emerald-100">
                      <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Photo Gallery */}
      {invitation.galleryItems && invitation.galleryItems.length > 0 && (
        <section className="py-20 px-4 max-w-5xl mx-auto border-t border-emerald-200">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-emerald-800 font-bold">
              تصاویر • Gallery
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-emerald-950 mt-2 font-bold">
              Photo Gallery
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto mt-4 rounded-full" />
          </div>

          <GalleryViewer items={invitation.galleryItems} />
        </section>
      )}

      {/* Closing & Share Section */}
      <section className="py-16 px-4 bg-emerald-950 text-emerald-100 text-center relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600" />
        <div className="max-w-2xl mx-auto space-y-6 pt-4">
          <Heart className="w-8 h-8 text-emerald-400 mx-auto fill-emerald-400/30" />
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-emerald-50">
            آپ کی دعاؤں اور حضوری کے منتظر
          </h2>
          <p className="text-emerald-200/80 text-sm max-w-md mx-auto leading-relaxed">
            Your prayers, blessings, and gracious presence will complete the joy of this sacred union. In sha Allah, we look forward to celebrating together.
          </p>

          <div className="pt-4">
            <ShareSheet
              slug={invitation.slug}
              coupleTitle={coupleName}
              initialBaseUrl={invitation.baseUrl}
            />
          </div>

          <div className="pt-8 border-t border-emerald-900 text-[11px] text-emerald-400/60 uppercase tracking-widest font-mono">
            WedLink • Nikah Digital Wedding Space
          </div>
        </div>
      </section>
    </div>
  );
}
