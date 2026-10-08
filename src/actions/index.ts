"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";
import {
  hashPassword,
  verifyPassword,
  createSession,
  destroySession,
  getSession,
  setInvitationAccessCookie,
  hasInvitationAccess,
} from "@/lib/auth";
import {
  RegisterSchema,
  LoginSchema,
  InvitationBasicSchema,
  RsvpSubmitSchema,
  EventSchema,
  StoryItemSchema,
  GalleryItemSchema,
} from "@/lib/validation";
import {
  parseDateInZone,
  parseDateTimeInZone,
  DEFAULT_TIMEZONE,
} from "@/lib/datetime";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

function formatErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof ZodError) {
    const firstIssue = err.issues[0];
    return firstIssue ? firstIssue.message : "Validation failed. Please check your inputs.";
  }
  if (err instanceof Error) {
    return err.message;
  }
  return fallback;
}

export async function registerAction(formData: FormData) {
  try {
    const ip = await getClientIp();
    const limiter = await rateLimit(`register:${ip}`, 5, 15 * 60 * 1000);
    if (!limiter.allowed) {
      return {
        error: `Too many registration attempts. Please try again in ${limiter.retryAfterSeconds} seconds.`,
      };
    }

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
    return { error: formatErrorMessage(err, "Failed to register") };
  }
}

export async function loginAction(formData: FormData) {
  try {
    const ip = await getClientIp();
    const rawEmail = String(formData.get("email") || "").toLowerCase().trim();
    const limiter = await rateLimit(`login:${ip}:${rawEmail}`, 5, 15 * 60 * 1000);
    if (!limiter.allowed) {
      return {
        error: `Too many sign-in attempts. Please try again in ${limiter.retryAfterSeconds} seconds.`,
      };
    }

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
    return { error: formatErrorMessage(err, "Failed to sign in") };
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
    return { error: formatErrorMessage(err, "Failed to create invitation") };
  }
}

