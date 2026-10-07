"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  hashPassword,
  verifyPassword,
  createSession,
  destroySession,
  getSession,
  getCurrentUser,
  setInvitationAccessCookie,
} from "@/lib/auth";
import {
  RegisterSchema,
  LoginSchema,
  InvitationBasicSchema,
  RsvpSubmitSchema,
} from "@/lib/validation";

export async function registerAction(formData: FormData) {
  try {
    const data = RegisterSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existing) {
      return { error: "An account with this email already exists." };
    }

    const passwordHash = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        passwordHash,
      },
    });

    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to register";
    return { error: message };
  }
}

export async function loginAction(formData: FormData) {
  try {
    const data = LoginSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (!user) {
      return { error: "Invalid email or password." };
    }

    const isValid = await verifyPassword(data.password, user.passwordHash);
    if (!isValid) {
      return { error: "Invalid email or password." };
    }

    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to sign in";
    return { error: message };
  }
}

export async function logoutAction() {
  await destroySession();
  return { success: true };
}

// Create new invitation draft
export async function createInvitationAction(ceremonyTemplate = "christian") {
  const session = await getSession();
  if (!session?.userId) {
    return { error: "Unauthorized. Please log in." };
  }

  try {
    const defaultSlug = `wedding-${Date.now().toString(36)}`;
    
    // Ceremony template defaults
    let initialEvents: { name: string; ceremonyType: string; sortOrder: number; description: string }[] = [];
    if (ceremonyTemplate === "christian") {
      initialEvents = [
        { name: "Holy Matrimony", ceremonyType: "Church Wedding", sortOrder: 0, description: "Solemn wedding ceremony and blessing at church" },
        { name: "Wedding Reception", ceremonyType: "Reception", sortOrder: 1, description: "Celebratory dinner, toasts, cake cutting, and music" },
      ];
    } else if (ceremonyTemplate === "hindu") {
      initialEvents = [
        { name: "Mehendi & Sangeet", ceremonyType: "Mehendi", sortOrder: 0, description: "Music, henna art, and family celebration" },
        { name: "Muhurtham Ceremony", ceremonyType: "Muhurtham", sortOrder: 1, description: "Traditional wedding rituals and blessings" },
        { name: "Grand Reception", ceremonyType: "Reception", sortOrder: 2, description: "Dinner and blessings with family and friends" },
      ];
    } else if (ceremonyTemplate === "nikah") {
      initialEvents = [
        { name: "Nikah Ceremony", ceremonyType: "Nikah", sortOrder: 0, description: "Sacred Islamic marriage contract and prayers" },
        { name: "Walima Feast", ceremonyType: "Reception", sortOrder: 1, description: "Joyous reception and traditional wedding feast" },
      ];
    } else {
      initialEvents = [
        { name: "Wedding Ceremony", ceremonyType: "Ceremony", sortOrder: 0, description: "Exchange of vows and celebration" },
        { name: "Celebration Party", ceremonyType: "Reception", sortOrder: 1, description: "Dinner, dancing, and memories" },
      ];
    }

    const invitation = await prisma.invitation.create({
      data: {
        ownerId: session.userId,
        slug: defaultSlug,
        brideName: "Bride",
        groomName: "Groom",
        ceremonyTemplate,
        themeKey: ceremonyTemplate === "hindu" ? "kerala-traditional" : "elegant-minimal",
        status: "draft",
        events: {
          create: initialEvents,
        },
      },
    });

    return { success: true, invitationId: invitation.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create invitation";
    return { error: message };
  }
}

// Update invitation full details
export async function updateInvitationAction(
  invitationId: string,
  data: Partial<ReturnType<typeof InvitationBasicSchema.parse>> & {
    events?: Array<{
      id?: string;
      name: string;
      ceremonyType?: string | null;
      startAt?: string | null;
      endAt?: string | null;
      venueName?: string | null;
      venueAddress?: string | null;
      description?: string | null;
      dressCode?: string | null;
      sortOrder?: number;
    }>;
    storyItems?: Array<{
      id?: string;
      title: string;
      eventDate?: string | null;
      description: string;
      imageUrl?: string | null;
      sortOrder?: number;
    }>;
    galleryItems?: Array<{
      id?: string;
      imageUrl: string;
      caption?: string | null;
      category?: string | null;
      isFeatured?: boolean;
      sortOrder?: number;
    }>;
  }
) {
  const session = await getSession();
  if (!session?.userId) {
    return { error: "Unauthorized" };
  }

  // Ensure owner owns the invitation
  const inv = await prisma.invitation.findFirst({
    where: { id: invitationId, ownerId: session.userId },
  });
  if (!inv) {
    return { error: "Invitation not found or permission denied" };
  }

  try {
    // If slug is changing, verify uniqueness
    if (data.slug && data.slug !== inv.slug) {
      const existingSlug = await prisma.invitation.findUnique({
        where: { slug: data.slug.toLowerCase().trim() },
      });
      if (existingSlug && existingSlug.id !== invitationId) {
        return { error: "This web link (URL slug) is already taken. Please choose another." };
      }
    }

    let passwordHashUpdate = inv.passwordHash;
    if (data.privacyMode === "password" && data.invitationPassword) {
      passwordHashUpdate = await hashPassword(data.invitationPassword);
    } else if (data.privacyMode === "public") {
      passwordHashUpdate = null;
    }

    await prisma.invitation.update({
      where: { id: invitationId },
      data: {
        brideName: data.brideName ?? inv.brideName,
        groomName: data.groomName ?? inv.groomName,
        brideFamilyName: data.brideFamilyName,
        groomFamilyName: data.groomFamilyName,
        coverMediaUrl: data.coverMediaUrl,
        bridePhotoUrl: data.bridePhotoUrl,
        groomPhotoUrl: data.groomPhotoUrl,
        description: data.description,
        ceremonyTemplate: data.ceremonyTemplate ?? inv.ceremonyTemplate,
        themeKey: data.themeKey ?? inv.themeKey,
        defaultLanguage: data.defaultLanguage ?? inv.defaultLanguage,
        slug: data.slug ? data.slug.toLowerCase().trim() : inv.slug,
        weddingDate: data.weddingDate ? new Date(data.weddingDate) : inv.weddingDate,
        weddingTime: data.weddingTime ?? inv.weddingTime,
        timezone: data.timezone ?? inv.timezone,
        venueName: data.venueName ?? inv.venueName,
        venueAddress: data.venueAddress ?? inv.venueAddress,
        city: data.city ?? inv.city,
        state: data.state ?? inv.state,
        country: data.country ?? inv.country,
        latitude: data.latitude,
        longitude: data.longitude,
        dressCode: data.dressCode,
        travelInfo: data.travelInfo,
        privacyMode: data.privacyMode ?? inv.privacyMode,
        passwordHash: passwordHashUpdate,
        status: data.status ?? inv.status,
        rsvpEnabled: data.rsvpEnabled !== undefined ? data.rsvpEnabled : inv.rsvpEnabled,
        publishedAt: data.status === "published" && !inv.publishedAt ? new Date() : inv.publishedAt,
      },
    });

    // Update events if provided
    if (data.events) {
      // Delete existing and recreate for atomic simplicity
      await prisma.event.deleteMany({ where: { invitationId } });
      if (data.events.length > 0) {
        await prisma.event.createMany({
          data: data.events.map((ev, index) => ({
            invitationId,
            name: ev.name,
            ceremonyType: ev.ceremonyType || null,
            startAt: ev.startAt ? new Date(ev.startAt) : null,
            endAt: ev.endAt ? new Date(ev.endAt) : null,
            venueName: ev.venueName || null,
            venueAddress: ev.venueAddress || null,
            description: ev.description || null,
            dressCode: ev.dressCode || null,
            sortOrder: ev.sortOrder ?? index,
          })),
        });
      }
    }

    // Update story items if provided
    if (data.storyItems) {
      await prisma.storyItem.deleteMany({ where: { invitationId } });
      if (data.storyItems.length > 0) {
        await prisma.storyItem.createMany({
          data: data.storyItems.map((st, index) => ({
            invitationId,
            title: st.title,
            eventDate: st.eventDate || null,
            description: st.description,
            imageUrl: st.imageUrl || null,
            sortOrder: st.sortOrder ?? index,
          })),
        });
      }
    }

    // Update gallery items if provided
    if (data.galleryItems) {
      await prisma.galleryItem.deleteMany({ where: { invitationId } });
      if (data.galleryItems.length > 0) {
        await prisma.galleryItem.createMany({
          data: data.galleryItems.map((g, index) => ({
            invitationId,
            imageUrl: g.imageUrl,
            caption: g.caption || null,
            category: g.category || "engagement",
            isFeatured: !!g.isFeatured,
            sortOrder: g.sortOrder ?? index,
          })),
        });
      }
    }

    revalidatePath(`/dashboard/invitations/${invitationId}`);
    revalidatePath(`/invite/${inv.slug}`);
    if (data.slug) revalidatePath(`/invite/${data.slug}`);

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update invitation";
    return { error: message };
  }
}

// Toggle publish status
export async function togglePublishAction(invitationId: string, publish: boolean) {
  const session = await getSession();
  if (!session?.userId) return { error: "Unauthorized" };

  const inv = await prisma.invitation.findFirst({
    where: { id: invitationId, ownerId: session.userId },
  });
  if (!inv) return { error: "Invitation not found" };

  await prisma.invitation.update({
    where: { id: invitationId },
    data: {
      status: publish ? "published" : "draft",
      publishedAt: publish && !inv.publishedAt ? new Date() : inv.publishedAt,
    },
  });

  revalidatePath(`/dashboard/invitations/${invitationId}`);
  revalidatePath(`/invite/${inv.slug}`);
  return { success: true, status: publish ? "published" : "draft" };
}

// Delete invitation
export async function deleteInvitationAction(invitationId: string) {
  const session = await getSession();
  if (!session?.userId) return { error: "Unauthorized" };

  await prisma.invitation.deleteMany({
    where: { id: invitationId, ownerId: session.userId },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

// Public Password unlock action
export async function unlockInvitationAction(invitationId: string, passwordAttempt: string) {
  try {
    const inv = await prisma.invitation.findUnique({
      where: { id: invitationId },
      select: { id: true, privacyMode: true, passwordHash: true },
    });

    if (!inv || inv.privacyMode !== "password" || !inv.passwordHash) {
      return { success: true };
    }

    const matches = await verifyPassword(passwordAttempt, inv.passwordHash);
    if (!matches) {
      return { error: "Incorrect wedding passcode. Please try again." };
    }

    await setInvitationAccessCookie(inv.id);
    return { success: true };
  } catch {
    return { error: "Failed to verify passcode." };
  }
}

// Public RSVP Submission action
export async function submitRsvpAction(formData: FormData) {
  try {
    const parsed = RsvpSubmitSchema.parse({
      invitationId: formData.get("invitationId"),
      eventId: formData.get("eventId") || null,
      guestName: formData.get("guestName"),
      guestEmail: formData.get("guestEmail") || undefined,
      guestPhone: formData.get("guestPhone") || null,
      status: formData.get("status"),
      guestCount: formData.get("guestCount"),
      mealPreference: formData.get("mealPreference") || null,
      message: formData.get("message") || null,
    });

    // Check invitation allows RSVP
    const inv = await prisma.invitation.findUnique({
      where: { id: parsed.invitationId },
    });

    if (!inv || !inv.rsvpEnabled) {
      return { error: "RSVP is currently closed for this celebration." };
    }

    const rsvp = await prisma.rsvp.create({
      data: {
        invitationId: parsed.invitationId,
        eventId: parsed.eventId || null,
        guestName: parsed.guestName.trim(),
        guestEmail: parsed.guestEmail ? parsed.guestEmail.trim().toLowerCase() : null,
        guestPhone: parsed.guestPhone ? parsed.guestPhone.trim() : null,
        status: parsed.status,
        guestCount: parsed.status === "declined" ? 0 : parsed.guestCount,
        mealPreference: parsed.mealPreference,
        message: parsed.message ? parsed.message.trim() : null,
      },
    });

    revalidatePath(`/invite/${inv.slug}`);
    revalidatePath(`/dashboard/invitations/${inv.id}`);
    revalidatePath(`/dashboard/invitations/${inv.id}/rsvps`);

    return { success: true, rsvpId: rsvp.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to record RSVP response";
    return { error: message };
  }
}
