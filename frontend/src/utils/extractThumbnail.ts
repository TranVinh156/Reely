export const extractThumbnail = (file: File, seekTo: number = 1): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);
    video.crossOrigin = "anonymous";
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      // Đảm bảo không vượt quá thời lượng video
      if (seekTo > video.duration) seekTo = video.duration / 2;
      video.currentTime = seekTo;
    };

    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject("Cannot get 2d context");
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageUrl = canvas.toDataURL("image/jpeg"); // Base64 thumbnail
      resolve(imageUrl);
    };

    video.onerror = (e) => {
      reject(e);
    };
  });
};