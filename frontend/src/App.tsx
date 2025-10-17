import { useState } from 'react'
import './App.css'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'  
import Notification from './components/Notification/Notification'
import CommentCard from './components/Comment/CommentCard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-900 min-h-screen">
      <CommentCard
        username="Minh Quang"
        comment="Lorem ipsum dolor sit amet consectetur."
        timestamp="2h ago"
        avatarUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s"
        replyCount={2}
        replies={[
          {
            id: '1',
            username: 'John Doe',
            comment: 'Great point!',
            timestamp: '1h ago',
            avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatFGGWLmfb6aTo1tyb3OxSkjfXrYft2TTbw&s'
          },
          {
            id: '2',
            username: 'Jane Smith',
            comment: 'I agree with you.',
            timestamp: '30m ago',
            avatarUrl: 'https://example.com/avatar3.jpg'
          }
        ]}
        onReply={() => console.log('Reply clicked')}
      />
    </div>
  )
}

export default App
