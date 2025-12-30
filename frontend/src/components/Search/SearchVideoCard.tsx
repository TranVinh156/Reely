import { Play } from "lucide-react";
import { NavLink } from "react-router-dom";
import type { SearchVideoDTO } from "@/api/search";
import { resolveMediaUrl } from "@/utils/media";

export default function SearchVideoCard({ v }: { v: SearchVideoDTO }) {
  return (
    <NavLink
      to={`/videos/${v.videoId}`}
      className="aspect-[10/16] bg-gray-900 rounded-lg overflow-hidden relative group cursor-pointer block"
    >
      <video
        src={resolveMediaUrl(v.videoUrl)}
        className="w-full h-full object-cover"
        muted
        loop
        playsInline
        onMouseEnter={(e) => {
          const p = e.currentTarget.play();
          if (p !== undefined) {
            p.catch(() => { });
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.pause();
          e.currentTarget.currentTime = 0;
        }}
      />
      <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1 text-white text-xs drop-shadow-md">
        <Play size={12} fill="white" />
        <span>{v.viewCount ?? 0}</span>
      </div>
    </NavLink>
  );
}
