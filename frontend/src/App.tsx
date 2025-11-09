import { useState } from 'react'
import Comment from './components/Comment/Comment'
import Notification from './components/Notification/Notification'
import { Bell, Upload } from 'lucide-react'
import UploadVideo from './components/UploadVideo/UploadVideo';
import UploadDropZone from './components/UploadVideo/UploadDropZone';
import { Navigate } from 'react-router-dom';
import NavigateBarUpload from './components/UploadVideo/NavigateBarUpload';
// import index from './pages/index'
// import IndexPage from './pages/index'

function App() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);

  return (
    // <div className="flex min-h-screen bg-gray-900">

    //   {/* Notification Button */}
    //   <button 
    //     onClick={() => setIsNotificationOpen(!isNotificationOpen)}
    //     className="fixed top-4 bg-blue-500 text-white p-3 rounded-full cursor-pointer hover:bg-blue-600 transition-colors z-50 shadow-lg"
    //   >
    //     <Bell size={24} />
    //     {/* Badge for unread count (optional) */}
    //     <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
    //       3
    //     </span>
    //   </button>

    //   {/* Comment Button */}
    //   <button 
    //     onClick={() => setIsCommentOpen(!isCommentOpen)}
    //     className="fixed top-20  bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-600 transition-colors z-50 shadow-lg"
    //   >
    //     Comment
    //   </button>

    //   {/* Main content */}
    //   <div className="flex-1 p-8">
    //     <h1 className="text-white text-3xl">Video Player Here</h1>
    //   </div>

    //   {/* Comment Panel - Slide from right */}
    //   <div 
    //     className={`fixed right-0 top-0 h-screen transition-transform duration-300 ease-in-out z-40 ${
    //       isCommentOpen ? 'translate-x-0' : 'translate-x-full'
    //     }`}
    //   >
    //     {isCommentOpen && <Comment currentUserId={3} videoId={2} onClose={() => setIsCommentOpen(false)} />}
    //   </div>

    //   {/* Notification Panel - Slide from right */}
    //   <div 
    //     className={`fixed right-0 top-0 h-screen transition-transform duration-300 ease-in-out z-40 ${
    //       isNotificationOpen ? 'translate-x-0' : 'translate-x-full'
    //     }`}
    //   >
    //     {isNotificationOpen && <Notification userId={2} onClose={() => setIsNotificationOpen(false)} />}
    //   </div>

    //   {/* Overlay - Click otside to close */}
    //   {(isNotificationOpen || isCommentOpen) && (
    //     <div 
    //       className="fixed inset-0 bg-black bg-opacity-50 z-30"
    //       onClick={() => {
    //         setIsNotificationOpen(false);
    //         setIsCommentOpen(false);
    //       }}
    //     />
    //   )}
    // </div>

    // <div>
    //   <IndexPage/>
    // </div>

    <div>
      <UploadVideo/>
    </div>
  )
}

export default App