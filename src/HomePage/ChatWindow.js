import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import {message, Skeleton, Empty} from 'antd'
import { makeAPIRequest, server_chat_url } from '../config'

import MessageList from '../Components/MessageList'
import MessageInput from '../Components/MessageInput'
import MessageTopBar from './MessageTopBar'

function ChatWindow({selectedFriend, emailId, ...props}) {

  const [newMessage, setMessage] = useState('')
  const [messageList, setMessageList] = useState([])
  const [isLoadingMessages, setLoadingMessages] = useState(false)
  
  useEffect(()=>{
    if(selectedFriend)
      setLoadingMessages(true)
    if(selectedFriend && emailId){
      fetch(server_chat_url+emailId+'/'+selectedFriend).then((res)=>{
        if(res && res.ok )
            return res.json()
        throw res
    }).then(data=>{
        const receivedMessages = ((data && data.recieved) || [])
        const sentMessages = ((data && data.sent) || [])
        const finalMessageList = ([... receivedMessages, ...sentMessages]).sort((a,b) => a.timestamp - b.timestamp)
        setMessageList(finalMessageList)
        setLoadingMessages(false)
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
  const loadedData = <MessageList messageList={messageList} emailId={emailId}/>
  const emptyData = <Empty description="No Messages"/>
  return (
    <div className='chat-window'>
      <div className='chat-top-bar'>
        <MessageTopBar selectedFriend={selectedFriend}/>
      </div>
      <div className='message-window'>
        <Skeleton loading={isLoadingMessages} active>
          {selectedFriend && messageList.length > 0 ? loadedData : emptyData}
        </Skeleton>
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

