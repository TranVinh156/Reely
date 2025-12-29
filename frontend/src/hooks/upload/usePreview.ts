import { useState } from 'react';
import { extractThumbnail } from '../../utils/extractThumbnail.ts';

export const usePreview = () => {
  const [file, setFile] = useState<File>();
  const [preview, setPreview] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string>();
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [onShowCancel, setOnShowCancel] = useState(false);

  const handleSelectFile = async (selected: File) => {
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    const thumbnail = await extractThumbnail(selected);
    setThumbnail(thumbnail);
    console.log('Selected file:', selected);
  };


  const showCancel = () => {
    setOnShowCancel(true);
  }

  const offShowCancel = () => {
    setOnShowCancel(false);
  }
  
  const confirmCancel = () => {
    setOnShowCancel(false);
    setFile(undefined);
    setPreview(null);
    setThumbnail(undefined);
  };

//   const handleUpload = async () => {
//     if (!file) return;
//     setUploading(true);
//     try {
//       const result = await uploadVideo(file);
//       console.log('Uploaded to:', result.url);
//     } catch (err) {
//       console.error('Upload failed:', err);
//     } finally {
//       setUploading(false);
//     }
//   };

  return {
    file,
    preview,
    progress,
    uploading,
    thumbnail,
    handleSelectFile,
    confirmCancel,
    showCancel,
    onShowCancel,
    offShowCancel
  };
};