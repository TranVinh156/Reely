import FeedList from "../features/feed/FeedList";
import Sidebar from "../components/Layout/Sidebar";
import "@/styles/feedSnap.css";
import ActionBar from "@/components/Layout/ActionBar";

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-primary text-white">
      <div className="flex gap-6">
        <Sidebar />
        <div className="flex-1">
          {/* Scroll container for feed with CSS scroll-snap */}
          <div className="feed-snap" data-feed-scroller>
            <FeedList />
          </div>
        </div>
      </div>
      <ActionBar />
    </div>
  );
}
