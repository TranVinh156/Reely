export interface User {
  id: string;
  username: string;
  avatar: string;
}

// export interface VideoFeedItem {
//   id: string;
//   userId: string;
//   title: string;
//   defaultRenditionId: string;
//   viewCount: number;
//   likeCount: number;
//   commentCount: number;
//   createdAt: string;
//   authorDisplayName: string;
//   authorAvatarUrl: string;
//   defaultRenditionUrl: string;
// }

export interface Video {
  id: string;
  user: User;
  src: string; // url to video (mp4/hls)
  poster: string; // poster image
  description: string;
  likes: number;
  comments: number;
  views: number;
  shares: number;
  duration: number; // seconds
  tags: string[]; // array of tags
  isLiked?: boolean;
}
export interface FeedResponse {
  videos: Video[];
  hasMore: boolean;
  nextCursor?: string;
}
