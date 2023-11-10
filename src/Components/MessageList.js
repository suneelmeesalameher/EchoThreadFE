import React from 'react'
import PropTypes from 'prop-types'

import { MessageBox } from 'react-chat-elements'
import "react-chat-elements/dist/main.css"

function MessageList({messageList, emailId, ...props}) {
        const messages = (messageList || []).map(message=>{
           return (<MessageBox 
                position={message.friends == emailId ? 'left' : 'right'}
                type={'text'}
                title={message.friends}
                text={message.chat}
                date={new Date(message.timestamp)}
                key={message.timestamp}
            />)
          })
  return (
    <div className='message-list'>
      {messages}
    </div>
  )
}

MessageList.propTypes = {

}

export default MessageList

