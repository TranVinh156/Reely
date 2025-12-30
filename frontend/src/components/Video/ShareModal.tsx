import { X } from "lucide-react";
import React from "react";
import { Icon } from "@iconify/react";
interface Props {
    videoUrl: string
    onClose: () => void
}

export const ShareModel: React.FC<Props> = ({onClose, videoUrl}) => {
    const encodedUrl = encodeURIComponent(videoUrl);

    const handleCopy = () => {
        navigator.clipboard.writeText(videoUrl);
    };

    const handleDownload = async () => {
        try {
            const response = await fetch(videoUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `reely-video-${Date.now()}.mp4`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed", error);
            window.open(videoUrl, '_blank');
        }
    };

    const shareOptions = [
        {
            name: "Facebook",
            icon: "mdi:facebook",
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            color: "bg-[#1877F2]",
        },
        {
            name: "X (Twitter)",
            icon: "ri:twitter-x-fill",
            url: `https://twitter.com/intent/tweet?url=${encodedUrl}`,
            color: "bg-black",
        },
        {
            name: "WhatsApp",
            icon: "mdi:whatsapp",
            url: `https://api.whatsapp.com/send?text=${encodedUrl}`,
            color: "bg-[#25D366]",
        },
        {
            name: "Telegram",
            icon: "mdi:telegram",
            url: `https://t.me/share/url?url=${encodedUrl}`,
            color: "bg-[#0088cc]",
        },
        {
            name: "LinkedIn",
            icon: "mdi:linkedin",
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            color: "bg-[#0077b5]",
        },
        {
            name: "Download",
            icon: "mdi:download",
            action: handleDownload,
            color: "bg-gray-600",
        }
    ];

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#1e1e1e] rounded-lg w-[500px] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center px-4 py-3 border-b border-white/10">
                    <h1 className="text-lg font-bold text-white">Share to</h1>
                    <button onClick={onClose} className="text-white/70 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 grid grid-cols-4 gap-4">
                    {shareOptions.map((option) => (
                        option.url ? (
                            <a
                                key={option.name}
                                href={option.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-2 group"
                                onClick={onClose}
                            >
                                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${option.color}`}>
                                    <Icon icon={option.icon} className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-xs text-gray-300 group-hover:text-white">{option.name}</span>
                            </a>
                        ) : (
                            <button
                                key={option.name}
                                onClick={option.action}
                                className="flex flex-col items-center gap-2 group"
                            >
                                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${option.color}`}>
                                    <Icon icon={option.icon} className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-xs text-gray-300 group-hover:text-white">{option.name}</span>
                            </button>
                        )
                    ))}
                </div>

                <div className="mx-5 border-amber-50/50 border rounded-sm flex justify-end p-2 mb-4">
                    <input
                        type="text"
                        readOnly
                        value={videoUrl}
                        className="w-full bg-transparent text-sm text-gray-300 outline-none truncate mr-2"
                    />
                    <button 
                        onClick={handleCopy}
                        className="rounded-2xl bg-[#FE2C55] py-1 px-4 font-semibold text-white min-w-[80px] transition-all hover:bg-[#e62a4d] cursor-pointer"
                    >
                        Copy
                    </button>
                </div>

            </div>
        </div>
    );
};