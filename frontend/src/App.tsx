import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Comment from './components/Comment/Comment'
import Sidebar from './components/Layout/Sidebar'

function App() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Main content */}
      <Sidebar />

      <div className="flex-1">
        <h1>Video Player Here</h1>
      </div>

      {/* Comment Panel */}
      {/* <Comment currentUserId={3} videoId={2} /> */}

    </div>
  )
}

export default App
