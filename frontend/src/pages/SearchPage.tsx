import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/Layout/Sidebar";
import LoadingPage from "@/components/Auth/LoadingPage";
import { searchTags, searchUsers, searchVideos } from "../api/search";
import SearchVideoCard from "../components/Search/SearchVideoCard";

type Tab = "videos" | "users" | "tags";

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`rounded-full px-4 py-2 text-sm ${active ? "bg-white/15" : "bg-white/5 hover:bg-white/10"
        }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default function SearchPage() {
  const navigate = useNavigate();
  const [sp, setSp] = useSearchParams();
  const qParam = sp.get("q") ?? "";
  const tabParam = (sp.get("tab") as Tab | null) ?? "videos";

  const [q, setQ] = useState(qParam);
  useEffect(() => setQ(qParam), [qParam]);

  // Debounce: update URL 300ms after typing
  useEffect(() => {
    const t = setTimeout(() => {
      const next = new URLSearchParams(sp);
      if (q.trim()) next.set("q", q.trim());
      else next.delete("q");
      if (tabParam) next.set("tab", tabParam);
      setSp(next, { replace: true });
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const tab: Tab = useMemo(() => {
    if (tabParam === "users" || tabParam === "tags") return tabParam;
    return "videos";
  }, [tabParam]);

  const canSearch = (qParam ?? "").trim().length > 0;

  const videosQuery = useQuery({
    queryKey: ["search", "videos", qParam],
    queryFn: () => searchVideos(qParam, 0, 12),
    enabled: canSearch && tab === "videos",
  });
  const usersQuery = useQuery({
    queryKey: ["search", "users", qParam],
    queryFn: () => searchUsers(qParam, 0, 20),
    enabled: canSearch && tab === "users",
  });
  const tagsQuery = useQuery({
    queryKey: ["search", "tags", qParam],
    queryFn: () => searchTags(qParam, 0, 30),
    enabled: canSearch && tab === "tags",
  });

  const setTab = (t: Tab) => {
    const next = new URLSearchParams(sp);
    next.set("tab", t);
    setSp(next, { replace: true });
  };

  return (
    <div className="bg-primary min-h-screen text-white">
      <div className="flex gap-6">
        <Sidebar />
        <div className="flex-1 mt-3">
          <div className="bg-primary/95 sticky top-0 z-10 backdrop-blur">
            <div className="flex md:hidden mx-auto max-w-3xl items-center gap-2 p-3">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search videos, users, tags"
                className="w-full rounded-xl bg-white px-4 py-3 text-sm text-black placeholder:text-gray-500"
                onKeyDown={(e) => {
                  if (e.key === "Escape") setQ("");
                }}
                autoFocus
              />
              <button
                className="rounded-xl bg-white/10 px-4 py-3 text-sm hover:bg-white/15"
                onClick={() => navigate("/")}
              >
                Cancel
              </button>
            </div>
            <div className="mx-auto flex max-w-3xl items-center gap-2 px-3 pb-3">
              <TabButton active={tab === "videos"} label="Videos" onClick={() => setTab("videos")} />
              <TabButton active={tab === "users"} label="Users" onClick={() => setTab("users")} />
              <TabButton active={tab === "tags"} label="Tags" onClick={() => setTab("tags")} />
            </div>
          </div>

          <div className="mx-auto max-w-3xl p-3">
            {!canSearch ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
                Type something to search.
              </div>
            ) : tab === "videos" ? (
              <div>
                {videosQuery.isLoading ? (
                  <LoadingPage />
                ) : videosQuery.data?.content?.length ? (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {videosQuery.data.content.map((v) => (
                      <SearchVideoCard key={v.videoId} v={v} />
                    ))}
                  </div>
                ) : (
                  <div className="text-white/70">No videos found.</div>
                )}
              </div>
            ) : tab === "users" ? (
              <div>
                {usersQuery.isLoading ? (
                  <LoadingPage />
                ) : usersQuery.data?.content?.length ? (
                  <div className="flex flex-col gap-2">
                    {usersQuery.data.content.map((u) => (
                      <button
                        key={u.id}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left hover:bg-white/10"
                        onClick={() => navigate(`/users/${u.username}`)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-white/10" />
                          <div className="min-w-0">
                            <div className="truncate font-semibold">{u.displayName || u.username}</div>
                            <div className="truncate text-sm text-white/70">@{u.username}</div>
                          </div>
                        </div>
                        {!!u.bio && <div className="mt-2 line-clamp-2 text-sm text-white/70">{u.bio}</div>}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-white/70">No users found.</div>
                )}
              </div>
            ) : (
              <div>
                {tagsQuery.isLoading ? (
                  <LoadingPage />
                ) : tagsQuery.data?.content?.length ? (
                  <div className="flex flex-col gap-2">
                    {tagsQuery.data.content.map((t) => (
                      <button
                        key={t.id}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left hover:bg-white/10"
                        onClick={() => navigate(`/tags/${encodeURIComponent(t.name)}`)}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="font-semibold">#{t.name}</div>
                          <div className="text-sm text-white/60">{Number(t.videoCount ?? 0)} videos</div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-white/70">No tags found.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
