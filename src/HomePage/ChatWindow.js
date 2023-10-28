import React, { useState } from 'react'
import PropTypes from 'prop-types'

import MessageList from '../Components/MessageList'
import MessageInput from '../Components/MessageInput'
import MessageTopBar from './MessageTopBar'

function ChatWindow(props) {

  const [message, setMessage] = useState('')
  const [messageList, setMessageList] = useState([])

  const onChangMessage=(event)=>{
    if(event && event.target)
      setMessage(event.target.value)

  }

  return (
    <div className='chat-window'>
      <div className='chat-top-bar'>
        <MessageTopBar />
      </div>
      <div className='message-window'>
        <MessageList />
      </div>
      <div className='message-input-container'>
        <MessageInput />
      </div>
    </div>
  )
}

ChatWindow.propTypes = {

}

export default ChatWindow

