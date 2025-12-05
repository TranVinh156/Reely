import axiosClient from "@/utils/axios.client";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { li } from "motion/react-client";
import React, { useState } from "react";

interface ReportOption {
  id: string;
  label: string;
  policy:  Array<string>;
}

interface ReportProps {
  reporterId: number | undefined,
  targetType: string,
  targetId: number,
  onClose: () => void;
}

const Report: React.FC<ReportProps> = ({reporterId, targetType, targetId, onClose}) => {
  const [onSubmitReason, setOnSubmitReason] = useState("");
  const [submitPolicy, setSubmitPolicy] = useState<string[]>([])
  const [customReason, setCustomReason] = useState("");
  const reportOptions: ReportOption[] = [
    {
      id: 'violence',
      label: 'Bạo lực, lạm dụng và bóc lột để phạm tội',
      policy: ["Cho thấy, cổ xúy hoặc đe dọa bạo lực thể chất, bao gồm tra tấn thật, hình ảnh bạo lực và ẩu đả quá khích", "Cổ xúy hoặc ủng hộ mạnh mẽ các tổ chức bạo lực hoặc thù địch, bao gồm người bạo lực quá khích và tổ chức tội phạm"] 
    },
    {
      id: 'hate',
      label: 'Thù ghét và quấy rối',
      policy: ["Cho thấy hoặc cổ xúy bạo lực, phân biệt đối xử và các hành động gây hại khác, bao gồm tuyên bố uy quyền trên cơ sở đặc điểm cá nhân, chẳng hạn như chủng tộc, tôn giáo, giới tính và xu hướng tính dục", "Hạ bệ người khác trên cơ sở các đặc điểm cá nhân này, bao gồm việc sử dụng lời vu khống gây thù ghét", "Phản đối các sự kiện lịch sử đã được dẫn chứng bằng tư liệu gây hại cho các nhóm được bảo vệ, chẳng hạn như nạn diệt chủng Holocaust", "Cổ xúy hoặc ủng hộ các nội dung, cá nhân và tổ chức khuyến khích tư tưởng thù địch"]
    },
    {
      id: 'suicide',
      label: 'Tự tử và tự làm hại bản thân',
      policy: ["Trình bày, cổ xúy hoặc cung cấp hướng dẫn tự tử, tự làm hại bản thân và các trò game, thách thức, thử thách, lừa bịp hoặc giao kèo có liên quan", "Chia sẻ kế hoạch tự tử và tự làm hại bản thân"]
    },
    {
      id: 'misinformation',
      label: 'Thông tin sai lệch',
      policy: ["Thông tin sai lệch gây nguy hiểm cho sự an toàn công cộng hoặc có thể sẽ gây ra hoảng loạn, chẳng hạn như sử dụng cảnh quay cũ của một sự kiện trong quá khứ và nói dối là sự kiện hiện tại, hoặc lan truyền thông tin không chính xác tuyên bố là đồ dùng thiết yếu như thực phẩm hoặc nước không còn nữa"]
    },
    {
      id: 'scam',
      label: 'Gian lận và lừa đảo',
      policy: ["Lừa đảo tài chính, đầu tư, tuyển dụng, hoặc lừa đảo giả mạo, bao gồm trộm cắp danh tính", "Thông đồng hoặc hỗ trợ lừa đảo, hoặc hướng dẫn cách lừa đảo", "Gian lận có tổ chức, chẳng hạn như rửa tiền và chuyển tiền có được theo hình thức bất hợp pháp cho người khác (con la chở tiền)", "Tuyển dụng nhân viên tiếp thị đa cấp (MLM)"]
    },
    {
      id: 'spam',
      label: 'Hành vi lừa đảo và gửi nội dung thư rác',
      policy: ["Các tài khoản được sử dụng hàng loạt hoặc thông qua công cụ tự động trái phép như bot để phát tán lượng lớn nội dung, bao gồm mục đích thương mại", "Các mạng lưới tài khoản tuyên bố bản thân là các thực thể tương tự hoặc đăng nội dung tương tự để dẫn dắt người dùng đến những vị trí cụ thể trên TikTok hoặc ngoài nền tảng, chẳng hạn như tài khoản, trang web và doanh nghiệp khác"]
    },
    {
      id: 'other',
      label: 'Thêm',
      policy: []
    },
  ];

  

  const handleReportSubmit = async (reason: string) => {
    console.log("Report submitted with reason:", reason);
    // TODO: Gọi API để gửi report lên server
    try {
      await axiosClient.post('/reports', {
        reporterId,
        targetType,
        status: "PENDING",
        targetId,
        reason
      })

    } catch (error) {
        console.error("Error submitting reply:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1e1e1e] rounded-lg w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Báo cáo</h2>
          <button
            onClick={() => {
              setOnSubmitReason("");
              setSubmitPolicy([]);
              setCustomReason("");
              onClose();  }}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} className="text-white" />
          </button>
        </div>

        {/* Content */}
        { !onSubmitReason &&
        (<div className="flex-1 overflow-y-auto">
          <div className="px-6 py-4 border-b border-white/5 bg-white/5">
            <h3 className="text-base text-white">Vui lòng chọn tình huống</h3>
          </div>

          <div className="divide-y divide-white/5">
            {reportOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  setOnSubmitReason(option.label); 
                  setSubmitPolicy(option.policy);
                }}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer"
              >
                <span className="text-white text-left">{option.label}</span>
                <ChevronRight
                  size={20}
                  className="text-white/40 group-hover:text-white/60 transition-colors"
                />
              </button>
            ))}
          </div>
        </div>)
        }

        { onSubmitReason &&
        (<div className="">
          <div className="px-3 py-4 border-b border-white/5 bg-white/5 flex items-center">
            <ChevronLeft
              size={25}
              className="text-white cursor-pointer hover:text-white/60"
              onClick={() => {
                setOnSubmitReason("");
                setSubmitPolicy([]);
                setCustomReason("");
              }}
            />
            <h3 className="text-lg text-white">{onSubmitReason}</h3>
          </div>

          <div className="mt-5 pl-3 text-white/70">Chúng tôi không cho phép đăng nội dung:
          </div>

          <div className="w-full px-6 py-2 flex items-center justify-between bor">
            {submitPolicy.length > 0 ? (
              <ul className="list-disc pl-3">
                {submitPolicy.map((policy, index) => (
                  <li key={index} className="text-white/70 mt-2">{policy}</li>
                ))}
              </ul>
            ) : (
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Vui lòng mô tả lý do báo cáo của bạn..."
                className="w-full h-32 bg-white/5 border border-white/10 rounded-md px-4 py-3 text-white placeholder-white/40 resize-none focus:outline-none focus:border-[#FE2C55]"
              />
            )}
          </div>

          <div className="w-full border-t border-white/20 mt-5 flex justify-end px-5 gap-x-3">
            <button 
              className="mt-5 mb-5 bg-[#FE2C55] px-4 py-2 rounded-sm cursor-pointer hover:bg-[#FE2C55]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
              onClick={() => {
                const reasonToSubmit = submitPolicy.length > 0 ? onSubmitReason : customReason;
                if (reasonToSubmit.trim()) {
                  handleReportSubmit(reasonToSubmit);
                  setOnSubmitReason("");
                  setSubmitPolicy([]);
                  setCustomReason("");
                  onClose();
                }
              }}
              disabled={submitPolicy.length === 0 && !customReason.trim()}
            >
              Gửi
            </button>
          </div>
          
        </div>
        )
        }

        

      </div>
    </div>
  );
};

export default Report;