// Update invitation full details with transactional diff-based sync & timezone safety
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
    // Validate invitation base data with Zod
    const validatedBase = InvitationBasicSchema.partial().parse(data);

    // If slug is changing, verify uniqueness
    if (validatedBase.slug && validatedBase.slug !== inv.slug) {
      const existingSlug = await prisma.invitation.findUnique({
        where: { slug: validatedBase.slug.toLowerCase().trim() },
      });
      if (existingSlug && existingSlug.id !== invitationId) {
        return { error: "This web link (URL slug) is already taken. Please choose another." };
      }
    }

    // Password mode validation: prevent passwordless lockout
    let passwordHashUpdate = inv.passwordHash;
    if (validatedBase.privacyMode === "password") {
      if (data.invitationPassword && data.invitationPassword.trim().length > 0) {
        if (data.invitationPassword.trim().length < 4) {
          return { error: "Invitation passcode must be at least 4 characters long." };
        }
        passwordHashUpdate = await hashPassword(data.invitationPassword.trim());
      } else if (!inv.passwordHash) {
        return {
          error: "A passcode (minimum 4 characters) is required when enabling password protection.",
        };
      }
    } else if (validatedBase.privacyMode === "public") {
      passwordHashUpdate = null;
    }

    const targetTz = validatedBase.timezone || inv.timezone || DEFAULT_TIMEZONE;

    // Timezone-safe weddingDate parsing with support for clearing date
    let weddingDateUpdate: Date | null | undefined = undefined;
    if (data.weddingDate !== undefined) {
      weddingDateUpdate = data.weddingDate ? parseDateInZone(data.weddingDate, targetTz) : null;
    }

    // Validate child items schemas if provided
    if (data.events) {
      data.events.forEach((ev) => EventSchema.parse(ev));
    }
    if (data.storyItems) {
      data.storyItems.forEach((st) => StoryItemSchema.parse(st));
    }
    if (data.galleryItems) {
      data.galleryItems.forEach((g) => GalleryItemSchema.parse(g));
    }

    // Perform atomic transaction: diff-based sync so RSVPs are never orphaned
    await prisma.$transaction(async (tx) => {
      // 1. Update invitation main fields
      await tx.invitation.update({
        where: { id: invitationId },
        data: {
          brideName: validatedBase.brideName ?? inv.brideName,
          groomName: validatedBase.groomName ?? inv.groomName,
          brideFamilyName: validatedBase.brideFamilyName,
          groomFamilyName: validatedBase.groomFamilyName,
          coverMediaUrl: validatedBase.coverMediaUrl,
          bridePhotoUrl: validatedBase.bridePhotoUrl,
          groomPhotoUrl: validatedBase.groomPhotoUrl,
          description: validatedBase.description,
          ceremonyTemplate: validatedBase.ceremonyTemplate ?? inv.ceremonyTemplate,
          themeKey: validatedBase.themeKey ?? inv.themeKey,
          defaultLanguage: validatedBase.defaultLanguage ?? inv.defaultLanguage,
          slug: validatedBase.slug ? validatedBase.slug.toLowerCase().trim() : inv.slug,
          weddingDate: weddingDateUpdate !== undefined ? weddingDateUpdate : inv.weddingDate,
          weddingTime: validatedBase.weddingTime ?? inv.weddingTime,
          timezone: targetTz,
          venueName: validatedBase.venueName ?? inv.venueName,
          venueAddress: validatedBase.venueAddress ?? inv.venueAddress,
          city: validatedBase.city ?? inv.city,
          state: validatedBase.state ?? inv.state,
          country: validatedBase.country ?? inv.country,
          latitude: validatedBase.latitude,
          longitude: validatedBase.longitude,
          dressCode: validatedBase.dressCode,
          travelInfo: validatedBase.travelInfo,
          privacyMode: validatedBase.privacyMode ?? inv.privacyMode,
          passwordHash: passwordHashUpdate,
          status: validatedBase.status ?? inv.status,
          rsvpEnabled:
            validatedBase.rsvpEnabled !== undefined ? validatedBase.rsvpEnabled : inv.rsvpEnabled,
          publishedAt:
            validatedBase.status === "published" && !inv.publishedAt
              ? new Date()
              : inv.publishedAt,
        },
      });

      // 2. Diff-based synchronization for Events (PRESERVES RSVPs)
      if (data.events !== undefined) {
        const currentEvents = await tx.event.findMany({
          where: { invitationId },
          select: { id: true },
        });
        const currentEventIds = new Set(currentEvents.map((e) => e.id));

        const incomingEventsWithId = data.events.filter((e) => e.id && currentEventIds.has(e.id));
        const incomingEventsNew = data.events.filter((e) => !e.id || !currentEventIds.has(e.id));
        const incomingIds = new Set(incomingEventsWithId.map((e) => e.id as string));

        // Delete only events that the owner explicitly removed
        const eventIdsToDelete = currentEvents
          .map((e) => e.id)
          .filter((id) => !incomingIds.has(id));

        if (eventIdsToDelete.length > 0) {
          await tx.event.deleteMany({
            where: { id: { in: eventIdsToDelete }, invitationId },
          });
        }

        // Update existing events (retains primary key and keeps RSVP foreign keys intact!)
        for (const ev of incomingEventsWithId) {
          await tx.event.update({
            where: { id: ev.id! },
            data: {
              name: ev.name,
              ceremonyType: ev.ceremonyType || null,
              startAt: parseDateTimeInZone(ev.startAt, targetTz),
              endAt: parseDateTimeInZone(ev.endAt, targetTz),
              venueName: ev.venueName || null,
              venueAddress: ev.venueAddress || null,
              description: ev.description || null,
              dressCode: ev.dressCode || null,
              sortOrder: ev.sortOrder ?? 0,
            },
          });
        }

        // Insert newly added events
        for (const ev of incomingEventsNew) {
          await tx.event.create({
            data: {
              invitationId,
              name: ev.name,
              ceremonyType: ev.ceremonyType || null,
              startAt: parseDateTimeInZone(ev.startAt, targetTz),
              endAt: parseDateTimeInZone(ev.endAt, targetTz),
              venueName: ev.venueName || null,
              venueAddress: ev.venueAddress || null,
              description: ev.description || null,
              dressCode: ev.dressCode || null,
              sortOrder: ev.sortOrder ?? 0,
            },
          });
        }
      }

      // 3. Diff-based synchronization for Story Items
      if (data.storyItems !== undefined) {
        const currentStories = await tx.storyItem.findMany({
          where: { invitationId },
          select: { id: true },
        });
        const currentStoryIds = new Set(currentStories.map((s) => s.id));

        const incomingWithId = data.storyItems.filter((s) => s.id && currentStoryIds.has(s.id));
        const incomingNew = data.storyItems.filter((s) => !s.id || !currentStoryIds.has(s.id));
        const incomingIds = new Set(incomingWithId.map((s) => s.id as string));

        const storyIdsToDelete = currentStories
          .map((s) => s.id)
          .filter((id) => !incomingIds.has(id));

        if (storyIdsToDelete.length > 0) {
          await tx.storyItem.deleteMany({
            where: { id: { in: storyIdsToDelete }, invitationId },
          });
        }

        for (const st of incomingWithId) {
          await tx.storyItem.update({
            where: { id: st.id! },
            data: {
              title: st.title,
              eventDate: st.eventDate || null,
              description: st.description,
              imageUrl: st.imageUrl || null,
              sortOrder: st.sortOrder ?? 0,
            },
          });
        }

        for (const st of incomingNew) {
          await tx.storyItem.create({
            data: {
              invitationId,
              title: st.title,
              eventDate: st.eventDate || null,
              description: st.description,
              imageUrl: st.imageUrl || null,
              sortOrder: st.sortOrder ?? 0,
            },
          });
        }
      }

      // 4. Diff-based synchronization for Gallery Items
      if (data.galleryItems !== undefined) {
        const currentGalleries = await tx.galleryItem.findMany({
          where: { invitationId },
          select: { id: true },
        });
        const currentGalleryIds = new Set(currentGalleries.map((g) => g.id));

        const incomingWithId = data.galleryItems.filter(
          (g) => g.id && currentGalleryIds.has(g.id)
        );
        const incomingNew = data.galleryItems.filter(
          (g) => !g.id || !currentGalleryIds.has(g.id)
        );
        const incomingIds = new Set(incomingWithId.map((g) => g.id as string));

        const galleryIdsToDelete = currentGalleries
          .map((g) => g.id)
          .filter((id) => !incomingIds.has(id));

        if (galleryIdsToDelete.length > 0) {
          await tx.galleryItem.deleteMany({
            where: { id: { in: galleryIdsToDelete }, invitationId },
          });
        }

        for (const g of incomingWithId) {
          await tx.galleryItem.update({
            where: { id: g.id! },
            data: {
              imageUrl: g.imageUrl,
              caption: g.caption || null,
              category: g.category || "engagement",
              isFeatured: !!g.isFeatured,
              sortOrder: g.sortOrder ?? 0,
            },
          });
        }

        for (const g of incomingNew) {
          await tx.galleryItem.create({
            data: {
              invitationId,
              imageUrl: g.imageUrl,
              caption: g.caption || null,
              category: g.category || "engagement",
              isFeatured: !!g.isFeatured,
              sortOrder: g.sortOrder ?? 0,
            },
          });
        }
      }
    });

    revalidatePath(`/dashboard/invitations/${invitationId}`);
    revalidatePath(`/invite/${inv.slug}`);
    if (validatedBase.slug) revalidatePath(`/invite/${validatedBase.slug}`);

    return { success: true };
  } catch (err: unknown) {
    return { error: formatErrorMessage(err, "Failed to update invitation") };
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

// Public Password unlock action with rate limiting and fail-closed security
export async function unlockInvitationAction(invitationId: string, passwordAttempt: string) {
  try {
    const ip = await getClientIp();
    const limiter = await rateLimit(`unlock:${ip}:${invitationId}`, 5, 15 * 60 * 1000);
    if (!limiter.allowed) {
      return {
        error: `Too many passcode attempts. Please try again in ${limiter.retryAfterSeconds} seconds.`,
      };
    }

    const inv = await prisma.invitation.findUnique({
      where: { id: invitationId },
      select: { id: true, privacyMode: true, passwordHash: true },
    });

    if (!inv) {
      return { error: "Invitation not found." };
    }

    if (inv.privacyMode !== "password") {
      return { success: true };
    }

    if (!inv.passwordHash) {
      return {
        error: "This invitation has not configured a passcode yet. Please contact the couple.",
      };
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

// Public RSVP Submission action with rate limiting, access control, and event integrity verification
export async function submitRsvpAction(formData: FormData) {
  try {
    const ip = await getClientIp();
    const invitationIdStr = String(formData.get("invitationId") || "");
    const limiter = await rateLimit(`rsvp:${ip}:${invitationIdStr}`, 15, 10 * 60 * 1000);
    if (!limiter.allowed) {
      return {
        error: `Too many RSVP requests. Please try again in ${limiter.retryAfterSeconds} seconds.`,
      };
    }

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

    const inv = await prisma.invitation.findUnique({
      where: { id: parsed.invitationId },
    });

    if (!inv) {
      return { error: "Invitation not found." };
    }

    if (!inv.rsvpEnabled) {
      return { error: "RSVP is currently closed for this celebration." };
    }

    // Access control: prevent draft RSVPs from unauthenticated users
    const session = await getSession();
    const isOwner = session?.userId === inv.ownerId;

    if (inv.status === "draft" && !isOwner) {
      return {
        error: "This celebration is currently in draft mode and not accepting public RSVPs.",
      };
    }

    // Access control: prevent RSVP if password-protected and user has not passed gate
    if (inv.privacyMode === "password" && !isOwner) {
      const hasAccess = await hasInvitationAccess(inv.id);
      if (!hasAccess) {
        return {
          error: "Passcode verification is required before submitting an RSVP.",
        };
      }
    }

    // Integrity check: verify that eventId actually belongs to this invitation
    if (parsed.eventId) {
      const eventBelongs = await prisma.event.findFirst({
        where: { id: parsed.eventId, invitationId: inv.id },
      });
      if (!eventBelongs) {
        return { error: "The selected event does not belong to this celebration." };
      }
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
    return { error: formatErrorMessage(err, "Failed to record RSVP response") };
  }
}
