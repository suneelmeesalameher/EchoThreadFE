import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import {message} from 'antd'
import { makeAPIRequest, server_chat_url } from '../config'

import MessageList from '../Components/MessageList'
import MessageInput from '../Components/MessageInput'
import MessageTopBar from './MessageTopBar'

function ChatWindow({selectedFriend, emailId, ...props}) {

  const [newMessage, setMessage] = useState('')
  const [messageList, setMessageList] = useState([])

  // const formatMessageList=(messages, emailId)=>{
  //   const formattedList = (messages || []).map(message=>{
  //     let obj={
  //       ...message,
  //       emailId: emailId
  //     }
  //     return obj
  //   })
  //   return formattedList
  // }
  
  useEffect(()=>{
    if(selectedFriend && emailId){
      fetch(server_chat_url+emailId+'/'+selectedFriend).then((res)=>{
        if(res && res.ok )
            return res.json()
        throw res
    }).then(data=>{
        console.log(data.recieved)
        const receivedMessages = ((data && data.recieved) || [])
        console.log(receivedMessages,'receivedMessages')
        const sentMessages = ((data && data.sent) || [])
        console.log(sentMessages,'sentMessages')
        const finalMessageList = ([... receivedMessages, ...sentMessages]).sort((a,b) => a.timestamp - b.timestamp)
        setMessageList(finalMessageList)
        //setMessageList()
        
    }).catch(err=>{
        console.log(err)
        message.error(err)
    })
    }
    
  },[selectedFriend, emailId])

  const onChangeMessage=(event)=>{
    if(event && event.target)
      setMessage(event.target.value)
  }

  const onMessageSend=()=>{
    if(!newMessage){
      message.error('Please enter a message')
      return
    }
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailId: emailId, friends: selectedFriend, message: newMessage})
    };
    fetch(server_chat_url+'/friend', requestOptions).then((res)=>{
      if(res && res.ok )
          return res.json()
      throw res
  }).then(data=>{
      console.log(data)
      message.success('Message Successfully Sent', 1, ()=>{
        setMessage(null)
      })
      
  }).catch(err=>{
      console.log(err)
      message.error(err)
  })
  }

  return (
    <div className='chat-window'>
      <div className='chat-top-bar'>
        <MessageTopBar selectedFriend={selectedFriend}/>
      </div>
      <div className='message-window'>
        <MessageList messageList={messageList} emailId={emailId}/>
      </div>
      <div className='message-input-container'>
        <MessageInput onChangeMessage={onChangeMessage} onMessageSend={onMessageSend} newMessage={newMessage} />
      </div>
    </div>
  )
}

ChatWindow.propTypes = {

}

export default ChatWindow

