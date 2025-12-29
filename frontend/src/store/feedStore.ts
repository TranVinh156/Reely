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
  setLiked: (id: string, liked: boolean) => void;
  hydrateLiked: (entries: Record<string, boolean>) => void;
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
  setLiked: (id: string, liked: boolean) =>
    set((s) => ({ liked: { ...s.liked, [id]: liked } })),
  hydrateLiked: (entries: Record<string, boolean>) =>
    set((s) => {
      if (!entries || Object.keys(entries).length === 0) return s;
      // don't overwrite user actions already recorded in the store
      const next = { ...s.liked };
      for (const [id, liked] of Object.entries(entries)) {
        if (!Object.prototype.hasOwnProperty.call(next, id)) {
          next[id] = liked;
        }
      }
      return { liked: next };
    }),
  toggleSave: (id: string) =>
    set((s) => ({ saved: { ...s.saved, [id]: !s.saved[id] } })),
}));
