import React from 'react'
import PropTypes from 'prop-types'

import { MessageBox } from 'react-chat-elements'
import "react-chat-elements/dist/main.css"

function MessageList({messageList, emailId, ...props}) {
        const messages = (messageList || []).map(message=>{
           return (<MessageBox 
                position={message.friends == emailId ? 'right' : 'left'}
                type={'text'}
                title={message.friends}
                text={message.chat}
                date={new Date(message.timestamp)}
                status={message && message.isVerified ? 'read' : ''}
                key={message.timestamp}
                retracted={false}
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

