import axiosClient from "@/utils/axios.client"

interface Stat {
    date: string,
    count: number
}

export interface Video {
    title: string
    viewCount: number
    likeCount: number
    commentCount: number
    createdAt: string
    id: number
}


export const getLikeStat = async (days: number) : Promise<Stat[]> => {
    const response = await axiosClient.get('/likes', {params: {days: days}})
    return response.data
}


export const getCommentStat = async (days: number): Promise<Stat[]> => {
    const response = await axiosClient.get('/comments', {params: {days: days}})
    return response.data
}

export const getViewStat = async (days: number): Promise<Stat[]> => {
    const response = await axiosClient.get('videos/user/stat-views', {params: {days: days}})
    return response.data
}

export const getLikeStatAge = async (): Promise<number[]> => {
    const response = await axiosClient.get('/likes/stat-age');
    return response.data
}

export const getTotalLike = async (): Promise<number> => {
    const response = await axiosClient.get('/videos/user/total-likes');
    return response.data
}

export const getTotalView = async (): Promise<number> => {
    const response = await axiosClient.get('/videos/user/total-views');
    return response.data
}

export const getTotalComment = async (): Promise<number> => {
    const response = await axiosClient.get('/videos/user/total-comments');
    return response.data
}

export const get5LastestVideo = async (): Promise<Video[]> => {
    const response = await axiosClient.get('/videos/users/top5')
    return response.data
}






