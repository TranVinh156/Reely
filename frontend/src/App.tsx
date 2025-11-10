import { useState } from 'react'
import Comment from './components/Comment/Comment'
import Notification from './components/Notification/Notification'

function App() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Main content */}
      <div className="flex-1">
        <h1>Video Player Here</h1>
      </div>

      {/* Comment Panel */}

      {/* <Notification userId={2} /> */}
    </div>
  )
}

export default App