import React from 'react';
import NavigateBarUpload from '../components/UploadVideo/NavigateBarUpload';
import UploadDropZone from '../components/UploadVideo/UploadDropZone';
import UploadPreview from '../components/UploadVideo/UploadPreview';
import { usePreview } from '@/hooks/upload/usePreview';

const UploadVideo: React.FC = () => {
    const { file, preview, handleSelectFile, handleCancel, thumbnail } = usePreview();
    return (
        <div className="upload-container bg-[#161823] min-h-screen"
        onDrop={(e) => {e.preventDefault()}}
        onDragOver={(e) => {e.preventDefault()}}>

            <NavigateBarUpload />
            <div className="text-center text-white pt-15 pb-15 gap-y-6 flex flex-col">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Upload Your Video</h1>
                <p className='text-lg lg:text-xl'>Share your creativity with the world. Upload your short video and let others discover your content.</p>
            </div>
            
        {!preview ? (
            <UploadDropZone onFileSelect={handleSelectFile}/>
        ) : (
            <UploadPreview
            file={file}
            handleCancel={handleCancel}
            thumbnail={thumbnail}
            />
        )}
        </div>
    );
};

export default UploadVideo;