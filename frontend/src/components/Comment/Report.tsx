import { ChevronRight, X, ChevronLeft } from "lucide-react";
import React, { useState } from "react";

interface ReportOption {
  id: string;
  label: string;
}

interface ReportProps {
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const Report: React.FC<ReportProps> = ({ onClose, onSubmit}) => {
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [customReason, setCustomReason] = useState("");

  const reportOptions: ReportOption[] = [
    {
      id: 'violence',
      label: 'Bạo lực, lăm dụng và bóc lột để phạm tôi',
    },
    {
      id: 'hate',
      label: 'Thù ghét và quấy rối',
    },
    {
      id: 'suicide',
      label: 'Tự tử và tự làm hại bản thân',
    },
    {
      id: 'misinformation',
      label: 'Thông tin sai lệch',
    },
    {
      id: 'scam',
      label: 'Gian lận và lừa đảo',
    },
    {
      id: 'spam',
      label: 'Hành vi lừa đảo và gửi nội dung thư rác',
    },
    {
      id: 'other',
      label: 'Thêm',
    },
  ];

  const handleReportClick = (reason: string) => {
    if (reason === 'other') {
      setShowOtherInput(true);
    } else {
      onSubmit(reason);
    }
  };

  const handleCustomSubmit = () => {
    if (customReason.trim()) {
      onSubmit(customReason);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1e1e1e] rounded-lg w-[500px] max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            {showOtherInput && (
              <button 
                onClick={() => setShowOtherInput(false)} 
                className="hover:bg-white/10 rounded-full p-1 transition-colors -ml-2"
              >
                <ChevronLeft size={24} className="text-white" />
              </button>
            )}
            <h2 className="text-xl font-bold text-white">Báo cáo</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} className="text-white" />
          </button>
        </div>

        
        <div className="flex-1 overflow-y-auto">
          
          {showOtherInput ? (
            <div className="p-6 flex flex-col gap-4">
              <h3 className="text-base text-white/60">Nhập lý do báo cáo</h3>
              <textarea
                className="w-full bg-[#2a2a2a] text-white rounded-lg p-3 min-h-[150px] outline-none placeholder:text-white/30"
                placeholder="Hãy cho chúng tôi biết chi tiết..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                autoFocus
              />
              <button
                onClick={handleCustomSubmit}
                disabled={!customReason.trim()}
                className="w-full bg-[#FE2C55] text-white font-semibold py-3 rounded-lg hover:bg-[#FE2C55]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Gửi báo cáo
              </button>
            </div>
          ) : (
            <>
              <div className="px-6 py-4 border-b border-white/5">
                <h3 className="text-base text-white/60">Vui lòng chọn tình huống</h3>
              </div>

              <div className="divide-y divide-white/5">
                {reportOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleReportClick(option.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors group"
                  >
                    <span className="text-white text-left">{option.label}</span>
                    <ChevronRight
                      size={20}
                      className="text-white/40 group-hover:text-white/60 transition-colors"
                    />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Report;
