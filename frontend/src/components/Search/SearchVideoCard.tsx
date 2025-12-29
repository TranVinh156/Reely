import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import type { SearchVideoDTO } from "@/api/search";
import { resolveMediaUrl } from "@/utils/media";

export default function SearchVideoCard({ v }: { v: SearchVideoDTO }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const title = v.title ?? v.description ?? "(No title)";
  const tags = useMemo(() => (v.tags ?? []).filter(Boolean), [v.tags]);

  const showMore = useMemo(() => {
    const descLen = (v.description ?? "").trim().length;
    return descLen > 90 || tags.length > 4;
  }, [tags.length, v.description]);

  const visibleTags = expanded ? tags : tags.slice(0, 4);

  return (
    <button
      className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left hover:bg-white/10"
      onClick={() => window.open(resolveMediaUrl(v.videoUrl), "_blank")}
      title="Open video"
    >
      <div className="flex items-start gap-3">
        <div className="h-18 w-14 shrink-0 rounded-xl bg-white/10" />
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold">{title}</div>
          <div className="mt-1 truncate text-sm text-white/70">@{v.username}</div>

          {!!v.description && (
            <div className={`mt-2 text-sm text-white/80 ${expanded ? "" : "line-clamp-2"}`}>
              {v.description}
            </div>
          )}

          {!!visibleTags.length && (
            <div className={`mt-2 flex flex-wrap gap-2 ${expanded ? "" : "line-clamp-1"}`}>
              {visibleTags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-white/10 px-2 py-1 text-xs text-white/80 hover:bg-white/15"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate(`/tags/${encodeURIComponent(t)}`);
                  }}
                >
                  #{t}
                </span>
              ))}
              {!expanded && tags.length > 4 && (
                <span className="rounded-full bg-white/5 px-2 py-1 text-xs text-white/70">
                  +{tags.length - 4}
                </span>
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
                setExpanded((x) => !x);
              }}
            >
              {expanded ? "Ẩn" : "Thêm"}
            </button>
          )}
        </div>
      </div>
    </button>
  );
}
