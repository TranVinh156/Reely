import AnalysisLineChart from "@/components/Analysis/AnalysisLineChart";
import AnalysisNavigateBar from "@/components/Analysis/AnalysisNavigateBar";
import AnalysisOption from "@/components/Analysis/AnalysisOption";
import AnalysisPieChart from "@/components/Analysis/AnalysisPieChart";
import LastestPost from "@/components/Analysis/LatestPost";
import Sidebar from "@/components/Layout/Sidebar";
import React, { useState } from "react";

const Analysis: React.FC = () => {
    const [activeBar, setActiveBar] = useState("views"); 
    const [searchTime, setSearchTime] = useState("7")
    return (
        <div className='flex gap-6 bg-neutral-900'>
            <Sidebar />
            <div className="bg-[#161823] min-h-screen flex-1">
                <AnalysisNavigateBar searchTime={searchTime} setSearchTime={setSearchTime}/>
                <AnalysisOption activeBar={activeBar} setActiveBar={setActiveBar}/>
                <AnalysisLineChart activeBar={activeBar} searchTime={searchTime}/>

                <div className="flex mt-5">
                    <AnalysisPieChart></AnalysisPieChart>
                    <LastestPost>
                    </LastestPost>
                    
                </div>
            </div>              
        </div>
    )
}
export default Analysis;