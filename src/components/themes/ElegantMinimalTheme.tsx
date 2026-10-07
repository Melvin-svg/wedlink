import React from "react";
import Image from "next/image";
import { MapPin, Calendar, Clock, Navigation, Heart, Sparkles } from "lucide-react";
import { ThemeProps } from "./types";
import { Countdown } from "@/components/invitation/Countdown";
import { RsvpSection } from "@/components/invitation/RsvpSection";
import { GalleryViewer } from "@/components/invitation/GalleryViewer";
import { ShareSheet } from "@/components/invitation/ShareSheet";

export function ElegantMinimalTheme({ invitation, previewMode = false }: ThemeProps) {
  const coupleName = `${invitation.brideName} & ${invitation.groomName}`;
  const formattedDate = invitation.weddingDate
    ? new Date(invitation.weddingDate).toLocaleDateString("en-US", {
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
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 font-sans selection:bg-stone-200">
      {/* Top Subtle Notification Bar if Preview */}
      {previewMode && (
        <div className="sticky top-0 z-40 bg-stone-900/90 backdrop-blur-md text-stone-200 text-xs py-2 px-4 text-center tracking-widest uppercase font-mono">
          Live Theme Preview: Elegant Minimal
        </div>
      )}

      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 py-16 overflow-hidden">
        {invitation.coverMediaUrl && (
          <div className="absolute inset-0 z-0">
            <Image
              src={invitation.coverMediaUrl}
              alt={coupleName}
              fill
              className="object-cover opacity-25 filter brightness-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#faf8f5]/40 via-[#faf8f5]/80 to-[#faf8f5]" />
          </div>
        )}

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <span className="inline-flex items-center gap-2 text-xs md:text-sm uppercase tracking-[0.3em] font-semibold text-stone-500 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Together With Their Families
          </span>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif tracking-tight text-stone-900 leading-[1.05] mb-6">
            <span className="block font-light italic">{invitation.brideName}</span>
            <span className="block text-2xl sm:text-3xl font-sans tracking-[0.2em] font-light text-stone-400 my-2">
              &
            </span>
            <span className="block font-light italic">{invitation.groomName}</span>
          </h1>

          {(invitation.brideFamilyName || invitation.groomFamilyName) && (
            <p className="text-stone-500 text-sm max-w-lg mb-8 tracking-wide font-light">
              {invitation.brideFamilyName && <span>D/o {invitation.brideFamilyName}</span>}
              {invitation.brideFamilyName && invitation.groomFamilyName && <span> • </span>}
              {invitation.groomFamilyName && <span>S/o {invitation.groomFamilyName}</span>}
            </p>
          )}

          {formattedDate && (
            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-stone-300 bg-white/60 backdrop-blur-sm text-stone-800 text-sm md:text-base font-serif mb-10 shadow-sm">
              <Calendar className="w-4 h-4 text-amber-700" />
              <span>{formattedDate}</span>
              {invitation.weddingTime && (
                <>
                  <span className="text-stone-300">|</span>
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span>{invitation.weddingTime}</span>
                </>
              )}
            </div>
          )}

          {/* 4. Countdown */}
          <div className="w-full max-w-md my-4">
            <Countdown
              targetDate={invitation.weddingDate}
              weddingTime={invitation.weddingTime}
              accentClass="text-stone-800"
              cardClass="bg-white/80 border border-stone-200/90 shadow-sm backdrop-blur-sm"
            />
          </div>

          {invitation.description && (
            <p className="mt-8 text-stone-600 max-w-xl text-base md:text-lg font-serif italic leading-relaxed">
              &ldquo;{invitation.description}&rdquo;
            </p>
          )}

          <div className="mt-10">
            <a
              href="#rsvp"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs uppercase tracking-widest font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-white text-white" /> Kindly RSVP
            </a>
          </div>
        </div>
      </section>

      {/* 5. RSVP Section placed prominently high (§30 Blueprint Requirement) */}
      {invitation.rsvpEnabled && (
        <section id="rsvp" className="py-16 px-4 bg-stone-100/70 border-y border-stone-200/80">
          <div className="max-w-4xl mx-auto">
            <RsvpSection
              invitationId={invitation.id}
              events={invitation.events.map((e) => ({ id: e.id, name: e.name }))}
              themeStyle="minimal"
            />
          </div>
        </section>
      )}

      {/* 6. Event Schedule Section */}
      {invitation.events && invitation.events.length > 0 && (
        <section className="py-20 px-4 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold">
              The Celebration
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 mt-2 font-normal">
              Schedule of Events
            </h2>
            <div className="w-12 h-[1px] bg-stone-400 mx-auto mt-4" />
          </div>

          <div className="space-y-6">
            {invitation.events.map((event, idx) => (
              <div
                key={event.id || idx}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-amber-600" />
                    <h3 className="text-xl sm:text-2xl font-serif font-medium text-stone-900">
                      {event.name}
                    </h3>
                    {event.ceremonyType && (
                      <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600">
                        {event.ceremonyType}
                      </span>
                    )}
                  </div>

                  {event.description && (
                    <p className="text-stone-600 text-sm leading-relaxed max-w-xl">
                      {event.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-2">
                    {event.venueName && (
                      <span className="flex items-center gap-1 font-medium text-stone-700">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        {event.venueName}
                      </span>
                    )}
                    {event.dressCode && (
                      <span className="bg-stone-50 px-2 py-0.5 rounded border border-stone-200">
                        Attire: {event.dressCode}
                      </span>
                    )}
                  </div>
                </div>

                {event.startAt && (
                  <div className="md:text-right border-t md:border-t-0 md:border-l border-stone-100 pt-3 md:pt-0 md:pl-6 min-w-[140px]">
                    <div className="text-sm font-serif font-semibold text-stone-800">
                      {new Date(event.startAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-xs text-stone-500">
                      {new Date(event.startAt).toLocaleTimeString("en-US", {
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
        <section className="py-20 px-4 bg-stone-100/50 border-t border-stone-200">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold">
              Location & Travel
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 mt-2 mb-6">
              Wedding Venue
            </h2>

            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-stone-700 mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900">
                {invitation.venueName}
              </h3>
              {invitation.venueAddress && (
                <p className="text-stone-600 text-sm mt-1">{invitation.venueAddress}</p>
              )}
              {(invitation.city || invitation.state) && (
                <p className="text-stone-500 text-xs mt-1">
                  {[invitation.city, invitation.state, invitation.country].filter(Boolean).join(", ")}
                </p>
              )}

              {invitation.travelInfo && (
                <div className="mt-4 p-3 bg-stone-50 rounded-xl text-xs text-stone-600 text-left">
                  <span className="font-semibold block mb-0.5">Travel & Parking:</span>
                  {invitation.travelInfo}
                </div>
              )}

              <div className="mt-6">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${mapSearchQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider transition shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5" /> Get Directions via Google Maps
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
            <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold">
              Our Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 mt-2">The Story So Far</h2>
            <div className="w-12 h-[1px] bg-stone-400 mx-auto mt-4" />
          </div>

          <div className="relative border-l border-stone-300 ml-4 md:ml-32 space-y-12">
            {invitation.storyItems.map((item, idx) => (
              <div key={item.id || idx} className="relative pl-8 group">
                <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-stone-800 transition group-hover:scale-125" />
                {item.eventDate && (
                  <span className="md:absolute md:-left-28 md:text-right top-1 text-xs font-serif font-bold text-stone-500 uppercase tracking-widest block mb-1">
                    {item.eventDate}
                  </span>
                )}
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                  <h3 className="text-xl font-serif font-semibold text-stone-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">{item.description}</p>
                  {item.imageUrl && (
                    <div className="relative mt-4 aspect-video rounded-xl overflow-hidden">
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
        <section className="py-20 px-4 max-w-5xl mx-auto border-t border-stone-200">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold">
              Moments
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 mt-2">Captured Memories</h2>
            <div className="w-12 h-[1px] bg-stone-400 mx-auto mt-4" />
          </div>

          <GalleryViewer items={invitation.galleryItems} />
        </section>
      )}

      {/* 11. Share Sheet & Closing Section */}
      <section className="py-16 px-4 bg-stone-900 text-white text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <Heart className="w-8 h-8 text-amber-400 mx-auto fill-amber-400/20" />
          <h2 className="text-3xl sm:text-4xl font-serif font-normal">
            We Can&apos;t Wait to Celebrate with You
          </h2>
          <p className="text-stone-300 text-sm max-w-md mx-auto leading-relaxed">
            Your love, laughter, and presence mean everything to us as we begin this new chapter together.
          </p>

          <div className="pt-4">
            <ShareSheet
              slug={invitation.slug}
              coupleTitle={coupleName}
              initialBaseUrl={invitation.baseUrl}
            />
          </div>

          <div className="pt-8 border-t border-stone-800 text-[11px] text-stone-500 uppercase tracking-widest font-mono">
            Powered by WedLink • One Link. Every Memory.
          </div>
        </div>
      </section>
    </div>
  );
}
