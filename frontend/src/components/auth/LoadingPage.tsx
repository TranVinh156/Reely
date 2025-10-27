import type React from "react";

const LoadingPage: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <p className="text-xl text-gray-700">Loading...</p>
            </div>
        </div>
    )
}

export default LoadingPage