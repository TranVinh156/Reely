import { getTotalComment, getTotalLike, getTotalView } from "@/api/analysis";
import { button, div } from "motion/react-client";
import React, { use, useEffect, useState } from "react";

const AnalysisOption: React.FC<{activeBar: string, setActiveBar: React.Dispatch<React.SetStateAction<string>>}> = ({activeBar, setActiveBar}) => {

    const [likes, setLike] = useState(0);
    const [comments, setComment] = useState(0);
    const [views, setView] = useState(0);
    const [shares, setShare] = useState(0);

    useEffect(() => {
            const fetchData = async () => {
                const [likesResult, commentsResult, viewsResult] = await Promise.all([
                    getTotalLike(),
                    getTotalComment(),
                    getTotalView()
                ]);
    
                setLike(likesResult);
                setComment(commentsResult);
                setView(viewsResult)
            }
            fetchData();
        }, [])
    

    const options = [
        { 
            id: 'views', 
            label: 'Views', 
            value: views
        },
        {
            id: 'likes',
            label: 'Likes',
            value: likes

        }, 
        {
            id: 'comments',
            label: 'Comments',
            value: comments
        }
       ]

       
    return (
        <div className="flex flex-col sm:flex-row w-full rounded-sm bg-[#161823] shadow-sm mb-5">
            { options.map((item, index) => {
                const isActive = item.id == activeBar;

                return (
                    <button 
                        key={item.id}
                        onClick={() => setActiveBar(item.id)}
                        className={`flex-1 flex flex-col items-center justify-center py-4 px-2 cursor-pointer relative border-b border-white/15
                        hover:shadow-[inset_0_3px_0_0_#dfdede8f] 
                        ${index !== options.length - 1 ? 'sm:border-r' : ''}
                        `}
                    >
                        {isActive && (
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#FE2C55]" />
                        )}

                        <div className={`font-semibold text-base  ${item.id === activeBar ? 'text-white' : 'text-white/85'}`} >
                            {item.label}
                        </div>

                        <div className={`text-2xl ${item.id === activeBar ? 'text-white' : 'text-white/85'} `}>
                            {item.value}
                        </div>

                    </button>
                )
                
            })

            }
        </div>
    )
}

export default AnalysisOption;