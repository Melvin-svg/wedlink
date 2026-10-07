export interface ThemeProps {
  invitation: {
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
    themeKey?: string;
    baseUrl?: string;
    weddingDate?: string | Date | null;
    weddingTime?: string | null;
    venueName?: string | null;
    venueAddress?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    dressCode?: string | null;
    travelInfo?: string | null;
    rsvpEnabled: boolean;
    events: Array<{
      id: string;
      name: string;
      ceremonyType?: string | null;
      startAt?: string | Date | null;
      endAt?: string | Date | null;
      venueName?: string | null;
      venueAddress?: string | null;
      description?: string | null;
      dressCode?: string | null;
    }>;
    storyItems: Array<{
      id: string;
      title: string;
      eventDate?: string | null;
      description: string;
      imageUrl?: string | null;
    }>;
    galleryItems: Array<{
      id: string;
      imageUrl: string;
      caption?: string | null;
      category?: string | null;
      isFeatured?: boolean;
    }>;
  };
  previewMode?: boolean;
}
