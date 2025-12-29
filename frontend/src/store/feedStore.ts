import { create } from "zustand";

interface FeedState {
  autoScroll: boolean;
  autoPlay: boolean;
  subtitleOn: boolean;
  liked: Record<string, boolean>;
  saved: Record<string, boolean>;
  commentCounts: Record<string, number>;
  currentIndex: number;
  isActionBarVisible: boolean;
  activeCommentVideoId: string | null;
  setCurrentIndex: (i: number) => void
  setActionBarVisible: (visible: boolean) => void;
  openComment: (id: string) => void;
  closeComment: () => void;
  toggleAutoScroll: () => void;
  toggleAutoPlay: () => void;
  toggleSubtitle: () => void;
  toggleLike: (id: string) => void;
  setLike: (id: string, isLiked: boolean) => void;
  toggleSave: (id: string) => void;
  setCommentCount: (id: string, count: number) => void;
  incrementCommentCount: (id: string) => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  autoScroll: true,
  autoPlay: true,
  subtitleOn: false,
  liked: {},
  saved: {},
  commentCounts: {},
  currentIndex: 0,
  isActionBarVisible: true,
  activeCommentVideoId: null,
  setCurrentIndex: (i) => set(() => ({ currentIndex: i })),
  setActionBarVisible: (visible) => set(() => ({ isActionBarVisible: visible })),
  openComment: (id) => set(() => ({ activeCommentVideoId: id, isActionBarVisible: false })),
  closeComment: () => set(() => ({ activeCommentVideoId: null, isActionBarVisible: true })),
  toggleAutoScroll: () => set((s) => ({ autoScroll: !s.autoScroll })),
  toggleAutoPlay: () => set((s) => ({ autoPlay: !s.autoPlay })),
  toggleSubtitle: () => set((s) => ({ subtitleOn: !s.subtitleOn })),
  toggleLike: (id: string) =>
    set((s) => ({ liked: { ...s.liked, [id]: !s.liked[id] } })),
  setLike: (id: string, isLiked: boolean) =>
    set((s) => ({ liked: { ...s.liked, [id]: isLiked } })),
  toggleSave: (id: string) =>
    set((s) => ({ saved: { ...s.saved, [id]: !s.saved[id] } })),
  setCommentCount: (id, count) =>
    set((s) => ({ commentCounts: { ...s.commentCounts, [id]: count } })),
  incrementCommentCount: (id) =>
    set((s) => ({
      commentCounts: {
        ...s.commentCounts,
        [id]: (s.commentCounts[id] || 0) + 1,
      },
    })),
}));
