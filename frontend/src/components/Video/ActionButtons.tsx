import React from "react";
import { motion } from "framer-motion";
import { useFeedStore } from "@/store/feedStore";

export const ActionButtons: React.FC = () => {
  const { liked, toggleLike } = useFeedStore();
  const handleLike = () => toggleLike("current"); // mock id

  return (
    <div className="flex items-center gap-3">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleLike}
        className="text-white"
      >
        <i
          className={`ri-heart-${liked["current"] ? "fill text-red-500" : "line"}`}
        />
      </motion.button>
      <button className="text-white">
        <i className="ri-share-forward-line" />
      </button>
      <button className="text-white">
        <i className="ri-bookmark-line" />
      </button>
    </div>
  );
};
