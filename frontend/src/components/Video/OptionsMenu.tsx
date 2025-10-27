import React, { useState } from "react";

export const OptionsMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <i
        className="ri-more-2-line text-white cursor-pointer"
        onClick={() => setOpen((v) => !v)}
      />
      {open && (
        <div className="absolute right-0 bottom-6 w-40 bg-neutral-900/90 text-white rounded-xl shadow-lg text-sm">
          {["Báo cáo", "Chặn video", "Bật phụ đề", "Tự động cuộn"].map((opt) => (
            <div
              key={opt}
              className="px-3 py-2 hover:bg-neutral-800 cursor-pointer"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
