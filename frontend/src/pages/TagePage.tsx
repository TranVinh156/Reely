import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/Layout/Sidebar";
import { fetchVideosByTag } from "../api/search";
import SearchVideoCard from "../components/Search/SearchVideoCard";

export default function TagPage() {
  const navigate = useNavigate();
  const params = useParams();
  const tagName = useMemo(() => decodeURIComponent(params.tagName ?? ""), [params.tagName]);

  const q = useQuery({
    queryKey: ["tag", tagName],
    queryFn: () => fetchVideosByTag(tagName, 0, 20),
    enabled: !!tagName,
  });

  return (
    <div className="bg-primary min-h-screen text-white">
      <div className="flex gap-6">
        <Sidebar />
        <div className="flex-1">
          <div className="bg-primary/95 sticky top-0 z-10 border-b border-white/10 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 p-3">
              <div>
                <div className="text-sm text-white/60">Hashtag</div>
                <div className="text-xl font-semibold">#{tagName}</div>
              </div>
              <button
                className="rounded-xl bg-white/10 px-4 py-3 text-sm hover:bg-white/15"
                onClick={() => navigate(-1)}
              >
                Back
              </button>
            </div>
            <div className="mx-auto max-w-7xl px-3 pb-3 text-sm text-white/60">
              Sorted by relevance (engagement).
            </div>
          </div>

          <div className="mx-auto max-w-7xl p-3">
            {q.isLoading ? (
              <div className="text-white/70">Loading…</div>
            ) : q.data?.content?.length ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {q.data.content.map((v) => (
                  <SearchVideoCard key={v.videoId} v={v} />
                ))}
              </div>
            ) : (
              <div className="text-white/70">No videos found for this tag.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
