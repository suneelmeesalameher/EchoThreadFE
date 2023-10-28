import React from 'react'
import PropTypes from 'prop-types'

import { MessageBox } from 'react-chat-elements'
import "react-chat-elements/dist/main.css"

function MessageList({messageList, emailId, ...props}) {
   const dataSource=[
        {
          position:"left",
          type:"text",
          name:"Kursat",
          text:"Give me a message list example ! I need to get this done quick",
          id: 1
        },
        {
          position:"right",
          type:"text",
          name:"Emre",
          text:"That's all.",
          id: 2
        },
        ]
        const messages = (messageList || []).map(message=>{
           return (<MessageBox 
                position={message.friends == emailId ? 'left' : 'right'}
                type={'text'}
                title={message.friends}
                text={message.chat}
                date={new Date(message.timestamp)}
                key={message.friend}
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

