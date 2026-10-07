import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const InvitationBasicSchema = z.object({
  brideName: z.string().min(1, "Bride's name is required"),
  groomName: z.string().min(1, "Groom's name is required"),
  brideFamilyName: z.string().optional().nullable(),
  groomFamilyName: z.string().optional().nullable(),
  coverMediaUrl: z.string().optional().nullable(),
  bridePhotoUrl: z.string().optional().nullable(),
  groomPhotoUrl: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  ceremonyTemplate: z.string().default("christian"),
  themeKey: z.string().default("elegant-minimal"),
  defaultLanguage: z.string().default("en"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  weddingDate: z.string().optional().nullable(),
  weddingTime: z.string().optional().nullable(),
  timezone: z.string().default("Asia/Kolkata"),
  venueName: z.string().optional().nullable(),
  venueAddress: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().default("India"),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  dressCode: z.string().optional().nullable(),
  travelInfo: z.string().optional().nullable(),
  privacyMode: z.enum(["public", "password"]).default("public"),
  invitationPassword: z.string().optional().nullable(),
  status: z.enum(["draft", "published"]).default("draft"),
  rsvpEnabled: z.boolean().default(true),
});

export const EventSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Event name is required"),
  ceremonyType: z.string().optional().nullable(),
  startAt: z.string().optional().nullable(),
  endAt: z.string().optional().nullable(),
  venueName: z.string().optional().nullable(),
  venueAddress: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  dressCode: z.string().optional().nullable(),
  sortOrder: z.number().default(0),
});

export const StoryItemSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  eventDate: z.string().optional().nullable(),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().optional().nullable(),
  sortOrder: z.number().default(0),
});

export const GalleryItemSchema = z.object({
  id: z.string().optional(),
  imageUrl: z.string().url("Valid image URL required"),
  caption: z.string().optional().nullable(),
  category: z.string().default("engagement"),
  sortOrder: z.number().default(0),
  isFeatured: z.boolean().default(false),
});

export const RsvpSubmitSchema = z.object({
  invitationId: z.string(),
  eventId: z.string().optional().nullable(),
  guestName: z.string().min(2, "Name must be at least 2 characters"),
  guestEmail: z.string().email().optional().or(z.literal("")),
  guestPhone: z.string().optional().nullable(),
  status: z.enum(["accepted", "declined", "maybe"]),
  guestCount: z.coerce.number().min(1).max(20).default(1),
  mealPreference: z.string().optional().nullable(),
  message: z.string().max(1000).optional().nullable(),
});
