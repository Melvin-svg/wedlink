"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Eye } from "lucide-react";

interface GalleryViewerProps {
  items: Array<{
    id: string;
    imageUrl: string;
    caption?: string | null;
    category?: string | null;
  }>;
}

export function GalleryViewer({ items }: GalleryViewerProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!items || items.length === 0) return null;

  const categories = ["all", ...Array.from(new Set(items.map((i) => i.category).filter(Boolean)))];

  const filteredItems =
    activeCategory === "all"
      ? items
      : items.filter((item) => item.category === activeCategory);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + filteredItems.length) % filteredItems.length);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % filteredItems.length);
  };

  return (
    <div className="w-full">
      {/* Category filter tabs if categories exist */}
      {categories.length > 2 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat || "all")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
                activeCategory === cat
                  ? "bg-stone-900 text-white shadow-sm"
                  : "bg-stone-100 hover:bg-stone-200 text-stone-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid of gallery pictures */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {filteredItems.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => openLightbox(idx)}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-stone-100 cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
          >
            <Image
              src={item.imageUrl}
              alt={item.caption || "Wedding photo"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-white">
              {item.caption && (
                <p className="text-xs font-medium line-clamp-2 leading-tight">
                  {item.caption}
                </p>
              )}
              <div className="flex items-center gap-1 text-[10px] text-stone-300 mt-1 uppercase tracking-wider font-semibold">
                <Eye className="w-3 h-3" /> View Photo
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox modal */}
      {selectedIndex !== null && filteredItems[selectedIndex] && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
        >
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 text-stone-400 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {filteredItems.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[85vh] w-full flex flex-col items-center"
          >
            <div className="relative w-full h-[65vh] sm:h-[75vh]">
              <Image
                src={filteredItems[selectedIndex].imageUrl}
                alt="Selected view"
                fill
                className="object-contain"
                priority
              />
            </div>
            {filteredItems[selectedIndex].caption && (
              <p className="mt-4 text-center text-sm text-stone-300 font-serif max-w-lg">
                {filteredItems[selectedIndex].caption}
              </p>
            )}
            <span className="text-xs text-stone-500 mt-1">
              {selectedIndex + 1} of {filteredItems.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
