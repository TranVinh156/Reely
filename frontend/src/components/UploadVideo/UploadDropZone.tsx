import React, { useState, useRef } from 'react';
import { FileUp, FolderClosed, FolderClosedIcon, Lightbulb, Video } from 'lucide-react';

interface Props {
  onFileSelect: (file: File) => void;
}

const UploadDropZone: React.FC<Props> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    console.log(dragCounter.current + " enter");
    setIsDragging(true);
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    console.log(dragCounter.current + " leave");
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }

  return (
    <div className='text-white'>
      <div
        className={`upload-dropzone mt-20 p-8 sm:p-16 md:p-20 lg:p-25 text-center rounded-xl m-auto max-w-screen-xl bg-[#181C32]  border-2 border-dashed transition-all duration-200 ${
          isDragging 
            ? 'border-white/40 scale-[1.01]' 
            : 'border-white/10 hover:border-white/40'
          }`}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
          onDragEnter={handleDragEnter}
        >
          <div className={`flex items-center justify-center mb-6 transition-transform duration-200`}>
              <div className='rounded-full bg-gray-800 p-6'>
                  <FileUp size={50} color='#FE2C55' opacity={0.9} className='sm:w-[70px] sm:h-[70px] md:w-[80px] md:h-[80px]'/>
              </div>  
          </div>
          <p className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">Select the video to upload</p>
          <p className="pb-10 text-base sm:text-lg">Or drag and drop here</p>
          <input type="file" accept="video/*" className="hidden" id="fileInput" onChange={handleChange} />
          <label htmlFor="fileInput" className="btn text-sm sm:text-lg mt-4 cursor-pointer bg-[#FE2C55] text-white hover:bg-[#FE2C55]/80 hover:text-white/80 px-6 py-2 rounded">
              Select Video
          </label>
      </div>

      <div className='flex mt-10 m-auto max-w-screen-xl gap-10'>
        <div className='flex gap-3 flex-1'>
          <Video className='mt-0.5'/>
          <div>
            <h3 className='font-bold text-lg'>Capacity and duration</h3>
            <p className='text-white/80'>Maximum storage capacity: 30 GB, video duration: 60 minutes. </p>
          </div>
        </div>

        <div className='flex gap-3 flex-1'>
          <FolderClosedIcon className='mt-0.5'/>
          <div>
            <h3 className='font-bold text-lg'>Capacity and duration</h3>
            <p className='text-white/80'>Suggested format: “.mp4”. Other major formats are supported. </p>
          </div>
        </div>

        <div className='flex gap-3 flex-1'>
          <Lightbulb className='mt-0.5'/>
          <div>
            <h3 className='font-bold text-lg'>Aspect ratio</h3>
            <p className='text-white/80'  >Suggested aspect ratio: 16:9 for landscape mode, 9:16 for portrait mode. </p>
          </div>
        </div>
        
        
      </div>
    </div>
    
  );
};

export default UploadDropZone;