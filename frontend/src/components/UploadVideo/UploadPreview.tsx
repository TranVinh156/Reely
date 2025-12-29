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
  const { user } = useAuth();

  const { uploadVideo } = useUpload();
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
      const result = await uploadVideo(
        user?.id,
        title.trim(),
        description.trim(),
        file,
        parsedTags,
      );
      handleCancel();
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };
  return (
    <div className="m-auto flex max-w-screen-xl flex-col gap-y-10 rounded-xl text-center text-white">
      <div className="flex items-center justify-between bg-[#181C32] p-5">
        <div className="flex">
          <div className="flex h-35 w-25 items-center justify-center overflow-hidden rounded-sm bg-black">
            <img
              src={thumbnail}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="ml-6 flex flex-col items-start justify-center">
            <p className="mb-2 truncate text-base font-semibold text-white sm:text-lg">
              {file?.name}
            </p>
            <p className="text-sm text-white/60 sm:text-base">
              {" "}
              {file ? (
                <span>Size: {(file.size / (1024 * 1024)).toFixed(2)} MB</span>
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

      <div className="flex flex-col justify-start gap-y-6 bg-[#181C32] p-5">
        <div>
          <label className="mb-2 block text-left font-medium text-gray-300">
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
          <label className="mb-2 block text-left font-medium text-gray-300">
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
          <label className="mb-2 block text-left font-medium text-gray-300">
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

        <div className="mt-6 flex flex-col justify-end gap-4 sm:flex-row">
          <NavLink
            to={`/users/${user?.username}`}
            onClick={handlePublish}
            className="flex-1 cursor-pointer rounded bg-[#FE2C55] px-4 py-2 font-semibold text-white hover:bg-[#FE2C55]/80"
          >
            Publish Video
          </NavLink>

          <div></div>
          <button
            onClick={handleCancel}
            className="flex-1 cursor-pointer rounded bg-gray-600 px-4 py-2 font-semibold text-white hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPreview;
