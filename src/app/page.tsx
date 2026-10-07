import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import {
  Heart,
  QrCode,
  ShieldCheck,
  CalendarDays,
  Smartphone,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  MapPin,
  Camera,
  Share2,
  Clock,
  Sparkle,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fcfbf9] text-stone-900 flex flex-col font-sans selection:bg-amber-100">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50/80 border border-amber-200/90 text-amber-900 text-xs uppercase tracking-[0.2em] font-semibold mb-6 shadow-xs backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Digital Wedding Space • India &amp; Kerala First</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-stone-900 tracking-tight leading-[1.08] max-w-4xl mx-auto">
            Your wedding. One private link.{" "}
            <span className="italic font-light text-amber-800 underline decoration-amber-300 decoration-wavy underline-offset-8">
              Every memory.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-stone-600 max-w-2xl mx-auto font-light leading-relaxed mt-6 mb-10">
            A serene, private digital space that starts as your interactive invitation, guides your guests on the wedding day with live schedules &amp; Google Maps, and endures as a timeless memory book.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs sm:text-sm uppercase tracking-widest shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Create Your Wedding Space</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/invite/melvin-meenu"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-stone-50 text-stone-800 font-medium text-xs sm:text-sm tracking-widest uppercase border border-stone-200 shadow-sm transition flex items-center justify-center gap-2"
            >
              <span>Experience Demo Invitation</span>
            </Link>
          </div>

          {/* Social Proof badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-stone-500 uppercase tracking-widest font-medium">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> No App Needed for Guests
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> WhatsApp Ready Links
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Kerala Multi-Day Functions
            </span>
          </div>

          {/* Hero Visual Mockup Preview */}
          <div className="mt-16 max-w-5xl mx-auto rounded-3xl p-3 sm:p-5 bg-white/70 border border-stone-200 shadow-2xl backdrop-blur-md">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden shadow-inner bg-stone-100">
              <Image
                src="/demo/hero-couple.jpg"
                alt="Melvin & Meenu Wedding Celebration in Kerala"
                fill
                priority
                className="object-cover filter contrast-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white text-left">
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-amber-300 font-semibold mb-1">
                  Featured Space • Live Invitation Preview
                </span>
                <h3 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-wide">
                  Melvin &amp; Meenu
                </h3>
                <p className="text-xs sm:text-sm text-stone-200 max-w-lg mt-1 font-light">
                  Holy Matrimony &amp; Grand Sadhya Reception • Thrissur, Kerala
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Phases Section: Product Lifecycle */}
      <section className="py-20 bg-white border-y border-stone-200/90 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-amber-800 font-bold">
              The WedLink Experience
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 mt-2 font-normal">
              One persistent link through every moment
            </h2>
            <p className="text-stone-600 text-sm mt-3">
              Printed cards get misplaced. WedLink stays alive before, during, and long after the celebration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Before */}
            <div className="p-8 rounded-3xl bg-stone-50/80 border border-stone-200/80 shadow-xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-serif font-bold text-lg mb-6">
                01
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900 mb-1">Before the Wedding</h3>
              <p className="text-[11px] text-amber-800 font-semibold uppercase tracking-wider mb-4">
                Invitation &amp; Coordination
              </p>
              <ul className="space-y-3 text-xs text-stone-600">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" /> Couple story &amp; high-res photo gallery
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" /> Multi-event schedules &amp; attire dress codes
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" /> One-tap Google Maps directions for venues
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" /> Seamless RSVP with headcount &amp; Sadhya meal choices
                </li>
              </ul>
            </div>

            {/* During */}
            <div className="p-8 rounded-3xl bg-amber-50/70 border-2 border-amber-300/80 shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-2xl bg-amber-800 text-white flex items-center justify-center font-serif font-bold text-lg mb-6">
                02
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900 mb-1">On the Wedding Day</h3>
              <p className="text-[11px] text-amber-800 font-semibold uppercase tracking-wider mb-4">
                Live Day Coordination
              </p>
              <ul className="space-y-3 text-xs text-stone-600">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" /> Print-ready QR code for physical invitation cards
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" /> Live countdown transitioning to &ldquo;Today!&rdquo;
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" /> Direct navigation for relatives travelling to venues
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" /> Instant WhatsApp invite message forwarding
                </li>
              </ul>
            </div>

            {/* After */}
            <div className="p-8 rounded-3xl bg-stone-50/80 border border-stone-200/80 shadow-xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-stone-200 text-stone-800 flex items-center justify-center font-serif font-bold text-lg mb-6">
                03
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900 mb-1">After the Wedding</h3>
              <p className="text-[11px] text-stone-500 font-semibold uppercase tracking-wider mb-4">
                Permanent Memory Book
              </p>
              <ul className="space-y-3 text-xs text-stone-600">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-stone-500 shrink-0" /> Lasting digital archive accessible forever
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-stone-500 shrink-0" /> Lightbox photo moments with family &amp; friends
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-stone-500 shrink-0" /> Preserved guest blessings, wishes &amp; love notes
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-stone-500 shrink-0" /> CSV export of all guest responses anytime
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Showcase Gallery */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-800 font-bold">
            Curated Aesthetics
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 mt-2 font-normal">
            Bespoke Wedding Atmosphere
          </h2>
          <p className="text-stone-600 text-sm mt-3">
            Every element is styled with editorial typography, subtle micro-interactions, and cultural authenticity.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md">
            <Image src="/demo/jasmine.jpg" alt="Jasmine and Kasavu traditions" fill className="object-cover hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 text-white text-xs font-serif">
              Kasavu &amp; Traditions
            </div>
          </div>
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md">
            <Image src="/demo/munnar.jpg" alt="Munnar Tea Hills pre-wedding shoot" fill className="object-cover hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 text-white text-xs font-serif">
              Munnar Pre-Wedding
            </div>
          </div>
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md">
            <Image src="/demo/reception.jpg" alt="Evening candlelit wedding reception" fill className="object-cover hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 text-white text-xs font-serif">
              Candlelit Reception
            </div>
          </div>
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md">
            <Image src="/demo/rings.jpg" alt="Sacred vows and gold rings" fill className="object-cover hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 text-white text-xs font-serif">
              Sacred Matrimony
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-20 bg-stone-50/70 border-t border-stone-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-amber-800 font-bold">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 mt-2 font-normal">
              Designed for Authentic Indian Weddings
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-7 rounded-3xl bg-white border border-stone-200 shadow-xs">
              <CalendarDays className="w-8 h-8 text-amber-800 mb-4" />
              <h4 className="text-base font-bold text-stone-900 mb-1">Multi-Event Ceremonies</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Haldi, Mehendi, Church Matrimony, Muhurtham, and Grand Reception — configure individual dates, venues and dress codes.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-stone-200 shadow-xs">
              <QrCode className="w-8 h-8 text-amber-800 mb-4" />
              <h4 className="text-base font-bold text-stone-900 mb-1">Instant QR Code Generation</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Download crisp high-resolution QR codes to print directly onto physical wedding invitation cards.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-stone-200 shadow-xs">
              <Lock className="w-8 h-8 text-amber-800 mb-4" />
              <h4 className="text-base font-bold text-stone-900 mb-1">Privacy by Default</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Lock your wedding space behind a secret passcode so only invited friends and family can view your location and photos.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-stone-200 shadow-xs">
              <Smartphone className="w-8 h-8 text-amber-800 mb-4" />
              <h4 className="text-base font-bold text-stone-900 mb-1">No App Download Needed</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Guests open your custom web link instantly on any phone, smoothly responding to RSVPs in under 30 seconds.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-stone-200 shadow-xs">
              <MapPin className="w-8 h-8 text-amber-800 mb-4" />
              <h4 className="text-base font-bold text-stone-900 mb-1">Effortless Google Maps Nav</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Eliminate lost guests. A single tap launches live directions to churches, temples, or banquet convention centres.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-stone-200 shadow-xs">
              <Sparkles className="w-8 h-8 text-amber-800 mb-4" />
              <h4 className="text-base font-bold text-stone-900 mb-1">Two Bespoke Themes</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Choose between serene <em>Elegant Minimal</em> editorial typography or rich <em>Kerala Traditional</em> Kasavu gold accents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="mt-auto bg-stone-950 text-white py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <Heart className="w-8 h-8 text-amber-400 mx-auto fill-amber-400/20" />
          <h3 className="text-3xl font-serif">Begin Your Wedding Story Today</h3>
          <p className="text-stone-400 text-sm">
            Build your interactive wedding space in 5 minutes. Completely free to start.
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-semibold uppercase tracking-wider transition shadow-lg cursor-pointer"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="pt-8 border-t border-stone-800 text-[11px] text-stone-600 uppercase tracking-widest font-mono">
            © 2026 WedLink • One Private Link. Every Memory.
          </div>
        </div>
      </footer>
    </div>
  );
}
