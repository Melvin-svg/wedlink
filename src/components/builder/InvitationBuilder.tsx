"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateInvitationAction, togglePublishAction } from "@/actions";
import {
  Heart,
  Calendar,
  Clock,
  MapPin,
  Image as ImageIcon,
  BookOpen,
  Palette,
  Shield,
  Eye,
  Check,
  Plus,
  Trash2,
  Upload,
  Globe,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

interface InvitationBuilderProps {
  initialData: {
    id: string;
    slug: string;
    brideName: string;
    groomName: string;
    brideFamilyName?: string | null;
    groomFamilyName?: string | null;
    coverMediaUrl?: string | null;
    bridePhotoUrl?: string | null;
    groomPhotoUrl?: string | null;
    description?: string | null;
    ceremonyTemplate: string;
    themeKey: string;
    defaultLanguage: string;
    status: string;
    privacyMode: string;
    rsvpEnabled: boolean;
    weddingDate?: string | Date | null;
    weddingTime?: string | null;
    timezone: string;
    venueName?: string | null;
    venueAddress?: string | null;
    city?: string | null;
    state?: string | null;
    country: string;
    dressCode?: string | null;
    travelInfo?: string | null;
    events: Array<{
      id?: string;
      name: string;
      ceremonyType?: string | null;
      startAt?: string | Date | null;
      endAt?: string | Date | null;
      venueName?: string | null;
      venueAddress?: string | null;
      description?: string | null;
      dressCode?: string | null;
      sortOrder: number;
    }>;
    storyItems: Array<{
      id?: string;
      title: string;
      eventDate?: string | null;
      description: string;
      imageUrl?: string | null;
      sortOrder: number;
    }>;
    galleryItems: Array<{
      id?: string;
      imageUrl: string;
      caption?: string | null;
      category?: string | null;
      isFeatured?: boolean;
      sortOrder: number;
    }>;
  };
}

export function InvitationBuilder({ initialData }: InvitationBuilderProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Builder form state
  const [form, setForm] = useState({
    ...initialData,
    weddingDate: initialData.weddingDate
      ? new Date(initialData.weddingDate).toISOString().split("T")[0]
      : "",
    invitationPassword: "",
    events: initialData.events.map((e) => ({
      ...e,
      startAt: e.startAt ? new Date(e.startAt).toISOString().slice(0, 16) : "",
      endAt: e.endAt ? new Date(e.endAt).toISOString().slice(0, 16) : "",
    })),
    storyItems: initialData.storyItems,
    galleryItems: initialData.galleryItems,
  });

  const steps = [
    { number: 1, title: "Couple Details", icon: Heart },
    { number: 2, title: "Wedding Date & Venue", icon: Calendar },
    { number: 3, title: "Events Schedule", icon: Clock },
    { number: 4, title: "Photo Gallery", icon: ImageIcon },
    { number: 5, title: "Story Timeline", icon: BookOpen },
    { number: 6, title: "Theme Style", icon: Palette },
    { number: 7, title: "Privacy & URL", icon: Shield },
    { number: 8, title: "Preview & Publish", icon: Eye },
  ];

  const handleFieldChange = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Upload handler to /api/upload
  const handleFileUpload = async (file: File): Promise<string | null> => {
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      return data.url;
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to upload file");
      return null;
    }
  };

  // Save changes via Server Action
  const saveChanges = async () => {
    setSaving(true);
    setErrorMessage("");
    setSaveSuccess(false);

    const res = await updateInvitationAction(initialData.id, {
      brideName: form.brideName,
      groomName: form.groomName,
      brideFamilyName: form.brideFamilyName,
      groomFamilyName: form.groomFamilyName,
      coverMediaUrl: form.coverMediaUrl,
      bridePhotoUrl: form.bridePhotoUrl,
      groomPhotoUrl: form.groomPhotoUrl,
      description: form.description,
      ceremonyTemplate: form.ceremonyTemplate,
      themeKey: form.themeKey,
      defaultLanguage: form.defaultLanguage,
      slug: form.slug,
      weddingDate: form.weddingDate || null,
      weddingTime: form.weddingTime,
      timezone: form.timezone,
      venueName: form.venueName,
      venueAddress: form.venueAddress,
      city: form.city,
      state: form.state,
      country: form.country,
      dressCode: form.dressCode,
      travelInfo: form.travelInfo,
      privacyMode: form.privacyMode as "public" | "password",
      invitationPassword: form.invitationPassword || undefined,
      status: form.status as "draft" | "published",
      rsvpEnabled: form.rsvpEnabled,
      events: form.events.map((e, idx) => ({
        name: e.name,
        ceremonyType: e.ceremonyType,
        startAt: e.startAt || null,
        endAt: e.endAt || null,
        venueName: e.venueName,
        venueAddress: e.venueAddress,
        description: e.description,
        dressCode: e.dressCode,
        sortOrder: idx,
      })),
      storyItems: form.storyItems.map((s, idx) => ({
        title: s.title,
        eventDate: s.eventDate,
        description: s.description,
        imageUrl: s.imageUrl,
        sortOrder: idx,
      })),
      galleryItems: form.galleryItems.map((g, idx) => ({
        imageUrl: g.imageUrl,
        caption: g.caption,
        category: g.category,
        isFeatured: g.isFeatured,
        sortOrder: idx,
      })),
    });

    setSaving(false);
    if (res?.error) {
      setErrorMessage(res.error);
      return false;
    } else {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      return true;
    }
  };

  const handleNext = async () => {
    await saveChanges();
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Event list modifiers
  const addEvent = () => {
    setForm((prev) => ({
      ...prev,
      events: [
        ...prev.events,
        {
          name: "Celebration Event",
          ceremonyType: "Ceremony",
          startAt: "",
          endAt: "",
          venueName: "",
          venueAddress: "",
          description: "",
          dressCode: "",
          sortOrder: prev.events.length,
        },
      ],
    }));
  };

  const removeEvent = (index: number) => {
    setForm((prev) => ({
      ...prev,
      events: prev.events.filter((_, idx) => idx !== index),
    }));
  };

  // Story list modifiers
  const addStoryItem = () => {
    setForm((prev) => ({
      ...prev,
      storyItems: [
        ...prev.storyItems,
        {
          title: "A Special Chapter",
          eventDate: "2024",
          description: "Our memories and special moment together.",
          imageUrl: "",
          sortOrder: prev.storyItems.length,
        },
      ],
    }));
  };

  const removeStoryItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      storyItems: prev.storyItems.filter((_, idx) => idx !== index),
    }));
  };

  // Gallery modifiers
  const addGalleryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await handleFileUpload(file);
    if (url) {
      setForm((prev) => ({
        ...prev,
        galleryItems: [
          ...prev.galleryItems,
          {
            imageUrl: url,
            caption: "",
            category: "engagement",
            isFeatured: false,
            sortOrder: prev.galleryItems.length,
          },
        ],
      }));
    }
  };

  const removeGalleryItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      galleryItems: prev.galleryItems.filter((_, idx) => idx !== index),
    }));
  };

  const togglePublish = async () => {
    const newStatus = form.status === "published" ? false : true;
    const res = await togglePublishAction(initialData.id, newStatus);
    if (res?.status) {
      setForm((prev) => ({ ...prev, status: res.status }));
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col font-sans">
      {/* Top sticky builder bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-stone-500 hover:text-stone-900 transition p-1.5 rounded-lg hover:bg-stone-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-mono">
              Invitation Builder
            </span>
            <h1 className="text-base font-serif font-bold text-stone-900 leading-tight">
              {form.brideName} &amp; {form.groomName}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          )}

          <button
            onClick={saveChanges}
            disabled={saving}
            className="px-4 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-xs font-semibold text-stone-800 transition cursor-pointer"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save Changes"}
          </button>

          <Link
            href={`/invite/${form.slug}`}
            target="_blank"
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider transition flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview</span>
          </Link>
        </div>
      </header>

      {/* Step Navigation Pill Bar */}
      <div className="bg-white border-b border-stone-200 overflow-x-auto py-2.5 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center gap-2 min-w-max">
          {steps.map((st) => {
            const Icon = st.icon;
            const isActive = currentStep === st.number;
            const isCompleted = currentStep > st.number;

            return (
              <button
                key={st.number}
                onClick={async () => {
                  await saveChanges();
                  setCurrentStep(st.number);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                  isActive
                    ? "bg-amber-800 text-white shadow-sm"
                    : isCompleted
                    ? "bg-amber-50 text-amber-900 hover:bg-amber-100"
                    : "text-stone-500 hover:bg-stone-100 hover:text-stone-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>
                  {st.number}. {st.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Builder Form Workspace */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {/* STEP 1: Couple Details */}
        {currentStep === 1 && (
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-stone-900">Couple Details</h2>
              <p className="text-xs text-stone-500 mt-1">
                Enter the bride and groom&apos;s names, family information, and invitation message.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Bride&apos;s Name *
                </label>
                <input
                  type="text"
                  value={form.brideName}
                  onChange={(e) => handleFieldChange("brideName", e.target.value)}
                  placeholder="e.g. Meenu"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Groom&apos;s Name *
                </label>
                <input
                  type="text"
                  value={form.groomName}
                  onChange={(e) => handleFieldChange("groomName", e.target.value)}
                  placeholder="e.g. Melvin"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Bride&apos;s Family / Parents
                </label>
                <input
                  type="text"
                  value={form.brideFamilyName || ""}
                  onChange={(e) => handleFieldChange("brideFamilyName", e.target.value)}
                  placeholder="e.g. Varghese & Mariamma, Kottayam"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Groom&apos;s Family / Parents
                </label>
                <input
                  type="text"
                  value={form.groomFamilyName || ""}
                  onChange={(e) => handleFieldChange("groomFamilyName", e.target.value)}
                  placeholder="e.g. Mathews & Elizabeth, Thrissur"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                Cover Photo URL or Upload
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.coverMediaUrl || ""}
                  onChange={(e) => handleFieldChange("coverMediaUrl", e.target.value)}
                  placeholder="https://... or click upload"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition"
                />
                <label className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition">
                  <Upload className="w-3.5 h-3.5" /> Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const url = await handleFileUpload(file);
                      if (url) handleFieldChange("coverMediaUrl", url);
                    }}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                Personal Invitation Note
              </label>
              <textarea
                rows={3}
                value={form.description || ""}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                placeholder="We invite you to celebrate our new beginning as we unite in holy matrimony..."
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Wedding Date & Venue */}
        {currentStep === 2 && (
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-stone-900">
                Wedding Date &amp; Primary Venue
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Key date, time, venue address, and travel details for navigation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Wedding Date
                </label>
                <input
                  type="date"
                  value={form.weddingDate || ""}
                  onChange={(e) => handleFieldChange("weddingDate", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Wedding Time
                </label>
                <input
                  type="text"
                  value={form.weddingTime || ""}
                  onChange={(e) => handleFieldChange("weddingTime", e.target.value)}
                  placeholder="e.g. 10:30 AM"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                Venue Name
              </label>
              <input
                type="text"
                value={form.venueName || ""}
                onChange={(e) => handleFieldChange("venueName", e.target.value)}
                placeholder="e.g. St. Mary's Metropolitan Cathedral"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                Venue Street Address
              </label>
              <input
                type="text"
                value={form.venueAddress || ""}
                onChange={(e) => handleFieldChange("venueAddress", e.target.value)}
                placeholder="e.g. High Road, Round South"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={form.city || ""}
                  onChange={(e) => handleFieldChange("city", e.target.value)}
                  placeholder="e.g. Thrissur"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={form.state || ""}
                  onChange={(e) => handleFieldChange("state", e.target.value)}
                  placeholder="Kerala"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={form.country || "India"}
                  onChange={(e) => handleFieldChange("country", e.target.value)}
                  placeholder="India"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                Travel &amp; Parking Guidelines
              </label>
              <textarea
                rows={2}
                value={form.travelInfo || ""}
                onChange={(e) => handleFieldChange("travelInfo", e.target.value)}
                placeholder="Valet parking available at North Gate. Nearest railway station is Thrissur (2km away)."
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Multi-Event System */}
        {currentStep === 3 && (
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif font-bold text-stone-900">Events Schedule</h2>
                <p className="text-xs text-stone-500 mt-1">
                  Add multiple functions (e.g. Mehendi, Haldi, Muhurtham, Church Wedding, Reception).
                </p>
              </div>

              <button
                type="button"
                onClick={addEvent}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Event
              </button>
            </div>

            <div className="space-y-4">
              {form.events.map((ev, index) => (
                <div
                  key={index}
                  className="p-5 rounded-2xl border border-stone-200 bg-stone-50/60 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider font-bold text-amber-800">
                      Event #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeEvent(index)}
                      className="text-stone-400 hover:text-rose-600 transition p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                        Event Title
                      </label>
                      <input
                        type="text"
                        value={ev.name}
                        onChange={(e) => {
                          const updated = [...form.events];
                          updated[index].name = e.target.value;
                          setForm((prev) => ({ ...prev, events: updated }));
                        }}
                        placeholder="e.g. Holy Matrimony"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-600/30"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                        Ceremony Type
                      </label>
                      <input
                        type="text"
                        value={ev.ceremonyType || ""}
                        onChange={(e) => {
                          const updated = [...form.events];
                          updated[index].ceremonyType = e.target.value;
                          setForm((prev) => ({ ...prev, events: updated }));
                        }}
                        placeholder="Church / Reception / Mehendi / Muhurtham"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-600/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                        Date &amp; Time
                      </label>
                      <input
                        type="datetime-local"
                        value={ev.startAt || ""}
                        onChange={(e) => {
                          const updated = [...form.events];
                          updated[index].startAt = e.target.value;
                          setForm((prev) => ({ ...prev, events: updated }));
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-600/30"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                        Venue
                      </label>
                      <input
                        type="text"
                        value={ev.venueName || ""}
                        onChange={(e) => {
                          const updated = [...form.events];
                          updated[index].venueName = e.target.value;
                          setForm((prev) => ({ ...prev, events: updated }));
                        }}
                        placeholder="Church / Hall Name"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-600/30"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                        Dress Code
                      </label>
                      <input
                        type="text"
                        value={ev.dressCode || ""}
                        onChange={(e) => {
                          const updated = [...form.events];
                          updated[index].dressCode = e.target.value;
                          setForm((prev) => ({ ...prev, events: updated }));
                        }}
                        placeholder="Traditional / Formal"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-600/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={ev.description || ""}
                      onChange={(e) => {
                        const updated = [...form.events];
                        updated[index].description = e.target.value;
                        setForm((prev) => ({ ...prev, events: updated }));
                      }}
                      placeholder="Brief note for guests"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-600/30"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Photo Gallery */}
        {currentStep === 4 && (
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif font-bold text-stone-900">Photo Gallery</h2>
                <p className="text-xs text-stone-500 mt-1">
                  Upload engagement, travel, or pre-wedding photos. Guests will see these in an interactive lightbox.
                </p>
              </div>

              <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider transition cursor-pointer">
                <Upload className="w-3.5 h-3.5" /> Upload Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={addGalleryImage}
                />
              </label>
            </div>

            {form.galleryItems.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-stone-300 rounded-2xl bg-stone-50">
                <ImageIcon className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <p className="text-xs text-stone-500">
                  No gallery photos yet. Upload photos from your engagement or pre-wedding shoots.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {form.galleryItems.map((item, index) => (
                  <div
                    key={index}
                    className="relative rounded-2xl border border-stone-200 overflow-hidden bg-stone-100 group flex flex-col"
                  >
                    <div className="relative aspect-square w-full">
                      <Image src={item.imageUrl} alt="Gallery" fill className="object-cover" />
                    </div>
                    <div className="p-2 bg-white">
                      <input
                        type="text"
                        value={item.caption || ""}
                        placeholder="Caption..."
                        onChange={(e) => {
                          const updated = [...form.galleryItems];
                          updated[index].caption = e.target.value;
                          setForm((prev) => ({ ...prev, galleryItems: updated }));
                        }}
                        className="w-full text-xs px-2 py-1 border border-stone-200 rounded-lg"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeGalleryItem(index)}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 5: Story Timeline */}
        {currentStep === 5 && (
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif font-bold text-stone-900">Story Timeline</h2>
                <p className="text-xs text-stone-500 mt-1">
                  Share key milestones (e.g. &ldquo;How We Met&rdquo;, &ldquo;First Trip&rdquo;, &ldquo;The Proposal&rdquo;).
                </p>
              </div>

              <button
                type="button"
                onClick={addStoryItem}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Chapter
              </button>
            </div>

            <div className="space-y-4">
              {form.storyItems.map((story, index) => (
                <div
                  key={index}
                  className="p-5 rounded-2xl border border-stone-200 bg-stone-50/60 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider font-bold text-stone-600">
                      Chapter #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeStoryItem(index)}
                      className="text-stone-400 hover:text-rose-600 transition p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={story.title}
                        onChange={(e) => {
                          const updated = [...form.storyItems];
                          updated[index].title = e.target.value;
                          setForm((prev) => ({ ...prev, storyItems: updated }));
                        }}
                        placeholder="e.g. When We First Met"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                        Year / Date
                      </label>
                      <input
                        type="text"
                        value={story.eventDate || ""}
                        onChange={(e) => {
                          const updated = [...form.storyItems];
                          updated[index].eventDate = e.target.value;
                          setForm((prev) => ({ ...prev, storyItems: updated }));
                        }}
                        placeholder="e.g. Summer 2021"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={story.description}
                      onChange={(e) => {
                        const updated = [...form.storyItems];
                        updated[index].description = e.target.value;
                        setForm((prev) => ({ ...prev, storyItems: updated }));
                      }}
                      placeholder="Tell the story of this memory..."
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: Theme System */}
        {currentStep === 6 && (
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-stone-900">Choose Visual Theme</h2>
              <p className="text-xs text-stone-500 mt-1">
                Both themes render all your details seamlessly. You can switch at any time.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Theme 1 */}
              <div
                onClick={() => handleFieldChange("themeKey", "elegant-minimal")}
                className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${
                  form.themeKey === "elegant-minimal"
                    ? "border-stone-900 bg-stone-50 ring-2 ring-stone-900/10 shadow-md"
                    : "border-stone-200 hover:border-stone-300 bg-white"
                }`}
              >
                <div className="h-32 rounded-2xl bg-[#faf8f5] border border-stone-200 flex flex-col items-center justify-center p-4 text-center mb-4">
                  <span className="font-serif italic text-lg text-stone-800">Melvin &amp; Meenu</span>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-stone-400 mt-1">
                    DECEMBER 20, 2026
                  </span>
                </div>
                <h3 className="font-serif font-bold text-stone-900 text-base">Elegant Minimal</h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Refined editorial typography, warm stone neutral palettes, and tranquil whitespace.
                </p>
              </div>

              {/* Theme 2 */}
              <div
                onClick={() => handleFieldChange("themeKey", "kerala-traditional")}
                className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${
                  form.themeKey === "kerala-traditional"
                    ? "border-amber-700 bg-amber-50/60 ring-2 ring-amber-700/20 shadow-md"
                    : "border-stone-200 hover:border-stone-300 bg-white"
                }`}
              >
                <div className="h-32 rounded-2xl bg-[#fffdf5] border-2 border-amber-300/80 flex flex-col items-center justify-center p-4 text-center mb-4 relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />
                  <span className="font-serif font-bold text-lg text-amber-950">
                    മെൽവിൻ &amp; മീനു
                  </span>
                  <span className="text-[10px] tracking-widest uppercase text-amber-800 font-semibold mt-1">
                    മംഗള മുഹൂർത്തം ✦ KASAVU
                  </span>
                </div>
                <h3 className="font-serif font-bold text-stone-900 text-base">
                  Kerala Traditional (കേരളം)
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Golden Kasavu borders, auspicious lamp motifs, and localized Malayalam styling.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Privacy & Custom URL */}
        {currentStep === 7 && (
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-stone-900">Privacy &amp; Web Link</h2>
              <p className="text-xs text-stone-500 mt-1">
                Customize your web link address and set password protection.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                Custom Web Link (Slug)
              </label>
              <div className="flex items-center rounded-xl border border-stone-300 overflow-hidden focus-within:ring-2 focus-within:ring-amber-600/30">
                <span className="px-3.5 py-2.5 bg-stone-100 text-stone-500 text-xs font-mono border-r border-stone-300">
                  wedlink.app/invite/
                </span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => handleFieldChange("slug", e.target.value)}
                  placeholder="melvin-meenu"
                  className="flex-1 px-3 py-2.5 text-xs font-mono focus:outline-none"
                />
              </div>
            </div>

            {/* Privacy Level */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                Privacy Protection Level
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => handleFieldChange("privacyMode", "public")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                    form.privacyMode === "public"
                      ? "border-stone-900 bg-stone-50 font-semibold"
                      : "border-stone-200 bg-white"
                  }`}
                >
                  <Globe className="w-5 h-5 text-stone-700 mb-2" />
                  <div className="text-sm font-bold text-stone-900">Public Link</div>
                  <div className="text-xs text-stone-500 mt-0.5">
                    Anyone who has the link can view your wedding details and RSVP.
                  </div>
                </div>

                <div
                  onClick={() => handleFieldChange("privacyMode", "password")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                    form.privacyMode === "password"
                      ? "border-amber-700 bg-amber-50 font-semibold"
                      : "border-stone-200 bg-white"
                  }`}
                >
                  <Shield className="w-5 h-5 text-amber-700 mb-2" />
                  <div className="text-sm font-bold text-stone-900">Password Protected</div>
                  <div className="text-xs text-stone-500 mt-0.5">
                    Requires guests to enter a passcode to view ceremony venues and photos.
                  </div>
                </div>
              </div>
            </div>

            {form.privacyMode === "password" && (
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-950 mb-1">
                  Invitation Passcode
                </label>
                <input
                  type="text"
                  value={form.invitationPassword}
                  onChange={(e) => handleFieldChange("invitationPassword", e.target.value)}
                  placeholder="e.g. MEENU2026"
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-xs font-mono tracking-wider focus:outline-none"
                />
                <span className="text-[11px] text-amber-800 mt-1 block">
                  Share this passcode along with your wedding card or WhatsApp message.
                </span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between border-t border-stone-200">
              <div>
                <span className="font-semibold text-xs text-stone-900 block">Allow Online RSVPs</span>
                <span className="text-[11px] text-stone-500">
                  Allow guests to submit attendance counts and meal choices directly.
                </span>
              </div>
              <input
                type="checkbox"
                checked={form.rsvpEnabled}
                onChange={(e) => handleFieldChange("rsvpEnabled", e.target.checked)}
                className="w-5 h-5 accent-amber-700 rounded"
              />
            </div>
          </div>
        )}

        {/* STEP 8: Preview & Publish */}
        {currentStep === 8 && (
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-stone-900">
                Review &amp; Publish Wedding Space
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Your wedding space is ready to go live! When published, guests can access it via your link and QR code.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-500 uppercase tracking-wider block">
                    Current Status
                  </span>
                  <span
                    className={`text-lg font-serif font-bold ${
                      form.status === "published" ? "text-emerald-700" : "text-amber-700"
                    }`}
                  >
                    {form.status === "published" ? "Live to the World" : "Saved as Draft"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={togglePublish}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition ${
                    form.status === "published"
                      ? "bg-stone-200 hover:bg-stone-300 text-stone-800"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                  }`}
                >
                  {form.status === "published" ? "Unpublish to Draft" : "Publish Live Now"}
                </button>
              </div>

              <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-stone-600">
                  Public Link:{" "}
                  <strong className="text-stone-900 font-mono">
                    /invite/{form.slug}
                  </strong>
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/invite/${form.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-amber-800 hover:underline font-semibold"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Public Invite
                  </Link>
                  <Link
                    href={`/dashboard/invitations/${initialData.id}/share`}
                    className="inline-flex items-center gap-1 text-stone-700 hover:underline font-semibold"
                  >
                    Download QR Code
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Builder bottom pagination bar */}
        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="px-5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-100 disabled:opacity-40 transition cursor-pointer"
          >
            Previous
          </button>

          <div className="flex items-center gap-2">
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Save &amp; Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <Link
                href="/dashboard"
                className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider shadow-md transition"
              >
                Return to Dashboard
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
