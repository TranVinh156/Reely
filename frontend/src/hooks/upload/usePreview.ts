import { useState } from 'react';
import { extractThumbnail } from '../../utils/extractThumbnail.ts';
import { getVideoDuration } from './useUploadVideo.tsx';

export const usePreview = () => {
  const [file, setFile] = useState<File>();
  const [preview, setPreview] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string>();
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [onShowCancel, setOnShowCancel] = useState(false);

  const handleSelectFile = async (selected: File) => {
    // Sanitize filename: remove spaces
    const sanitizedName = selected.name.replace(/\s+/g, '');
    const sanitizedFile = new File([selected], sanitizedName, { type: selected.type });

    const MAX_SIZE = 30 * 1024 * 1024 * 1024;
    if (sanitizedFile.size > MAX_SIZE) {
      alert("File size exceeds 30GB limit.");
      return;
    }

    const duration = await getVideoDuration(sanitizedFile);
    if (duration > 3600) {
      alert("Video duration exceeds 60 minutes limit.");
      return;
    }

    setFile(sanitizedFile);
    setPreview(URL.createObjectURL(sanitizedFile));
    const thumbnail = await extractThumbnail(sanitizedFile);
    setThumbnail(thumbnail);
    console.log('Selected file:', sanitizedFile);
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