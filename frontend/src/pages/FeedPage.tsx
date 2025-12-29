import FeedList from "../features/feed/FeedList";
import Sidebar from "../components/Layout/Sidebar";
import "@/styles/feedSnap.css";
import ActionBar from "@/components/Layout/ActionBar";
import { useAuth } from "@/hooks/auth/useAuth";
import React, { useEffect } from "react";
import type { FeedMode } from "@/api/feed";

export default function FeedPage() {
  const { user } = useAuth();
  const [mode, setMode] = React.useState<FeedMode>(() =>
    user ? "personal" : "public",
  );

  useEffect(() => {
    if (!user && mode === "personal") setMode("public");
  }, [user, mode]);

  return (
    <div className="bg-primary min-h-screen text-white">
      <div className="flex gap-6">
        <Sidebar />
        <div className="flex-1">
          <div className="bg-primary/95 sticky top-0 z-10 border-b border-white/10 backdrop-blur">
            <div className="mx-auto flex max-w-2xl items-center gap-2 p-3">
              <button
                className={`rounded-full px-4 py-2 text-sm ${mode === "personal" ? "bg-white/15" : "bg-white/5 hover:bg-white/10"}`}
                onClick={() => setMode(user ? "personal" : "public")}
              >
                For You
              </button>
              <button
                className={`rounded-full px-4 py-2 text-sm ${mode === "trending" ? "bg-white/15" : "bg-white/5 hover:bg-white/10"}`}
                onClick={() => setMode("trending")}
              >
                Trending
              </button>
              <button
                className={`rounded-full px-4 py-2 text-sm ${mode === "public" ? "bg-white/15" : "bg-white/5 hover:bg-white/10"}`}
                onClick={() => setMode("public")}
              >
                Public
              </button>
            </div>
          </div>
          {/* Scroll container for feed with CSS scroll-snap */}
          <div className="feed-snap" data-feed-scroller>
            <FeedList mode={mode} />
          </div>
        </div>
      </div>
      <ActionBar />
    </div>
  );
}
