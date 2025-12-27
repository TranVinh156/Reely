import React, { useContext, useEffect, useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";
import { UploadContext, useUpload } from "@/hooks/upload/useUploadVideo";
import CircularProgress from "./CircularProgress";


interface Props {
    file?: File;
    handleCancel: () => void;
    thumbnail?: string;
    confirmCancel: () => void;
}

const UploadPreview: React.FC<Props> = ({file, handleCancel, thumbnail, confirmCancel }) => {

    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [visibility, setVisibility] = useState("PUBLIC")
    const {user} = useAuth();
    const navigate = useNavigate();

    const {uploadVideo, uploading, progress} = useUpload();
    
    const videoUrl = React.useMemo(() => {
        return file ? URL.createObjectURL(file) : undefined;
    }, [file]);

    React.useEffect(() => {
        return () => {
            if (videoUrl) {
                URL.revokeObjectURL(videoUrl);
            }
        };
    }, [videoUrl]);

    React.useEffect(() => {
        window.history.pushState(null, "", window.location.href);

        const handlePopState = (event: PopStateEvent) => {
            window.history.pushState(null, "", window.location.href);
            handleCancel();
        };

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = "";
        };

        window.addEventListener("popstate", handlePopState);
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("popstate", handlePopState);
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);
    
    const handlePublish = async () => {
        if (!file) return;

        try {
            await uploadVideo(user?.id, title.trim(), description.trim(), visibility, file);
            confirmCancel();
            navigate(`/users/${user?.username}`);
        } catch (err) {
            console.error('Upload failed:', err);
        } 
    }

    return (
        <div className="text-center mt-20 rounded-xl m-auto max-w-screen-xl text-white gap-y-10 flex flex-col">
            {uploading && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="flex flex-col items-center gap-4">
                        <CircularProgress progress={progress} size={100} strokeWidth={8} />
                        <p className="text-white text-lg font-semibold">Uploading... {progress}%</p>
                    </div>
                </div>
            )}
            
            <div className="flex justify-between p-5 bg-[#181C32] items-center rounded-xl">
                <div className="flex ">
                    <div className="flex flex-col justify-center items-start ml-6">
                        <p className="text-base sm:text-lg font-semibold mb-2 text-white truncate">{file?.name}</p>
                        <p className="text-sm sm:text-base text-white/60"> {
                            file ? (<span>Size: {(file.size / (1024 * 1024)).toFixed(2)} MB</span>) : "No file selected"
                        }</p>
                    </div>
                </div>

                <button 
                onClick={handleCancel}
                className="flex items-center cursor-pointer hover:bg-gray-500/20 p-2 rounded-full h-10 w-10 self-start sm:self-auto">
                    <X className="text-white" />
                </button>
            </div>

            <div className="flex gap-5 items-start"> 
                <div className="flex flex-col p-5 bg-[#181C32] justify-start gap-y-10 flex-4 rounded-xl">
                    <div>
                        <label className="block mb-2 font-medium text-gray-300 text-left">
                            Video Title
                        </label>

                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Give your video a catchy title"
                            className="bg-black/40 w-full p-2 rounded-lg text-white focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-300 text-left">
                            Video Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                            placeholder="Tell viewers about your video..."
                            maxLength={2000}
                            rows={4}
                            className="bg-black/40 w-full p-2 rounded-lg text-white focus:outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">{description.length}/2000</p>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-300 text-left">
                            Who can watch this video?
                        </label>
                        <div className="relative flex">
                            <select value={visibility}
                            onChange={(e) => setVisibility(e.target.value)}
                            className="bg-black/40 w-full p-2 rounded-lg text-white focus:outline-none appearance-none cursor-pointer pr-10 flex-1 border-0 ">
                                <option value="PUBLIC" className="bg-[#181C32]">Everybody</option>
                                <option value="PRIVATE" className="bg-[#181C32]">Followers</option>
                                <option value="UNLISTED" className="bg-[#181C32]">Only you</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
                        <button
                            onClick={handlePublish}
                            disabled={uploading || !title.trim()}
                            className="bg-[#FE2C55] cursor-pointer hover:bg-[#FE2C55]/80 text-white font-semibold py-2 px-4 rounded flex-1 disabled:opacity-50 disabled:cursor-not-allowed">
                            Publish Video
                        </button>

                        <div></div>
                        <button 
                        onClick={handleCancel}
                        disabled={uploading}
                        className="bg-gray-600 cursor-pointer hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded flex-1 disabled:opacity-50 disabled:cursor-not-allowed" >
                        Cancel
                        </button>
                    </div>
                </div>

                <div className="aspect-[9/16] bg-black rounded-2xl overflow-hidden flex items-center justify-center flex-2 ">
                    <video
                        src={videoUrl} 
                        className="w-full h-full object-contain"
                        controls
                    />
                </div>
            </div>
        </div>
    );

}

export default UploadPreview;