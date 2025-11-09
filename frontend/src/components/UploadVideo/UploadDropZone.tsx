import React from 'react';
import { FileUp } from 'lucide-react';

interface Props {
  onFileSelect: (file: File) => void;
}

const UploadDropZone: React.FC<Props> = ({ onFileSelect }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  };

  return (
    <div
      className="upload-dropzone p-25 text-center rounded-xl m-auto max-w-screen-xl bg-[#181C32] text-white "
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
        <div className='flex items-center justify-center mb-6'>
            <div className='rounded-full bg-gray-800 p-6'>
                <FileUp size={80} color='#FE2C55' opacity={0.9}/>
            </div>  
        </div>
        <p className="text-2xl font-semibold mb-2">Drag and drop your video here</p>
        <p className="pb-10 text-lg">or click to browse from your device</p>
        <input type="file" accept="video/*" className="hidden" id="fileInput" onChange={handleChange} />
        <label htmlFor="fileInput" className="btn mt-4 cursor-pointer bg-[#FE2C55] text-white hover:bg-[#FE2C55]/80 hover:text-white/80 px-6 py-2 rounded">
            Select Video
        </label>

        <p className="mt-6 text-sm text-white/60">Supported formats: MP4, AVI, MOV. Max size: 100MB.</p>
    </div>
  );
};

export default UploadDropZone;