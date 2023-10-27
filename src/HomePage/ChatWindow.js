import React from 'react'
import PropTypes from 'prop-types'

import MessageList from '../Components/MessageList'

function ChatWindow(props) {
  return (
    <div className='chat-window'>
      <div className='chat-top-bar'>

      </div>
      <div className='message-window'>
        <MessageList />
      </div>
    </div>
  )
}

ChatWindow.propTypes = {

}

export default ChatWindow

