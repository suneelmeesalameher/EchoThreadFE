import React from 'react'
import PropTypes from 'prop-types'

import { MessageBox } from 'react-chat-elements'
import "react-chat-elements/dist/main.css"

function MessageList(props) {
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
        const messages = (dataSource || []).map(message=>{
           return (<MessageBox 
                position={message.name == 'Emre' ? 'left' : 'right'}
                type={message.type}
                title={message.name}
                text={message.text}
                date={new Date()}
                key={message.id}
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

