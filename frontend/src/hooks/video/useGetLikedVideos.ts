import { useInfiniteQuery } from "@tanstack/react-query";
import { getLikedVideosOfUser } from "@/api/video";

export const useGetLikedVideos = (userId: number, size: number = 10) => {
    return useInfiniteQuery({
        queryKey: ["liked-videos", userId, size],
        queryFn: ({ pageParam = 0 }) => getLikedVideosOfUser(userId, pageParam, size),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            if (lastPage.pageNumber + 1 < lastPage.totalPages) {
                return lastPage.pageNumber + 1;
            }
            return undefined;
        },
        enabled: !!userId,
    });
};
