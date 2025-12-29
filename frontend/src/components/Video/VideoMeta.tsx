import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import type { Video } from "@/types/video";

/**
 * TikTok-like caption block: username + description + hashtag pills.
 * - Collapses to 2 lines (caption) + 1 line (tags) by default
 * - Shows "Thêm" button when content is long
 * - Clicking tags navigates to /tags/:tagName
 */
export default function VideoMeta({ video }: { video: Video }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const tags = useMemo(() => (video.tags ?? []).filter(Boolean), [video.tags]);

  const showMore = useMemo(() => {
    const descLen = (video.description ?? "").trim().length;
    return descLen > 90 || tags.length > 4;
  }, [tags.length, video.description]);

  const visibleTags = expanded ? tags : tags.slice(0, 4);

  return (
    <div className="pointer-events-none absolute bottom-5 left-5 right-20 text-white drop-shadow-md">
      <div className="pointer-events-auto">
        <p className="font-semibold">@{video.user.username}</p>

        <div
          className={`mt-1 text-sm text-white/90 ${expanded ? "" : "line-clamp-2"}`}
          onClick={(e) => {
            // prevent togglePlay in VideoPlayer
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {video.description}
        </div>

        {!!visibleTags.length && (
          <div
            className={`mt-2 flex flex-wrap gap-2 text-xs ${expanded ? "" : "line-clamp-1"}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {visibleTags.map((t) => (
              <button
                key={t}
                className="rounded-full bg-white/10 px-2 py-1 text-white/90 hover:bg-white/15"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate(`/tags/${encodeURIComponent(t)}`);
                }}
                type="button"
                title={`#${t}`}
              >
                #{t}
              </button>
            ))}
            {!expanded && tags.length > 4 && (
              <span className="rounded-full bg-white/5 px-2 py-1 text-white/70">+{tags.length - 4}</span>
            )}
          </div>
        )}

        {showMore && (
          <button
            type="button"
            className="mt-2 text-sm font-semibold text-white/90 hover:text-white"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setExpanded((v) => !v);
            }}
          >
            {expanded ? "Ẩn" : "Thêm"}
          </button>
        )}
      </div>
    </div>
  );
}
