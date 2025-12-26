import React, { useContext } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";
import { UploadContext, useUpload } from "@/hooks/upload/useUploadVideo";
import CircularProgress from "./CircularProgress";


interface Props {
    file?: File;
    handleCancel: () => void;
    thumbnail?: string;
}

const UploadPreview: React.FC<Props> = ({file, handleCancel, thumbnail }) => {

    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const {user} = useAuth();
    const navigate = useNavigate();

    const {uploadVideo, uploading, progress} = useUpload();
    const handlePublish = async () => {
        if (!file) return;

        try {
            await uploadVideo(user?.id, title.trim(), description.trim(), file);
            handleCancel();
            navigate(`/users/${user?.username}`);
        } catch (err) {
            console.error('Upload failed:', err);
        } 
    }
    return (
        <div className="text-center rounded-xl m-auto max-w-screen-xl text-white gap-y-10 flex flex-col">
            {uploading && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="flex flex-col items-center gap-4">
                        <CircularProgress progress={progress} size={100} strokeWidth={8} />
                        <p className="text-white text-lg font-semibold">Uploading... {progress}%</p>
                    </div>
                </div>
            )}
            
            <div className="flex justify-between p-5 bg-[#181C32] items-center">
                <div className="flex ">
                    <div className="w-25 h-35 bg-black rounded-sm overflow-hidden flex items-center justify-center">
                        <img 
                            src={thumbnail} 
                            alt="" 
                            className="w-full h-full object-cover"
                        />
                    </div>
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

            <div className="flex flex-col p-5 bg-[#181C32] justify-start gap-y-6">
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


        </div>
    );

}

export default UploadPreview;