import React from "react";
import { X } from "lucide-react";

interface Props {
    file?: File;
    handleCancel: () => void;
    thumbnail?: string;
}

const UploadPreview: React.FC<Props> = ({ file, handleCancel, thumbnail }) => {

    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");

    return (
        <div className="text-center rounded-xl m-auto max-w-screen-xl text-white gap-y-10 flex flex-col">
            <div className="flex justify-between p-5 bg-[#181C32] items-center">
                <div className="flex ">
                    <img src={thumbnail} alt="" className="w-25 h-35 rounded-sm"/>
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
                    <button className="bg-[#FE2C55] cursor-pointer hover:bg-[#FE2C55]/80 text-white font-semibold py-2 px-4 rounded flex-1">
                        Publish Video
                    </button>
                    <button 
                    onClick={handleCancel}
                    className="bg-gray-600 cursor-pointer hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded flex-1" >
                    Cancel
                    </button>
                    
                </div>

                
            </div>


        </div>
    );

}

export default UploadPreview;