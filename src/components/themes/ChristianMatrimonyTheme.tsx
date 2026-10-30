import React from "react";
import Image from "next/image";
import { MapPin, Calendar, Clock, Navigation, Heart, Church } from "lucide-react";
import { ThemeProps } from "./types";
import { Countdown } from "@/components/invitation/Countdown";
import { RsvpSection } from "@/components/invitation/RsvpSection";
import { GalleryViewer } from "@/components/invitation/GalleryViewer";
import { ShareSheet } from "@/components/invitation/ShareSheet";

export function ChristianMatrimonyTheme({ invitation, previewMode = false }: ThemeProps) {
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
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 font-serif selection:bg-amber-100 selection:text-amber-900">
      {/* Top Subtle Notification Bar if Preview */}
      {previewMode && (
        <div className="sticky top-0 z-40 bg-stone-900 text-amber-200 text-xs py-2 px-4 text-center tracking-widest uppercase font-sans">
          Live Theme Preview: Cathedral Holy Matrimony (Christian)
        </div>
      )}

      {/* Decorative Gold Header Top Border */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200" />

      {/* 1. Hero Section — Cathedral Arch Aesthetic */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 py-16 overflow-hidden">
        {invitation.coverMediaUrl && (
          <div className="absolute inset-0 z-0">
            <Image
              src={invitation.coverMediaUrl}
              alt={coupleName}
              fill
              className="object-cover opacity-20 filter brightness-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#faf8f5]/60 via-[#faf8f5]/90 to-[#faf8f5]" />
          </div>
        )}

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          {/* Sacred Cross & Olive Branch Emblem */}
          <div className="mb-6 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full border border-amber-300/80 bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm text-amber-800">
              <svg className="w-7 h-7 text-amber-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 2v20M6 8h12" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <div className="h-px w-8 bg-amber-400/60" />
              <span className="font-sans text-[11px] uppercase tracking-[0.35em] text-amber-800 font-semibold">
                Holy Matrimony
              </span>
              <div className="h-px w-8 bg-amber-400/60" />
            </div>
          </div>

          <span className="font-sans text-xs uppercase tracking-[0.25em] text-stone-500 mb-4 font-medium">
            Together With Their Families In God&apos;s Grace
          </span>

          {/* Couple Names in Classical Graceful Serif */}
          <div className="my-3">
            <h1 className="text-5xl sm:text-7xl md:text-8xl tracking-tight text-stone-900 leading-[1.1]">
              <span className="block italic font-normal">{invitation.brideName}</span>
              <span className="block text-xl sm:text-2xl font-sans tracking-[0.3em] uppercase text-amber-700 my-2">
                — & —
              </span>
              <span className="block italic font-normal">{invitation.groomName}</span>
            </h1>
          </div>

          {(invitation.brideFamilyName || invitation.groomFamilyName) && (
            <p className="font-sans text-stone-600 text-xs sm:text-sm max-w-lg mb-6 tracking-wide font-light">
              {invitation.brideFamilyName && <span>Daughter of {invitation.brideFamilyName}</span>}
              {invitation.brideFamilyName && invitation.groomFamilyName && <span> &bull; </span>}
              {invitation.groomFamilyName && <span>Son of {invitation.groomFamilyName}</span>}
            </p>
          )}

          {/* Scripture Verse Card */}
          <div className="max-w-xl mx-auto my-4 p-5 rounded-2xl bg-white/70 border border-amber-200/70 shadow-sm backdrop-blur-sm text-center">
            <p className="italic text-stone-700 text-sm sm:text-base leading-relaxed">
              &ldquo;Therefore what God has joined together, let no one separate.&rdquo;
            </p>
            <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-amber-800 font-bold block mt-1.5">
              Mark 10:9
            </span>
          </div>

          {formattedDate && (
            <div className="font-sans inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-amber-300/80 bg-white/90 backdrop-blur-sm text-stone-800 text-sm md:text-base mb-6 shadow-sm">
              <Calendar className="w-4 h-4 text-amber-700" />
              <span className="font-serif font-medium">{formattedDate}</span>
              {invitation.weddingTime && (
                <>
                  <span className="text-amber-300">|</span>
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span>{invitation.weddingTime}</span>
                </>
              )}
            </div>
          )}

          {/* Countdown Section */}
          <div className="w-full max-w-md my-2">
            <Countdown
              targetDate={invitation.weddingDate}
              weddingTime={invitation.weddingTime}
              accentClass="text-amber-900"
              cardClass="bg-white/90 border border-amber-200/80 shadow-sm backdrop-blur-sm"
            />
          </div>

          {invitation.description && (
            <p className="mt-6 text-stone-600 max-w-xl text-base md:text-lg italic leading-relaxed">
              &ldquo;{invitation.description}&rdquo;
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 font-sans">
            <a
              href="#events"
              className="px-7 py-3 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider shadow-md transition"
            >
              Order of Service
            </a>
            {invitation.rsvpEnabled && (
              <a
                href="#rsvp"
                className="px-7 py-3 rounded-full bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold uppercase tracking-wider shadow-md transition"
              >
                RSVP for Holy Matrimony
              </a>
            )}
          </div>
        </div>
      </section>

      {/* 2. Couple Portrait Showcase */}
      {(invitation.bridePhotoUrl || invitation.groomPhotoUrl) && (
        <section className="py-20 px-4 bg-gradient-to-b from-[#faf8f5] via-white to-[#faf8f5]">
          <div className="max-w-4xl mx-auto text-center">
            <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-amber-800 font-semibold block mb-2">
              United in Love &amp; Faith
            </span>
            <h2 className="text-3xl sm:text-4xl text-stone-900 mb-12">The Bride &amp; Groom</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
              {invitation.bridePhotoUrl && (
                <div className="flex flex-col items-center">
                  <div className="relative w-52 h-64 sm:w-60 sm:h-72 rounded-t-full rounded-b-2xl overflow-hidden border-4 border-white shadow-xl ring-1 ring-amber-200">
                    <Image
                      src={invitation.bridePhotoUrl}
                      alt={invitation.brideName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-2xl text-stone-900 mt-4 italic">{invitation.brideName}</h3>
                  <span className="font-sans text-xs text-amber-800 uppercase tracking-widest font-semibold mt-0.5">
                    The Bride
                  </span>
                </div>
              )}

              {invitation.groomPhotoUrl && (
                <div className="flex flex-col items-center">
                  <div className="relative w-52 h-64 sm:w-60 sm:h-72 rounded-t-full rounded-b-2xl overflow-hidden border-4 border-white shadow-xl ring-1 ring-amber-200">
                    <Image
                      src={invitation.groomPhotoUrl}
                      alt={invitation.groomName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-2xl text-stone-900 mt-4 italic">{invitation.groomName}</h3>
                  <span className="font-sans text-xs text-amber-800 uppercase tracking-widest font-semibold mt-0.5">
                    The Groom
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 3. Events Schedule / Liturgical Order */}
      <section id="events" className="py-20 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-800 mb-3">
            <Church className="w-5 h-5" />
          </div>
          <h2 className="text-3xl sm:text-4xl text-stone-900">Celebration Schedule</h2>
          <p className="font-sans text-xs sm:text-sm text-stone-500 mt-2 max-w-md mx-auto">
            Please join us in the sacred ceremony and joyous reception celebrating this holy covenant.
          </p>
        </div>

        <div className="space-y-6">
          {invitation.events.map((event) => {
            const startFormatted = event.startAt
              ? new Date(event.startAt).toLocaleString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })
              : null;

            return (
              <div
                key={event.id}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/80 shadow-sm hover:shadow-md transition relative overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300" />
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2">
                    {event.ceremonyType && (
                      <span className="font-sans text-[10px] uppercase tracking-widest px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-semibold inline-block">
                        {event.ceremonyType}
                      </span>
                    )}
                    <h3 className="text-2xl text-stone-900 italic font-medium">{event.name}</h3>
                    {event.description && (
                      <p className="font-sans text-sm text-stone-600 max-w-xl leading-relaxed">
                        {event.description}
                      </p>
                    )}
                  </div>

                  <div className="font-sans space-y-1.5 text-xs text-stone-600 sm:text-right shrink-0">
                    {startFormatted && (
                      <div className="flex items-center sm:justify-end gap-1.5 font-medium text-stone-800">
                        <Clock className="w-4 h-4 text-amber-700" />
                        <span>{startFormatted}</span>
                      </div>
                    )}
                    {event.venueName && (
                      <div className="flex items-center sm:justify-end gap-1.5">
                        <MapPin className="w-4 h-4 text-amber-700" />
                        <span>{event.venueName}</span>
                      </div>
                    )}
                    {event.dressCode && (
                      <div className="text-[11px] text-stone-500 italic">
                        Attire: {event.dressCode}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Venue & Directions */}
      {(invitation.venueName || invitation.venueAddress) && (
        <section className="py-20 px-4 bg-white border-y border-amber-100">
          <div className="max-w-3xl mx-auto text-center">
            <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-amber-800 font-semibold block mb-2">
              Sacred Location
            </span>
            <h2 className="text-3xl sm:text-4xl text-stone-900 mb-6">Church &amp; Venue</h2>

            <div className="p-8 rounded-3xl bg-[#faf8f5] border border-amber-200/80 shadow-sm max-w-xl mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                <MapPin className="w-6 h-6" />
              </div>

              {invitation.venueName && (
                <h3 className="text-2xl text-stone-900 italic">{invitation.venueName}</h3>
              )}

              {invitation.venueAddress && (
                <p className="font-sans text-sm text-stone-600 leading-relaxed">
                  {invitation.venueAddress}
                  {invitation.city && `, ${invitation.city}`}
                  {invitation.state && `, ${invitation.state}`}
                </p>
              )}

              {invitation.dressCode && (
                <p className="font-sans text-xs text-amber-800 font-medium">
                  Dress Code: {invitation.dressCode}
                </p>
              )}

              {invitation.travelInfo && (
                <p className="font-sans text-xs text-stone-500 max-w-md mx-auto pt-2 border-t border-stone-200">
                  {invitation.travelInfo}
                </p>
              )}

              <div className="pt-4 font-sans">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${mapSearchQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider transition shadow"
                >
                  <Navigation className="w-3.5 h-3.5 text-amber-400" /> Get Directions
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. Love Story Timeline */}
      {invitation.storyItems && invitation.storyItems.length > 0 && (
        <section className="py-20 px-4 max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-amber-800 font-semibold block mb-2">
              Our Journey In Faith
            </span>
            <h2 className="text-3xl sm:text-4xl text-stone-900">How God Brought Us Together</h2>
          </div>

          <div className="relative border-l-2 border-amber-300 ml-4 sm:ml-32 space-y-12">
            {invitation.storyItems.map((story) => (
              <div key={story.id} className="relative pl-8 sm:pl-10">
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-amber-700 border-2 border-white shadow" />
                {story.eventDate && (
                  <span className="font-sans text-xs uppercase tracking-wider font-bold text-amber-800 sm:absolute sm:-left-32 sm:top-1 sm:text-right sm:w-24 block mb-1">
                    {story.eventDate}
                  </span>
                )}
                <h3 className="text-xl text-stone-900 italic font-semibold">{story.title}</h3>
                <p className="font-sans text-sm text-stone-600 mt-2 leading-relaxed">
                  {story.description}
                </p>
                {story.imageUrl && (
                  <div className="relative w-full h-56 rounded-2xl overflow-hidden mt-4 border border-stone-200">
                    <Image src={story.imageUrl} alt={story.title} fill className="object-cover" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Photo Gallery */}
      {invitation.galleryItems && invitation.galleryItems.length > 0 && (
        <section className="py-20 px-4 bg-[#f8f5ee] border-t border-amber-100">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-amber-800 font-semibold block mb-2">
                Cherished Moments
              </span>
              <h2 className="text-3xl sm:text-4xl text-stone-900">Our Gallery</h2>
            </div>
            <GalleryViewer items={invitation.galleryItems} />
          </div>
        </section>
      )}

      {/* 7. RSVP Section */}
      {invitation.rsvpEnabled && (
        <section id="rsvp" className="py-20 px-4 max-w-xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-amber-700" />
            </div>
            <h2 className="text-3xl sm:text-4xl text-stone-900">Will You Join Us?</h2>
            <p className="font-sans text-xs sm:text-sm text-stone-500 mt-2">
              Kindly confirm your attendance so we may reserve your seat in celebration and prayer.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-amber-200/90 shadow-md">
            <RsvpSection invitationId={invitation.id} />
          </div>
        </section>
      )}

      {/* 8. Share Sheet */}
      <section className="py-12 px-4 max-w-md mx-auto text-center font-sans">
        <ShareSheet
          slug={invitation.slug}
          coupleTitle={coupleName}
          initialBaseUrl={invitation.baseUrl}
        />
      </section>

      {/* 9. Sacred Footer */}
      <footer className="py-16 px-4 bg-stone-900 text-stone-300 text-center font-sans">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-10 h-10 rounded-full border border-amber-500/40 mx-auto flex items-center justify-center text-amber-400">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 2v20M6 8h12" strokeLinecap="round" />
            </svg>
          </div>
          <p className="font-serif italic text-2xl text-amber-200">{coupleName}</p>
          <p className="text-xs uppercase tracking-widest text-amber-400/80">
            United in Holy Matrimony &bull; {formattedDate}
          </p>
          <p className="text-[11px] text-stone-400 italic font-serif pt-4 border-t border-stone-800">
            &ldquo;And over all these virtues put on love, which binds them all together in perfect unity.&rdquo; &mdash; Colossians 3:14
          </p>
        </div>
      </footer>
    </div>
  );
}
