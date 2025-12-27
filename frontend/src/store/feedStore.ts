import { create } from "zustand";

interface FeedState {
  autoScroll: boolean;
  autoPlay: boolean;
  subtitleOn: boolean;
  liked: Record<string, boolean>;
  saved: Record<string, boolean>;
  currentIndex: number;
  setCurrentIndex: (i: number) => void
  toggleAutoScroll: () => void;
  toggleAutoPlay: () => void;
  toggleSubtitle: () => void;
  toggleLike: (id: string) => void;
  toggleSave: (id: string) => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  autoScroll: true,
  autoPlay: true,
  subtitleOn: false,
  liked: {},
  saved: {},
  currentIndex: 0,
  setCurrentIndex: (i) => set(() => ({ currentIndex: i })),
  toggleAutoScroll: () => set((s) => ({ autoScroll: !s.autoScroll })),
  toggleAutoPlay: () => set((s) => ({ autoPlay: !s.autoPlay })),
  toggleSubtitle: () => set((s) => ({ subtitleOn: !s.subtitleOn })),
  toggleLike: (id: string) =>
    set((s) => ({ liked: { ...s.liked, [id]: !s.liked[id] } })),
  toggleSave: (id: string) =>
    set((s) => ({ saved: { ...s.saved, [id]: !s.saved[id] } })),
}));
