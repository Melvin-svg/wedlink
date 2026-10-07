import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { generateQrDataUrl } from "@/lib/qr";
import { getInvitationBaseUrl } from "@/lib/url";
import { Navbar } from "@/components/Navbar";
import { ShareSheet } from "@/components/invitation/ShareSheet";
import {
  ArrowLeft,
  QrCode,
  Download,
  Share2,
  ExternalLink,
  Shield,
  Globe,
  Sparkles,
} from "lucide-react";

interface SharePageProps {
  params: Promise<{ id: string }>;
}

export default async function InvitationSharePage({ params }: SharePageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const invitation = await prisma.invitation.findFirst({
    where: { id, ownerId: user.id },
  });

  if (!invitation) notFound();

  const baseUrl = await getInvitationBaseUrl();
  const publicUrl = `${baseUrl}/invite/${invitation.slug}`;
  const qrDataUrl = await generateQrDataUrl(publicUrl);
  const coupleTitle = `${invitation.brideName} & ${invitation.groomName}`;

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-serif font-bold text-stone-900">
            QR Code &amp; WhatsApp Sharing
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Print this QR code onto physical wedding cards or share directly across WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* QR Code Presentation Box */}
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm flex flex-col items-center text-center">
            <span className="text-xs uppercase tracking-widest text-amber-800 font-bold mb-4">
              High Resolution Print QR
            </span>

            <div className="relative w-64 h-64 p-4 rounded-2xl border-2 border-stone-100 shadow-inner bg-white flex items-center justify-center">
              <Image
                src={qrDataUrl}
                alt="Wedding Invitation QR Code"
                width={250}
                height={250}
                className="rounded-lg object-contain"
                priority
              />
            </div>

            <span className="text-xs font-serif font-bold text-stone-900 mt-4">
              {coupleTitle}
            </span>
            <span className="text-[11px] font-mono text-stone-400 mt-0.5">
              wedlink.app/invite/{invitation.slug}
            </span>

            <div className="mt-6 w-full">
              <a
                href={qrDataUrl}
                download={`${invitation.slug}-qr-code.png`}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider transition shadow-sm"
              >
                <Download className="w-4 h-4" /> Download QR Code (PNG)
              </a>
            </div>
          </div>

          {/* WhatsApp & Link Sharing Settings */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <h2 className="text-lg font-serif font-bold text-stone-900">
                Direct WhatsApp Forwarding
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                Click below to test the automated invitation message with wedding schedule, directions, and RSVP link pre-formatted for WhatsApp.
              </p>

              <ShareSheet
                slug={invitation.slug}
                coupleTitle={coupleTitle}
                initialBaseUrl={baseUrl}
              />
            </div>

            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-3 text-xs">
              <h2 className="text-base font-serif font-bold text-stone-900">
                Invitation Status &amp; Link
              </h2>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="block font-semibold text-stone-700">Public Address:</span>
                  <span className="font-mono text-stone-500 break-all">{publicUrl}</span>
                </div>
                <Link
                  href={`/invite/${invitation.slug}`}
                  target="_blank"
                  className="p-2 text-stone-500 hover:text-stone-900"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

              <div className="pt-2 text-stone-500 flex items-center gap-2">
                {invitation.privacyMode === "password" ? (
                  <>
                    <Shield className="w-4 h-4 text-amber-700" />
                    <span>Protected with wedding passcode.</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <span>Public access enabled. Anyone with link can view.</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
