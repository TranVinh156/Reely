import React from 'react';

interface DeleteProps {
  onClose: () => void;
  onConfirm: () => void;
}

const Delete: React.FC<DeleteProps> = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1e1e1e] rounded-lg w-[500px] overflow-hidden flex flex-col">
        {/* Content */}
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold text-white text-center">
            Bạn có chắc chắn muốn xóa bình luận này?
          </h2>
        </div>

        {/* Actions */}
        <div className="flex gap-4 px-6 pb-6">
          <button
            onClick={onConfirm}
            className="flex-1 bg-[#FE2C55] hover:bg-[#FE2C55]/80 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Xóa
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default Delete;