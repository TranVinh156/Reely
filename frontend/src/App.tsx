import { useState } from 'react'
import './App.css'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'  
import Notification from './components/Notification/Notification'
import Comment from './components/Comment/Comment'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Main content */}
      <div className="flex-1">
        <h1>Video Player Here</h1>
      </div>

      {/* Comment Panel */}
      <Comment />
    </div>
  )
}

export default App
