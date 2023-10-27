import React from 'react'
import PropTypes from 'prop-types'

import MessageList from '../Components/MessageList'
import MessageInput from '../Components/MessageInput'

function ChatWindow(props) {
  return (
    <div className='chat-window'>
      <div className='chat-top-bar'>

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

