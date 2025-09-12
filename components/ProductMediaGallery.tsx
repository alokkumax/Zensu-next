"use client";

import React, { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { SanityImageCrop, SanityImageHotspot, internalGroqTypeReferenceTo } from "@/sanity.types";
import { dataset, projectId } from "@/sanity/env";

type SanityImage = {
  asset?: {
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
  };
  hotspot?: SanityImageHotspot;
  crop?: SanityImageCrop;
  _type: "image";
  _key: string;
};

type SanityFileRef = { _ref?: string; url?: string };

type SanityVideo = {
  _key?: string;
  upload?: { asset?: SanityFileRef };
  url?: string;
};

function fileRefToUrl(asset?: SanityFileRef): string | undefined {
  if (!asset) return undefined;
  if (asset.url) return asset.url;
  if (asset._ref) {
    // _ref format: file-<assetId>-<extension>
    const match = asset._ref.match(/^file-([^-]+)-(\w+)$/);
    if (match) {
      const [, id, ext] = match;
      return `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${ext}`;
    }
  }
  return undefined;
}

export default function ProductMediaGallery({
  images = [],
  videos = [],
  isStock,
}: {
  images?: SanityImage[];
  videos?: SanityVideo[];
  isStock?: number | undefined;
}) {
  // Build media list with priority: first image + first video at top row, then alternate remaining
  const media = useMemo(() => {
    const result: Array<
      | { kind: "image"; key: string; data: SanityImage }
      | { kind: "video"; key: string; data: SanityVideo }
    > = [];

    const firstImage = images[0];
    const firstVideo = videos[0];
    if (firstImage) result.push({ kind: "image", key: firstImage._key, data: firstImage });
    if (firstVideo) result.push({ kind: "video", key: firstVideo._key || "video-0", data: firstVideo });

    const remainingImages = images.slice(firstImage ? 1 : 0);
    const remainingVideos = videos.slice(firstVideo ? 1 : 0);
    const maxLen = Math.max(remainingImages.length, remainingVideos.length);
    for (let i = 0; i < maxLen; i++) {
      const img = remainingImages[i];
      const vid = remainingVideos[i];
      if (img) result.push({ kind: "image", key: img._key, data: img });
      if (vid) result.push({ kind: "video", key: vid._key || `video-${i + 1}` , data: vid });
    }

    // If neither image nor video provided initially, just concatenate images then videos
    if (result.length === 0) {
      images.forEach((img) => result.push({ kind: "image", key: img._key, data: img }));
      videos.forEach((vid, i) => result.push({ kind: "video", key: vid._key || `video-${i}`, data: vid }));
    }

    return result;
  }, [images, videos]);

  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLVideoElement;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            void el.play().catch(() => {});
          } else {
            el.pause();
          }
        });
      },
      { threshold: [0, 0.5, 1] }
    );

    Object.values(videoRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [media.length]);

  if (!media.length) return null;

  return (
    <div className="w-full md:w-1/2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {media.map((item) => {
          if (item.kind === "image") {
            return (
              <div key={item.key} className="w-full overflow-hidden bg-white">
                <Image
                  src={urlFor(item.data as SanityImage).url()}
                  alt="product media"
                  width={1000}
                  height={1200}
                  loading="lazy"
                  className={`w-full h-full object-cover aspect-[3/4] ${
                    isStock === 0 ? "opacity-50" : ""
                  }`}
                />
              </div>
            );
          }
          const uploadedUrl = fileRefToUrl((item.data as SanityVideo).upload?.asset);
          const externalUrl = (item.data as SanityVideo).url;
          return (
            <div key={item.key} className="w-full overflow-hidden bg-white">
              {uploadedUrl ? (
                <video
                  ref={(el) => { videoRefs.current[item.key] = el; }}
                  src={uploadedUrl}
                  muted
                  playsInline
                  controls
                  loop
                  className="w-full h-full object-cover aspect-[3/4]"
                />
              ) : externalUrl ? (
                <div className="relative w-full">
                  <iframe
                    src={externalUrl}
                    className="w-full h-full aspect-[3/4]"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
} 