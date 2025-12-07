import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserVideos } from "@/api/video";

export const useGetUserVideos = (userId: number, size: number = 10) => {
    return useInfiniteQuery({
        queryKey: ["user-videos", userId, size],
        queryFn: ({ pageParam = 0 }) => getUserVideos(userId, pageParam, size),
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
