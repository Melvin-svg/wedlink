import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import {
  Plus,
  Eye,
  Settings,
  Calendar,
  Users,
  QrCode,
  Share2,
  Sparkles,
  Lock,
  Globe,
  Clock,
  ArrowRight,
  TrendingUp,
  HeartHandshake,
  ExternalLink,
} from "lucide-react";

export const metadata = {
  title: "Creator Dashboard | WedLink",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const invitations = await prisma.invitation.findMany({
    where: { ownerId: user.id },
    include: {
      rsvps: true,
      events: true,
      galleryItems: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculate aggregated stats across user's invitations
  const totalRsvps = invitations.reduce((sum, inv) => sum + inv.rsvps.length, 0);
  const totalAttending = invitations.reduce(
    (sum, inv) =>
      sum +
      inv.rsvps
        .filter((r) => r.status === "accepted")
        .reduce((gSum, r) => gSum + r.guestCount, 0),
    0
  );
  const totalDeclined = invitations.reduce(
    (sum, inv) => sum + inv.rsvps.filter((r) => r.status === "declined").length,
    0
  );

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs uppercase tracking-[0.2em] text-stone-500 font-semibold">
                Creator Workspace • {user.email}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif text-stone-900">
              Welcome back, {user.name}
            </h1>
          </div>

          <Link
            href="/dashboard/invitations/new"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-widest shadow-lg transition transform hover:-translate-y-0.5 cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Wedding Space</span>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs uppercase tracking-wider font-bold">
                Wedding Spaces
              </span>
              <Sparkles className="w-4 h-4 text-amber-700" />
            </div>
            <div className="text-4xl font-serif font-bold text-stone-900">
              {invitations.length}
            </div>
            <p className="text-xs text-stone-500 mt-1">Active invitations &amp; drafts</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs uppercase tracking-wider font-bold">
                Confirmed Attending
              </span>
              <HeartHandshake className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-4xl font-serif font-bold text-emerald-800">
              {totalAttending}
            </div>
            <p className="text-xs text-stone-500 mt-1">Total guests celebrating with you</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs uppercase tracking-wider font-bold">
                Total RSVP Responses
              </span>
              <Users className="w-4 h-4 text-amber-800" />
            </div>
            <div className="text-4xl font-serif font-bold text-stone-900">
              {totalRsvps}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {totalDeclined} declined • {totalRsvps - totalDeclined} positive
            </p>
          </div>
        </div>

        {/* Invitations List Section */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold text-stone-900">
            Your Wedding Celebrations
          </h2>
          <span className="text-xs text-stone-500">{invitations.length} spaces created</span>
        </div>

        {invitations.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-stone-300 rounded-3xl p-12 text-center max-w-2xl mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-serif text-stone-900">No wedding spaces yet</h2>
            <p className="text-stone-600 text-sm mt-2 max-w-md mx-auto">
              Get started by creating your first celebration space with couple details, multi-event schedules, and interactive RSVPs.
            </p>
            <div className="mt-6">
              <Link
                href="/dashboard/invitations/new"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider transition shadow-md"
              >
                <Plus className="w-4 h-4" /> Create First Wedding Space
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invitations.map((inv) => {
              const acceptedCount = inv.rsvps
                .filter((r) => r.status === "accepted")
                .reduce((sum, r) => sum + r.guestCount, 0);

              const coverImg = inv.coverMediaUrl || "/demo/hero-couple.jpg";

              return (
                <div
                  key={inv.id}
                  className="bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Card Visual Header with Cover Photo */}
                  <div className="relative h-44 w-full bg-stone-200 overflow-hidden">
                    <Image
                      src={coverImg}
                      alt={`${inv.brideName} & ${inv.groomName}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Top status pills */}
                    <div className="absolute top-4 inset-x-4 flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-xs ${
                          inv.status === "published"
                            ? "bg-emerald-600/90 text-white"
                            : "bg-amber-600/90 text-white"
                        }`}
                      >
                        {inv.status === "published" ? (
                          <>
                            <Globe className="w-3 h-3" /> Live
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" /> Draft
                          </>
                        )}
                      </span>

                      <span className="text-[10px] uppercase font-bold text-white/90 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
                        {inv.privacyMode === "password" ? (
                          <>
                            <Lock className="w-3 h-3 text-amber-300" /> Passcode Protected
                          </>
                        ) : (
                          <>
                            <Globe className="w-3 h-3 text-stone-300" /> Public Link
                          </>
                        )}
                      </span>
                    </div>

                    {/* Names over cover image */}
                    <div className="absolute bottom-4 inset-x-4 text-white">
                      <h3 className="text-2xl font-serif font-bold text-white leading-tight drop-shadow-sm">
                        {inv.brideName} &amp; {inv.groomName}
                      </h3>
                      <p className="text-[11px] text-stone-200 uppercase tracking-widest mt-0.5">
                        {inv.themeKey === "kerala-traditional" ? "Kerala Traditional (കേരളം)" : "Elegant Minimal"}
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-2 text-xs text-stone-600">
                      <p className="flex items-center gap-2 font-medium">
                        <Calendar className="w-4 h-4 text-amber-800 shrink-0" />
                        {inv.weddingDate
                          ? new Date(inv.weddingDate).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Wedding date pending"}
                      </p>
                      {inv.venueName && (
                        <p className="flex items-center gap-2 text-stone-500 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-700 shrink-0" />
                          <span className="truncate">{inv.venueName}, {inv.city || "Kerala"}</span>
                        </p>
                      )}
                    </div>

                    {/* RSVP miniature stats bar */}
                    <div className="mt-5 p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-stone-500 block text-[10px] uppercase tracking-wider font-bold">
                          Confirmed Attending
                        </span>
                        <span className="text-base font-bold text-emerald-800">
                          {acceptedCount} guests
                        </span>
                      </div>
                      <Link
                        href={`/dashboard/invitations/${inv.id}/rsvps`}
                        className="text-xs font-semibold text-amber-800 hover:text-amber-950 underline flex items-center gap-1"
                      >
                        View Tracker <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                  {/* Action bottom toolbar */}
                  <div className="p-4 bg-stone-50/90 border-t border-stone-100 flex items-center justify-between gap-2 text-xs">
                    <Link
                      href={`/invite/${inv.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-stone-700 hover:text-stone-950 font-semibold px-3 py-1.5 rounded-xl hover:bg-stone-200/70 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </Link>

                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/dashboard/invitations/${inv.id}/share`}
                        className="p-2 rounded-xl text-stone-600 hover:text-stone-950 hover:bg-stone-200/70 transition"
                        title="Download QR & WhatsApp Share"
                      >
                        <QrCode className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/dashboard/invitations/${inv.id}/edit`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition shadow-sm"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>Edit Builder</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
