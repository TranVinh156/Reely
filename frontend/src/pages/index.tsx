import React from "react";
import FeedList from "../features/feed/FeedList";
import Topbar from "../components/Layout/Topbar";
import Sidebar from "../components/Layout/Sidebar";

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="flex gap-6">
        <Sidebar />
        <main className="flex-1">
          <FeedList />
        </main>
      </div>
    </div>
  );
}
