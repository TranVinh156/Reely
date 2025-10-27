import FeedList from "../features/feed/FeedList";
import Sidebar from "../components/Layout/Sidebar";
import "@/styles/feedSnap.css";

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="flex gap-6">
        <Sidebar />
        <main className="flex-1">
          {/* Scroll container for feed with CSS scroll-snap */}
          <div className="feed-snap" data-feed-scroller>
            <FeedList />
          </div>
        </main>
      </div>
    </div>
  );
}
