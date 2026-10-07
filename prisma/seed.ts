import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with demo wedding space...");

  // Clean existing seed if present
  await prisma.user.deleteMany({ where: { email: "melvin@wedlink.app" } });

  const passwordHash = await bcrypt.hash("password123", 10);

  const user = await prisma.user.create({
    data: {
      email: "melvin@wedlink.app",
      name: "Melvin Mathews",
      passwordHash,
    },
  });

  // Create demo wedding: Melvin & Meenu (Kerala Catholic / Traditional)
  const weddingDate = new Date("2026-12-20T10:30:00.000Z");

  const invitation = await prisma.invitation.create({
    data: {
      ownerId: user.id,
      slug: "melvin-meenu",
      brideName: "Meenu",
      groomName: "Melvin",
      brideFamilyName: "Varghese & Mariamma, Kottayam",
      groomFamilyName: "Mathews & Elizabeth, Thrissur",
      description:
        "Together with our families, we invite you to share our joy and celebrate the beginning of our new life together in Holy Matrimony.",
      ceremonyTemplate: "christian",
      themeKey: "elegant-minimal", // Can test toggling to "kerala-traditional"
      status: "published",
      privacyMode: "public",
      coverMediaUrl: "/demo/hero-couple.jpg",
      bridePhotoUrl: "/demo/jasmine.jpg",
      groomPhotoUrl: "/demo/rings.jpg",
      weddingDate,
      weddingTime: "10:30 AM",
      timezone: "Asia/Kolkata",
      venueName: "St. Mary's Metropolitan Cathedral",
      venueAddress: "High Road, Round South",
      city: "Thrissur",
      state: "Kerala",
      country: "India",
      travelInfo:
        "Valet parking available at the church campus and reception hall. The cathedral is 2 km from Thrissur Railway Station.",
      events: {
        create: [
          {
            name: "Holy Matrimony & Blessing",
            ceremonyType: "Church Wedding",
            startAt: new Date("2026-12-20T10:30:00.000Z"),
            venueName: "St. Mary's Cathedral",
            venueAddress: "Thrissur, Kerala",
            description: "Sacred solemnization of holy matrimony and nuptial mass blessing.",
            dressCode: "Traditional Formal / Kerala Sarees & Suits",
            sortOrder: 0,
          },
          {
            name: "Grand Reception Dinner",
            ceremonyType: "Reception",
            startAt: new Date("2026-12-20T18:30:00.000Z"),
            venueName: "Lulu International Convention Centre",
            venueAddress: "Puzhakkal, Thrissur",
            description: "Dinner, toasts, music, cake cutting, and joyous celebrations.",
            dressCode: "Evening Formal / Festive",
            sortOrder: 1,
          },
        ],
      },
      storyItems: {
        create: [
          {
            title: "Where It All Began",
            eventDate: "2020",
            description:
              "We crossed paths during our university days in Kochi over shared love for filter coffee and quiet bookstore evenings.",
            sortOrder: 0,
          },
          {
            title: "First Mountain Trip to Munnar",
            eventDate: "2022",
            description:
              "A memorable road trip amidst the misty tea hills where we realized we were inseparable best friends.",
            sortOrder: 1,
          },
          {
            title: "The Sunset Proposal",
            eventDate: "2024",
            description:
              "Along the golden backwaters of Kumarakom as the sun dipped behind the coconut palms, she said yes!",
            sortOrder: 2,
          },
        ],
      },
      galleryItems: {
        create: [
          {
            imageUrl: "/demo/hero-couple.jpg",
            caption: "Our engagement blessing celebration on the backwaters",
            category: "engagement",
            sortOrder: 0,
            isFeatured: true,
          },
          {
            imageUrl: "/demo/jasmine.jpg",
            caption: "Delicate kasavu traditions & jasmine blessings",
            category: "traditions",
            sortOrder: 1,
          },
          {
            imageUrl: "/demo/munnar.jpg",
            caption: "Hand in hand through the tea hills of Munnar",
            category: "travel",
            sortOrder: 2,
          },
          {
            imageUrl: "/demo/reception.jpg",
            caption: "Evening reception under the palms & warm candlelight",
            category: "celebration",
            sortOrder: 3,
          },
          {
            imageUrl: "/demo/rings.jpg",
            caption: "Sacred vows & wedding rings",
            category: "moments",
            sortOrder: 4,
          },
        ],
      },
      rsvps: {
        create: [
          {
            guestName: "Arun & Divya Kurian",
            guestEmail: "arun.k@example.com",
            guestPhone: "+91 98470 12345",
            status: "accepted",
            guestCount: 2,
            mealPreference: "Non-Vegetarian",
            message: "So thrilled for you both! Can't wait to dance at the reception!",
          },
          {
            guestName: "Dr. Thomas George & Family",
            guestEmail: "tgeorge@example.com",
            guestPhone: "+91 94471 54321",
            status: "accepted",
            guestCount: 3,
            mealPreference: "Pure Vegetarian Sadhya",
            message: "Our heartfelt blessings and prayers to Melvin and Meenu on this holy union.",
          },
          {
            guestName: "Sanjay Menon",
            guestEmail: "sanjay@example.com",
            status: "declined",
            guestCount: 0,
            message: "Hearty congratulations! Truly sorry I will be abroad on duty, sending all my love!",
          },
        ],
      },
    },
  });

  console.log(`Demo wedding created with slug: ${invitation.slug}`);
  console.log(`Demo user email: melvin@wedlink.app (password: password123)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
