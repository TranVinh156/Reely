import React, { useState } from 'react';
import NavigateBarUpload from '../components/UploadVideo/NavigateBarUpload';
import UploadDropZone from '../components/UploadVideo/UploadDropZone';
import UploadPreview from '../components/UploadVideo/UploadPreview';
import { usePreview } from '@/hooks/upload/usePreview';
import Sidebar from '@/components/Layout/Sidebar';
import Cancel from '@/components/UploadVideo/Cancel';
import ActionBar from '@/components/Layout/ActionBar';

const UploadVideo: React.FC = () => {
    const { file, preview, handleSelectFile, confirmCancel, thumbnail, showCancel, onShowCancel ,offShowCancel} = usePreview();
    
    return (
        <div className='flex gap-6 bg-neutral-900'>
            <Sidebar />
            <div className="upload-container bg-[#161823] min-h-screen flex-1"
        
                onDrop={(e) => {e.preventDefault()}}
                onDragOver={(e) => {e.preventDefault()}}>
                    <ActionBar/>
                    {/* <div className="text-center text-white pt-15 pb-15 gap-y-6 flex flex-col">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Upload Your Video</h1>
                    </div> */}
                    
                {!preview ? (
                    <UploadDropZone onFileSelect={handleSelectFile}/>
                ) : (
                    <UploadPreview
                    file={file}
                    handleCancel={showCancel}
                    thumbnail={thumbnail}
                    />
                )}
            </div>

            { onShowCancel && <Cancel onClose={offShowCancel} onConfirm={confirmCancel}  />
            }
        </div>
        
    );
};

export default UploadVideo;