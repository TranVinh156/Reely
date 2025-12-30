import FeedList from "../features/feed/FeedList";
import Sidebar from "../components/Layout/Sidebar";
import "@/styles/feedSnap.css";
import ActionBar from "@/components/Layout/ActionBar";
import { useAuth } from "@/hooks/auth/useAuth";
import { useEffect } from "react";
import { useFeedStore } from "@/store/feedStore";

export default function FeedPage() {
  const { user } = useAuth();
  const mode = useFeedStore((s) => s.mode);
  const setMode = useFeedStore((s) => s.setMode);
  const isActionBarVisible = useFeedStore((s) => s.isActionBarVisible);

  useEffect(() => {
    if (user && mode === "public") setMode("personal");
    if (!user && mode === "personal") setMode("public");
  }, [user, mode, setMode]);

  return (
    <div className="bg-primary min-h-screen text-white">
      <div className="flex gap-6">
        <Sidebar />
        <div className="flex-1">
          {/* Scroll container for feed with CSS scroll-snap */}
          <div className="feed-snap" data-feed-scroller>
            <FeedList />
          </div>
        </div>
      </div>
      {isActionBarVisible && <ActionBar />}
    </div>
  );
}
