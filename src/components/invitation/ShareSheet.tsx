"use client";

import { useState, useEffect } from "react";
import { Share2, Check, MessageCircle, Copy } from "lucide-react";

interface ShareSheetProps {
  slug: string;
  coupleTitle: string;
  initialBaseUrl?: string;
}

export function ShareSheet({ slug, coupleTitle, initialBaseUrl }: ShareSheetProps) {
  const [copied, setCopied] = useState(false);
  const [fullUrl, setFullUrl] = useState<string>(() => {
    if (initialBaseUrl) return `${initialBaseUrl}/invite/${slug}`;
    return `http://localhost:3000/invite/${slug}`;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      // If the current browser window is accessing via a custom IP/domain, use that origin!
      const origin = window.location.origin;
      // If origin is localhost and an initialBaseUrl with a LAN IP was provided by server, prefer the LAN IP for mobile sharing
      if (origin.includes("localhost") && initialBaseUrl && !initialBaseUrl.includes("localhost")) {
        setFullUrl(`${initialBaseUrl}/invite/${slug}`);
      } else {
        setFullUrl(`${origin}/invite/${slug}`);
      }
    }
  }, [slug, initialBaseUrl]);

  const whatsappText = encodeURIComponent(
    `✨ You are warmly invited to celebrate the wedding of ${coupleTitle}! 💍\n\nView our schedule, directions, photos & kindly RSVP here:\n${fullUrl}`
  );

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div className="space-y-3 w-full max-w-md mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
        <a
          href={`https://wa.me/?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm tracking-wide shadow-sm transition"
        >
          <MessageCircle className="w-4 h-4 fill-white" /> Share on WhatsApp
        </a>

        <button
          onClick={copyToClipboard}
          className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs sm:text-sm tracking-wide transition border border-stone-200 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" /> Copied Link!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" /> Copy Invitation Link
            </>
          )}
        </button>
      </div>

      <div className="text-[11px] text-stone-500 font-mono text-center break-all select-all px-2">
        {fullUrl}
      </div>
    </div>
  );
}
