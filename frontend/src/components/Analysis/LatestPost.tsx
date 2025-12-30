import { get5LastestVideo, type Video } from "@/api/analysis";
import { formatTimestamp } from "@/utils/formatTimestamp";
import React, { useEffect, useState } from "react";
import { Eye, Heart, MessageCircle, Calendar } from "lucide-react";
import { NavLink } from "react-router-dom";

const LatestPost: React.FC = () => {
    const [data, setData] = useState<Video[]>([]);

    useEffect(() => {
        const fetchData = async () => {
                const videoResult = await get5LastestVideo()
                const newVideos = videoResult.map((video) => {
                    video.createdAt = formatTimestamp(video.createdAt)
                    console.log(video.createdAt)
                    return video;
                })
                setData(newVideos);
            }
            fetchData();
    }, [])
    
    return (
        <div className="lg:flex-[3] w-full bg-white rounded-xl p-6 h-80 overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Latest Videos</h2>
            <div className="flex flex-col">
                {data.map((video, index) => (
                    <NavLink to={`/videos/${video.id}`} key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-300">
                        <div className="flex-1 min-w-0 mr-4">
                            <h3 className="text-gray-700 font-medium truncate text-sm hover:underline" title={video.title}>
                                {video.title || "Untitled Video"}
                            </h3>
                            <div className="flex items-center text-gray-400 text-xs mt-1">
                                <Calendar size={12} className="mr-1" />
                                <span>{video.createdAt}</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs font-medium">
                            <div className="flex items-center text-gray-300 min-w-[40px]" title="Views">
                                <Eye size={14} className="mr-1 text-fill-gray-300" />
                                <span>{video.viewCount}</span>
                            </div>
                            <div className="flex items-center text-gray-300 min-w-[40px]" title="Likes">
                                <Heart size={14} className="mr-1 fill-gray-300" />
                                <span>{video.likeCount}</span>
                            </div>
                            <div className="flex items-center text-gray-300 min-w-[40px]" title="Comments">
                                <MessageCircle size={14} className="mr-1 fill-gray-300" />
                                <span>{video.commentCount}</span>
                            </div>
                        </div>
                    </NavLink>
                ))}
                
                {data.length === 0 && (
                    <div className="text-center text-gray-500 py-8 text-sm">
                        No videos found
                    </div>
                )}
            </div>
        </div>
    );
};

export default LatestPost;