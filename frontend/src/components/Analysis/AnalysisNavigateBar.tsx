import React, { useState } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import { NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";


const AnalysisNavigateBar: React.FC<{searchTime:string, setSearchTime: React.Dispatch<React.SetStateAction<string>>}> = ({searchTime, setSearchTime}) => {
    const { user } = useAuth();
    const storageUrl = 'http://localhost:9000'

    return (
        <nav className="flex items-center justify-between p-4 bg-[#181C32] text-white ">
            <div className="flex items-center justify-end w-full px-2 gap-4 md:gap-20">
                <div className="relative flex">
                        <select value={searchTime}
                            onChange={(e) => setSearchTime(e.target.value)}
                            className="bg-black/40 w-45 p-2 rounded-lg text-white focus:outline-none appearance-none cursor-pointer pr-10 border-0 ">
                                <option value="7" className="bg-[#181C32]">Last 7 Days</option>
                                <option value="30" className="bg-[#181C32]">Last 30 Days</option>
                                <option value="365" className="bg-[#181C32]">Last 365 Days</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
                </div>
            </div>
        </nav>
    );
}

export default AnalysisNavigateBar;