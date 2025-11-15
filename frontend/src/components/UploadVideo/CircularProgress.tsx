import { progress, svg } from "motion/react-client"

type Props = {
    progress: number,
    size: number,
    strokeWidth: number
}


const CircularProgress = ({progress, size = 80, strokeWidth = 6}: Props) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference

    return (
        <svg width={size} height={size}>
            <circle
            cx={size / 2}
            cy={size / 2}
            r={radius} 
            fill="transparent"
            strokeWidth={strokeWidth}
            stroke="#e5e7eb"

            />    

            <circle 
            cx={size / 2}
            cy={size / 2}
            r={radius} 
            fill="transparent"
            strokeWidth={strokeWidth}
            stroke="#ef4444"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - 200}
            style={{ transition: "stroke-dashoffset 0.2s ease",
                    transform: "rotate(-90deg)",
                    transformOrigin: "50% 50%"
             }}
            />
        </svg>
    )

}       
export default CircularProgress;
