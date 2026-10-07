import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { hasInvitationAccess, getSession } from "@/lib/auth";
import { getInvitationBaseUrl } from "@/lib/url";
import { ThemeRenderer } from "@/components/themes/ThemeRenderer";
import { PasswordGate } from "@/components/invitation/PasswordGate";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const invitation = await prisma.invitation.findUnique({
    where: { slug },
    select: { brideName: true, groomName: true, description: true, weddingDate: true },
  });

  if (!invitation) return { title: "Invitation Not Found | WedLink" };

  return {
    title: `${invitation.brideName} & ${invitation.groomName} — Wedding Invitation | WedLink`,
    description:
      invitation.description ||
      `You are cordially invited to celebrate the wedding of ${invitation.brideName} and ${invitation.groomName}.`,
    openGraph: {
      title: `${invitation.brideName} & ${invitation.groomName}'s Wedding`,
      description: `View celebration details, events, schedule and RSVP online.`,
    },
  };
}

export default async function PublicInvitationPage({ params }: PageProps) {
  const { slug } = await params;

  const invitation = await prisma.invitation.findUnique({
    where: { slug },
    include: {
      events: {
        where: { isVisible: true },
        orderBy: { sortOrder: "asc" },
      },
      storyItems: {
        where: { isVisible: true },
        orderBy: { sortOrder: "asc" },
      },
      galleryItems: {
        where: { isVisible: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!invitation) {
    notFound();
  }

  // Check draft status: only owner can view if draft
  const session = await getSession();
  const isOwner = session?.userId === invitation.ownerId;

  if (invitation.status === "draft" && !isOwner) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-100 flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-stone-800 p-8 rounded-3xl border border-stone-700">
          <h2 className="text-2xl font-serif text-white mb-2">Invitation Under Preparation</h2>
          <p className="text-stone-400 text-sm">
            This wedding space is currently in draft mode and will be made available once the couple publishes it.
          </p>
        </div>
      </div>
    );
  }

  // Check password gate
  if (invitation.privacyMode === "password" && !isOwner) {
    const hasAccess = await hasInvitationAccess(invitation.id);
    if (!hasAccess) {
      return (
        <PasswordGate
          invitationId={invitation.id}
          brideName={invitation.brideName}
          groomName={invitation.groomName}
        />
      );
    }
  }

  const baseUrl = await getInvitationBaseUrl();

  return (
    <ThemeRenderer
      themeKey={invitation.themeKey}
      invitation={{
        ...invitation,
        baseUrl,
        events: invitation.events,
        storyItems: invitation.storyItems,
        galleryItems: invitation.galleryItems,
      }}
    />
  );
}
