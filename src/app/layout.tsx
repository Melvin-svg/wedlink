import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, Noto_Serif_Malayalam } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const malayalam = Noto_Serif_Malayalam({
  variable: "--font-malayalam",
  subsets: ["malayalam"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "WedLink — Your wedding. One private link. Every memory.",
    template: "%s · WedLink",
  },
  description:
    "Create a private, beautiful digital wedding space for your invitation, RSVPs, directions, and memories — made for Kerala and Indian weddings.",
};

export const viewport: Viewport = {
  themeColor: "#fbf8f3",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jakarta.variable} ${malayalam.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
