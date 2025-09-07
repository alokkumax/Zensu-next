// components/VideoView.tsx
"use client";
import React from "react";

const VideoView = ({ videos }: { videos: any[] }) => {
  if (!videos?.length) return null;

  return (
    <div className="flex flex-col gap-4 w-full md:w-1/2">
      {videos.map((video, i) => (
        <div key={video._key || i} className="w-full h-64 rounded-md overflow-hidden">
          {video.upload?.asset?.url ? (
            <video
              src={video.upload.asset.url}
              controls
              className="w-full h-full object-cover"
            />
          ) : video.url ? (
            <iframe
              src={video.url}
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default VideoView;
