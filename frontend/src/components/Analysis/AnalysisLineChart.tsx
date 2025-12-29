import { getCommentStat, getLikeStat, getViewStat } from "@/api/analysis";
import { div } from "motion/react-client";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface Stat {
    date: string,
    count: number
}

const AnalysisLineChart: React.FC<{activeBar: string, searchTime: string}> = ({activeBar, searchTime}) => {
    const [likeData, setLikeData] = useState<Stat[]>([]);
    const [commentData, setCommentData] = useState<Stat[]>([]);
    const [viewData, setViewData] = useState<Stat[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const [likesResult, commentsResult, viewsResult] = await Promise.all([
                getLikeStat(parseInt(searchTime)),
                getCommentStat(parseInt(searchTime)),
                getViewStat(parseInt(searchTime))
            ]);

            setLikeData(likesResult);
            setCommentData(commentsResult);
            setViewData(viewsResult);
        }
        fetchData();
    }, [searchTime])


  return (
    <>
        {activeBar === 'views' && (
        <div className="w-full h-80 bg-white pb-10 pr-4 rounded-xl shadow-md border border-gray-200">
            <h3 className="pl-4 text-lg font-bold text-gray-700 mb-4">Views</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                data={viewData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" allowDecimals={false}/>
                <Tooltip />
                <Legend />
                <Line 
                    type="monotone" 
                    dataKey="count" 
                    name="Views" 
                    stroke="#10b981" 
                    activeDot={{ r: 4 }} 
                    strokeWidth={1}
                />
                </LineChart>
            </ResponsiveContainer>
        </div>
        )}

        {activeBar === 'likes' && (
        <div className="w-full h-80 bg-white pb-10 pr-4 rounded-xl shadow-md border border-gray-200">
            <h3 className="pl-4 text-lg font-bold text-gray-700 mb-4">Likes</h3>

            {/* 2. ResponsiveContainer: Giúp biểu đồ tự co giãn theo div cha */}
            <ResponsiveContainer width="100%" height="100%">
                
                {/* 3. LineChart: Component chính */}
                <LineChart
                data={likeData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                {/* Lưới nền (kẻ sọc) */}
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                
                {/* Trục X: Hiển thị tên tháng (dùng key 'name') */}
                <XAxis dataKey="date" stroke="#6b7280" />
                
                {/* Trục Y: Tự động tính toán số liệu */}
                <YAxis stroke="#6b7280" 
                allowDecimals={false}/>
                
                {/* Tooltip: Hiển thị chi tiết khi hover chuột */}
                <Tooltip />
                
                {/* Legend: Chú thích màu nào là của ai */}
                <Legend />
                
                {/* Đường vẽ 1: Dữ liệu Việt Nam (vn) */}
                <Line 
                    type="monotone" // Đường cong mềm
                    dataKey="count" // Lấy dữ liệu từ key 'vn'
                    name="Likes" // Tên hiển thị trong Legend/Tooltip
                    stroke="#8884d8" // Màu đường
                    activeDot={{ r: 4 }} // Dấu chấm to lên khi hover
                    strokeWidth={1}
                />
                
                
                </LineChart>
            </ResponsiveContainer>
        </div>
        )}

        {activeBar === 'comments' && (
            <div className="w-full h-80 bg-white pb-10 pr-4 rounded-xl shadow-md border border-gray-200">
            <h3 className="pl-4 text-lg font-bold text-gray-700 mb-4">Comments</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                data={commentData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" 
                allowDecimals={false}/>
                <Tooltip />
                <Legend />
                <Line 
                    type="monotone" 
                    dataKey="count"
                    name="Comment" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                    strokeWidth={2}
                />               
                </LineChart>
            </ResponsiveContainer>
        </div>
        )
        }
    </>
    
    
  );
}

export default AnalysisLineChart;