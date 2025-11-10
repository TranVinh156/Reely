import type React from "react";

const ForbiddenPage: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
                <p className="text-xl text-gray-700">Forbidden</p>
                <p className="text-gray-500 mt-2">You don't have permission to access this page.</p>
            </div>
        </div>
    )
}

export default ForbiddenPage