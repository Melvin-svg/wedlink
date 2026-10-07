import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { InvitationBuilder } from "@/components/builder/InvitationBuilder";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditInvitationPage({ params }: EditPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const invitation = await prisma.invitation.findFirst({
    where: { id, ownerId: user.id },
    include: {
      events: { orderBy: { sortOrder: "asc" } },
      storyItems: { orderBy: { sortOrder: "asc" } },
      galleryItems: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!invitation) notFound();

  return <InvitationBuilder initialData={invitation} />;
}
