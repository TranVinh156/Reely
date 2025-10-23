import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'  
import Notification from './components/Notification/Notification'
import Comment from './components/Comment/Comment'

function App() {
  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Main content */}
      <div className="flex-1">
        <h1>Video Player Here</h1>
      </div>

      {/* Notification Panel */}
      <Notification />
    </div>
  )
}

export default App
