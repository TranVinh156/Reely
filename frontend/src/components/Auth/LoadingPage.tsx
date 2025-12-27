import type React from "react";
import { Loader2, LoaderCircle } from "lucide-react";

const LoadingPage: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center flex flex-col items-center gap-4">
                <LoaderCircle className="animate-spin"/>
                <p className="text-xl text-white font-medium">Loading...</p>
            </div>
        </div>
    )
}

export default LoadingPage