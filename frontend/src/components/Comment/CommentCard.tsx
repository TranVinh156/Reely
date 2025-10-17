// import React, { useState } from "react";

// interface Reply {
//   id: string;
//   username: string;
//   comment: string;
//   timestamp: string;
//   avatarUrl: string;
// }

// interface CommentCardProps {
//   username?: string;
//   comment?: string;
//   timestamp?: string;
//   avatarUrl?: string;
//   replies?: Reply[];
//   replyCount?: number;
//   onReply?: () => void;
// }

// const CommentCard: React.FC<CommentCardProps> = ({
//   username,
//   comment,
//   timestamp,
//   avatarUrl,
//   replies = [],
//   replyCount = 0,
//   onReply,
// }) => {
//   const [showReplies, setShowReplies] = useState(false);

//   return (
//     <div className="w-full">
//       {/* Main Comment */}
//       <div className="flex gap-3 px-4 py-3 w-full bg-[#1e293b]">
//         {/* Avatar */}
//         <div className="flex flex-col justify-start pt-1">
//           <img
//             src={avatarUrl}
//             alt={username ? `${username} avatar` : 'avatar'}
//             className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
//           />
//         </div>

//         {/* Content */}
//         <div className="flex-1 min-w-0 flex flex-col gap-y-1">
//           {/* Username and Timestamp */}
//           <div className="flex items-center gap-2">
//             <h4 className="text-base font-semibold text-white">{username || 'Unknown'}</h4>
//             <span className="text-sm text-white/60">{timestamp || ''}</span>
//           </div>

//           {/* Comment Text */}
//           <p className="text-sm text-white/90 leading-relaxed">
//             {comment || ''}
//           </p>

//           {/* Actions */}
//           <div className="flex items-center gap-4 mt-1">
//             <button 
//               onClick={onReply}
//               className="text-sm text-white/60 hover:text-white transition-colors"
//             >
//               Reply
//             </button>

//             {/* View Replies Button */}
//             {replyCount > 0 && (
//               <button
//                 onClick={() => setShowReplies(!showReplies)}
//                 className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
//               >
//                 {showReplies ? '▼' : '▶'} {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Nested Replies */}
//       {showReplies && replies.length > 0 && (
//         <div className="ml-12 border-l-2 border-white/10">
//           {replies.map((reply) => (
//             <div key={reply.id} className="flex gap-3 px-4 py-3 w-full bg-[#1e293b]/50">
//               {/* Reply Avatar */}
//               <div className="flex flex-col justify-start pt-1">
//                 <img
//                   src={reply.avatarUrl}
//                   alt={`${reply.username} avatar`}
//                   className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
//                 />
//               </div>

//               {/* Reply Content */}
//               <div className="flex-1 min-w-0 flex flex-col gap-y-1">
//                 <div className="flex items-center gap-2">
//                   <h4 className="text-sm font-semibold text-white">{reply.username}</h4>
//                   <span className="text-xs text-white/60">{reply.timestamp}</span>
//                 </div>
//                 <p className="text-sm text-white/90 leading-relaxed">
//                   {reply.comment}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CommentCard;