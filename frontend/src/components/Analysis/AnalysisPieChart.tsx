import { getLikeStatAge } from "@/api/analysis";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AgeData {
    ageGroup: string;
    count: Number;
}
const AnalysisPieChart : React.FC = () => {

    const [data, setData] = useState<AgeData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getLikeStatAge();
            let AgeData = [
                { ageGroup: '< 18', count: 0 },
                { ageGroup: '18-24', count: 0 },
                { ageGroup: '25-34', count: 0 },
                { ageGroup: '35-44', count: 0 },
                { ageGroup: '45+', count: 0 },
            ];
            for (const age of response) {
                if (age < 18) {
                    AgeData[0].count += 1;
                } else if (age <= 24) {
                    AgeData[1].count += 1;
                } else if (age <=34 ) {
                    AgeData[2].count += 1;
                } else if (age <=44 ) {
                    AgeData[3].count += 1;
                } else {
                    AgeData[4].count += 1;
                }
            }
            
            setData(AgeData);
        }
        fetchData();
    }, [])
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
    return (
        <div className="w-full h-80 lg:flex-[2] bg-white pl-5 pb-10 rounded-xl shadow-md border border-gray-200">
            <h3 className="font-bold text-lg text-gray-700">Age</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                <Pie
                    data={data as any[]}
                    cx="50%" // Căn giữa
                    cy="50%"
                    innerRadius={60} 
                    outerRadius={80} 
                    paddingAngle={2} 
                    dataKey="count"
                    nameKey="ageGroup"
                >
                    {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );

}

export default AnalysisPieChart;
