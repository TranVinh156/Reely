import React, { useContext, useEffect, useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";
import { UploadContext, useUpload } from "@/hooks/upload/useUploadVideo";
import CircularProgress from "./CircularProgress";

interface Props {
  file?: File;
  handleCancel: () => void;
  thumbnail?: string;
}

const UploadPreview: React.FC<Props> = ({ file, handleCancel, thumbnail }) => {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [tagsText, setTagsText] = React.useState("");
  const [videoSrc, setSrc] = React.useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const { uploadVideo, uploading, progress } = useUpload();
  const parsedTags = React.useMemo(() => {
    return tagsText
      .split(/[\s,]+/)
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => (t.startsWith("#") ? t.substring(1) : t))
      .map((t) => t.toLowerCase())
      .filter((t, idx, arr) => arr.indexOf(t) === idx)
      .slice(0, 10);
  }, [tagsText]);

  const handlePublish = async () => {
    if (!file) return;

    try {
      await uploadVideo(
        user?.id,
        title.trim(),
        description.trim(),
        file,
        parsedTags,
      );
      navigate(`/users/${user?.username}`);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  useEffect(() => {
    const video = document.createElement("video");
    if (file) { video.src = URL.createObjectURL(file); }
    setSrc(video.src)
  }, [])


  return (
    <div className=" flex max-w-screen-xl flex-col lg:flex-row items-center gap-8 rounded-xl text-center text-white mt-26 ">

      <div className="flex flex-col gap-3 flex-1 w-full">
        <div className="flex items-center justify-between bg-[#181C32] p-4 rounded-lg">
          <div className="flex">
            <div className="ml-6 flex flex-col items-start justify-center">
              <p className="mb-2 truncate text-base font-semibold text-gray-300 sm:text-lg">
                File: {file?.name}
              </p>
              <p className="text-xs text-white/80 sm:text-base">
                {" "}
                {file ? (
                  <span className="text-sm">Size: {(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                ) : (
                  "No file selected"
                )}
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="flex h-10 w-10 cursor-pointer items-center self-start rounded-full p-2 hover:bg-gray-500/20 sm:self-auto"
          >
            <X className="text-white" />
          </button>
        </div>
        <div className="flex flex-col justify-start gap-y-4 bg-[#181C32] p-5 rounded-lg">
          <div>
            <label className="mb-2 block text-left font-bold text-white">
              Video Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your video a catchy title"
              className="w-full rounded-lg bg-black/40 p-2 text-white focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-left font-bold text-white">
              Tags (hashtags)
            </label>
            <input
              type="text"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="#funny #travel (separate by space or comma)"
              className="w-full rounded-lg bg-black/40 p-2 text-white focus:outline-none"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {parsedTags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-white/10 px-2 py-1 text-xs"
                >
                  #{t}
                </span>
              ))}
              {parsedTags.length === 0 && (
                <span className="text-xs text-white/50">
                  Add up to 10 tags to help discovery.
                </span>
              )}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-left font-bold text-white">
              Video Description
            </label>
            <textarea
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
              placeholder="Tell viewers about your video..."
              maxLength={2000}
              rows={4}
              className="w-full rounded-lg bg-black/40 p-2 text-white focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              {description.length}/2000
            </p>
          </div>
          <div className="mt-2 flex flex-col justify-end gap-4 sm:flex-row">
            <button
              onClick={handlePublish}
              disabled={uploading}
              className="flex-1 cursor-pointer rounded bg-black px-4 py-2 font-semibold text-white hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "Publishing..." : "Publish Video"}
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 cursor-pointer rounded bg-gray-600 px-4 py-2 font-semibold text-white hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-start justify-center lg:max-w-sm w-full">
        <div className="relative w-full aspect-[9/15] bg-black rounded-lg overflow-hidden border border-gray-700">
          <video
            src={videoSrc}
            className="w-full h-full object-contain"
            controls
          />
        </div>
      </div>
      {uploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center rounded-xl bg-[#181C32] p-8 shadow-2xl border border-gray-700">
            <CircularProgress progress={progress} size={100} strokeWidth={8} />
            <p className="mt-6 text-xl font-bold text-white">Publishing Video...</p>
            <p className="mt-2 text-sm text-gray-400">Please wait...</p>
            <p className="mt-1 text-lg font-semibold text-blue-400">{progress}%</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPreview;
