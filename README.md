# 💍 WedLink

> **Your wedding. One private link. Every memory.**  
> A privacy-first, India/Kerala-first digital wedding platform where one secure link evolves from an interactive invitation to wedding-day coordination and a lasting digital keepsake.

Built following the product architecture specifications in [`WedLink_Final_Implemented_Product_Blueprint.md`](../WedLink_Final_Implemented_Product_Blueprint.md).

---

## ✨ Key Features

- **📱 Mobile-First Public Invitations:** Guests open the invitation without downloading any app or creating an account.
- **✨ Cultural Localization & Two Bespoke Themes:**
  - *Elegant Minimal*: Refined serif editorial typography, warm neutral palette, and tranquil whitespace.
  - *Kerala Traditional (കേരളം)*: Auspicious Kasavu gold borders, lamp motifs, and localized Malayalam styling.
- **⏳ Dynamic Wedding Lifecycle Countdown:** Real-time countdown automatically transitions across **Before** ("Until We Say 'I Do'"), **Wedding Day** ("Today is the Day! ❤️"), and **Post-Wedding** ("We Got Married! ✨").
- **💌 Interactive RSVP & Sadhya Preferences:** Guests confirm attendance with headcounts and meal options (*Traditional Sadhya / Non-Veg*, *Pure Vegetarian Sadhya*, *Jain / Vegan*), with celebration confetti on response.
- **🗓️ Multi-Event Schedules:** Support for Christian, Kerala Hindu, Muslim Nikah, and contemporary celebrations with ceremony-specific timings, venues, and dress codes.
- **📍 One-Tap Navigation:** Google Maps integration eliminates lost guests.
- **🔒 Privacy by Default:** Optional passcode protection (Level 2 Privacy Mode) to keep wedding locations and family media private.
- **🖼️ Photo Gallery & Lightbox:** Interactive photo gallery with fullscreen viewer and category filtering.
- **📖 Story Timeline:** Digital chapters chronicling the couple's relationship journey.
- **📲 WhatsApp-First Sharing & QR Codes:** Instant WhatsApp invitation formatting and high-resolution print-ready QR codes for physical card printing.
- **📊 Creator Workspace & CSV Export:** Real-time dashboard showing confirmed guests, positive vs. declined responses, and one-click CSV export of guest lists.

---

## 🛠️ Technology Stack

- **Framework:** Next.js (App Router, Turbopack, Server Actions)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + Custom CSS Design System
- **Typography:** Cormorant Garamond, Plus Jakarta Sans, Noto Serif Malayalam
- **Database & ORM:** SQLite (development) / PostgreSQL compatible via Prisma ORM
- **Authentication:** Custom JWT sessions (`jose` + `bcryptjs` in HTTP-only secure cookies)
- **Validation:** Zod schemas
- **QR Code:** `qrcode` library (High-res PNG / SVG)
- **Effects:** Canvas Confetti

---

## 🚀 Quick Start (Single Command)

From the project root:

```bash
./start.sh
```

Or from within the `wedlink/` folder:

```bash
npm run dev
```

The script will automatically detect your local network IP (e.g. `http://172.20.10.2:3000`), initialize the database, and launch the server bound to `0.0.0.0` so both your computer and phones on your Wi-Fi can open the invitations.

---

## 🔑 Demo Account Credentials

A pre-populated demonstration wedding is included out-of-the-box:

- **Login URL:** [http://localhost:3000/login](http://localhost:3000/login)
- **Email:** `melvin@wedlink.app`
- **Password:** `password123`
- **Public Invitation:** [http://localhost:3000/invite/melvin-meenu](http://localhost:3000/invite/melvin-meenu)

---

## 📂 Project Structure

```text
wedlink/
├── prisma/
│   ├── schema.prisma       # Database schema (User, Invitation, Event, RSVP, Gallery, Story)
│   └── seed.ts             # Pre-populated demo wedding seed script
├── public/
│   ├── demo/               # High-res Kerala editorial wedding photography
│   └── uploads/            # User image uploads directory
├── src/
│   ├── actions/            # Server actions (Auth, Invitation CRUD, RSVP, Unlock)
│   ├── app/
│   │   ├── (auth)/         # /login & /register pages
│   │   ├── api/            # Upload & CSV Export API routes
│   │   ├── dashboard/      # Creator dashboard, builder, RSVPs & share pages
│   │   ├── invite/[slug]/  # Public guest invitation page
│   │   ├── globals.css     # Design system tokens, fonts & animations
│   │   └── page.tsx        # Product landing page
│   ├── components/
│   │   ├── builder/        # 8-step multi-step invitation builder
│   │   ├── invitation/     # Countdown, RSVP form, Lightbox gallery, ShareSheet
│   │   ├── themes/         # Elegant Minimal & Kerala Traditional theme renderers
│   │   └── Navbar.tsx      # Top navigation header
│   └── lib/
│       ├── auth.ts         # Session handling & password hashing
│       ├── db.ts           # Prisma client singleton
│       ├── qr.ts           # QR code generation utilities
│       ├── storage.ts      # Safe local file uploads with MIME validation
│       ├── url.ts          # Mobile LAN IP & dynamic origin resolution
│       └── validation.ts   # Zod validation schemas
├── .env.example
├── package.json
└── README.md
```

---

## 📜 Available NPM Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts development server bound to all network interfaces (`-H 0.0.0.0`) |
| `npm run build` | Builds optimized Next.js production bundle |
| `npm run start` | Starts production server |
| `npm run db:push` | Syncs database schema with Prisma |
| `npm run db:seed` | Seeds database with the demo wedding space |
| `npm run lint` | Runs ESLint code quality checks |

---

## 📄 License

Private product codebase. All rights reserved.
