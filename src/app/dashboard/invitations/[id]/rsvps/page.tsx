import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import {
  ArrowLeft,
  Download,
  Users,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Mail,
  Phone,
  MessageSquare,
  Clock,
} from "lucide-react";

interface RsvpsPageProps {
  params: Promise<{ id: string }>;
}

export default async function InvitationRsvpsPage({ params }: RsvpsPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const invitation = await prisma.invitation.findFirst({
    where: { id, ownerId: user.id },
    include: {
      rsvps: {
        include: { event: true },
        orderBy: { respondedAt: "desc" },
      },
    },
  });

  if (!invitation) notFound();

  const total = invitation.rsvps.length;
  const accepted = invitation.rsvps.filter((r) => r.status === "accepted");
  const declined = invitation.rsvps.filter((r) => r.status === "declined");
  const maybe = invitation.rsvps.filter((r) => r.status === "maybe");

  const totalHeadcount = accepted.reduce((sum, r) => sum + r.guestCount, 0);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {/* Header navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link
              href={`/dashboard`}
              className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 transition mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-serif font-bold text-stone-900">
              RSVP Guest Tracker
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              {invitation.brideName} &amp; {invitation.groomName} (&ldquo;{invitation.slug}&rdquo;)
            </p>
          </div>

          <a
            href={`/api/invitations/${invitation.id}/rsvps/export`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider shadow-sm transition self-start sm:self-auto"
          >
            <Download className="w-4 h-4" /> Export CSV Spreadsheet
          </a>
        </div>

        {/* RSVP KPI metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Confirmed Guests
            </span>
            <div className="text-3xl font-serif font-bold text-emerald-700 mt-1">
              {totalHeadcount}
            </div>
            <span className="text-[11px] text-stone-400">Total attending head count</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Accepted Responses
            </span>
            <div className="text-3xl font-serif font-bold text-stone-900 mt-1">
              {accepted.length}
            </div>
            <span className="text-[11px] text-stone-400">Parties / households</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Declined
            </span>
            <div className="text-3xl font-serif font-bold text-stone-600 mt-1">
              {declined.length}
            </div>
            <span className="text-[11px] text-stone-400">Unable to attend</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Maybe / Unsure
            </span>
            <div className="text-3xl font-serif font-bold text-amber-700 mt-1">
              {maybe.length}
            </div>
            <span className="text-[11px] text-stone-400">Awaiting confirmation</span>
          </div>
        </div>

        {/* RSVP Responses Table */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-stone-200 flex items-center justify-between">
            <h2 className="text-lg font-serif font-bold text-stone-900">Guest Responses</h2>
            <span className="text-xs text-stone-500">{total} total submissions</span>
          </div>

          {invitation.rsvps.length === 0 ? (
            <div className="p-12 text-center text-stone-500 text-xs">
              No RSVPs recorded yet. Once guests open your invitation link and confirm their attendance, their details will appear here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-bold tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Guest Name</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Attending Count</th>
                    <th className="py-3 px-4">Meal Preference</th>
                    <th className="py-3 px-4">Event</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Wishes</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {invitation.rsvps.map((rsvp) => (
                    <tr key={rsvp.id} className="hover:bg-stone-50/60 transition">
                      <td className="py-3.5 px-4 font-semibold text-stone-900">
                        {rsvp.guestName}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            rsvp.status === "accepted"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : rsvp.status === "declined"
                              ? "bg-stone-100 text-stone-600 border border-stone-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {rsvp.status === "accepted" ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> Attending
                            </>
                          ) : rsvp.status === "declined" ? (
                            <>
                              <XCircle className="w-3 h-3" /> Declined
                            </>
                          ) : (
                            <>
                              <HelpCircle className="w-3 h-3" /> Maybe
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium">
                        {rsvp.status === "declined" ? 0 : rsvp.guestCount}
                      </td>
                      <td className="py-3.5 px-4 text-stone-600">
                        {rsvp.mealPreference || "—"}
                      </td>
                      <td className="py-3.5 px-4 text-stone-600">
                        {rsvp.event?.name || "All Events"}
                      </td>
                      <td className="py-3.5 px-4 text-stone-500">
                        {rsvp.guestEmail && (
                          <span className="block truncate max-w-[130px]">{rsvp.guestEmail}</span>
                        )}
                        {rsvp.guestPhone && (
                          <span className="block text-[11px] font-mono text-stone-400">
                            {rsvp.guestPhone}
                          </span>
                        )}
                        {!rsvp.guestEmail && !rsvp.guestPhone && "—"}
                      </td>
                      <td className="py-3.5 px-4 text-stone-600 max-w-xs truncate">
                        {rsvp.message ? `"${rsvp.message}"` : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-stone-400 font-mono text-[11px]">
                        {new Date(rsvp.respondedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
