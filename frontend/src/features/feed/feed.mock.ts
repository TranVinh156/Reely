import type { FeedResponse } from "../../types/video";

const MOCK_VIDEOS = Array.from({ length: 20 }).map((_, i) => ({
  id: `${i}`,
  user: {
    id: `u${i}`,
    username: `user_${i}`,
    avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
  },
  // assuming public/videos/sample1.mp4 etc exist
  src: `/videos/sample${(i % 3) + 1}.mp4`,
  poster: `/posters/poster${(i % 3) + 1}.jpg`,
  description: `Video demo số ${i + 1}`,
  likes: Math.floor(Math.random() * 1000),
  comments: Math.floor(Math.random() * 100),
  shares: Math.floor(Math.random() * 50),
  duration: 20 + (i % 40), // seconds
}));

export async function fetchFeedMock(cursor?: string, pageSize = 5): Promise<FeedResponse> {
  // simulate network latency
  await new Promise((res) => setTimeout(res, 600));
  const start = cursor ? parseInt(cursor, 10) : 0;
  const next = start + pageSize;
  return {
    videos: MOCK_VIDEOS.slice(start, next),
    hasMore: next < MOCK_VIDEOS.length,
    nextCursor: String(next),
  };
}

export async function fetchVideoMock(id: string) {
  await new Promise((res) => setTimeout(res, 200));
  return MOCK_VIDEOS.find((v) => v.id === id) ?? null;
}