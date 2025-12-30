import { getVideoById } from "@/api/video"
import { useQuery } from "@tanstack/react-query"

export const useGetVideoById = (id: number) => {
    return useQuery({
        queryKey: ['videos', id],
        queryFn: () => getVideoById(id),
        staleTime: 5 * 60 * 1000
    })
}