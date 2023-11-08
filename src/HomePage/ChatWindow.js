import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import {message, Skeleton, Empty} from 'antd'
import { server_chat_url } from '../config'

import MessageList from '../Components/MessageList'
import MessageInput from '../Components/MessageInput'
import MessageTopBar from './MessageTopBar'
import { base64ToArrayBuffer, importKey, str2ab, aesEncrypt, arrayBufferToBase64, ab2str, aesDecrypt } from '../CryptoUtility'
//import { generateRSAKey, rsaEncryptMessage, rsaDecryptMessage } from '../CryptoUtility'

function ChatWindow({selectedFriend, emailId, sharedKey, ...props}) {
  // let enc =  new TextEncoder()
  // let dec= new TextDecoder()
  // const keyPair = {'privateKey': null, 'publicKey': null}
  // let encryptedMessage=null
  // generateRSAKey().then(data=>{
  //   //console.log('keypair:' ,data.publicKey)
  //   if(data){
  //     keyPair.privateKey = data.privateKey
  //     keyPair.publicKey = data.publicKey
  //     //console.log('Private: ', keyPair.privateKey)
  //     //console.log('keypair: ', keyPair)
  //     encryptedMessage = rsaEncryptMessage(data.publicKey,enc.encode('Hey There!!!')).then(res=>{
  //       console.log(res, 'encrypted message')
  //       //console.log(dec.decode(res))
  //       //return dec.decode(res)
  //       rsaDecryptMessage(keyPair.privateKey, res).then(res=>{
  //         console.log(dec.decode(res),'decrypted message')
  //         //return res
  //       }).catch(err=>{
  //         console.log(err)
  //       })
  //     }).catch(err=>{
  //       console.log(err)
  //     })
  //   }
  // })
  
  
  const [newMessage, setMessage] = useState('')
  const [messageList, setMessageList] = useState([])
  const [isLoadingMessages, setLoadingMessages] = useState(false)
  const [isSendingMessage, setSendingMessage] = useState(false)
  
  useEffect(()=>{
    const fetchData=async()=>{
      if(selectedFriend)
      setLoadingMessages(true)
    if(selectedFriend && emailId){
      fetch(server_chat_url+emailId+'/'+selectedFriend).then((res)=>{
        if(res && res.ok )
            return res.json()
        throw res
    }).then(async (data)=>{
        const dec=new TextDecoder()
        const receivedMessages = ((data && data.recieved) || [])
        const sentMessages = ((data && data.sent) || [])
        const finalMessageList = ([... receivedMessages, ...sentMessages]).sort((a,b) => a.timestamp - b.timestamp)
        const finalMessageListDecrypted =await Promise.all( (finalMessageList || []).map(async (msg)=>{
          try{
            if(msg && msg.chat){
              const newMsg ={
                ...msg
              }
              debugger
              const iv = str2ab(sharedKey.iv)
              console.log('iv is:', iv)
              const enc=new TextEncoder()
              const dec = new TextDecoder()
              const importedKeyBuffer = base64ToArrayBuffer(sharedKey.key)
              const importedKey =await  importKey("raw", importedKeyBuffer, "AES-GCM")
              console.log('importedKey is:',importedKey)
              const newChatMsg=base64ToArrayBuffer(msg.chat)
              console.log('newChatMSG:', newChatMsg)
              //const decData = enc.encode(newMessage)
             
              const plainText =await aesDecrypt(iv, importedKey, newChatMsg)
              console.log('plainText is:', plainText)
              const plainTextString = dec.decode(plainText)
              console.log("Plaintext is: ", plainTextString)
              newMsg.chat=plainTextString
              return newMsg
            }
          }
          catch(error){
            console.log(error)
            return Promise.reject(error)
          }
        
        }))
        //tempfunction()
        setMessageList(finalMessageListDecrypted)
        setLoadingMessages(false)
    }).catch(err=>{
        console.log(err)
        message.error(err.message)
    })
    }
    }
    fetchData()
    
    
  },[selectedFriend, emailId])

  const tempfunction=async()=>{
    const tempmessage=[{
      "friends": "key1@gmail.com",
      "chat": "lEoTRO5UqTapWpez2jWTpRM=",
      "timestamp": 1699484273828
  }
  ]
  debugger
  console.log("encrypted String :",tempmessage[0].chat)
  const iv = str2ab(sharedKey.iv)
  console.log('iv is:', iv)
  const enc=new TextEncoder()
  const dec = new TextDecoder()
  const importedKeyBuffer = base64ToArrayBuffer(sharedKey.key)
  const importedKey =await  importKey("raw", importedKeyBuffer, "AES-GCM")
  console.log('importedKey is:',importedKey)
  const newChatMsg=base64ToArrayBuffer(tempmessage[0].chat)
  console.log('newChatMSG:', newChatMsg)
  //const decData = enc.encode(newMessage)
 
  const plainText =await aesDecrypt(iv, importedKey, newChatMsg)
  console.log('plainText is:', plainText)
  const finalPlainText = dec.decode(plainText)
  console.log('finalPlainText :',finalPlainText)
  }

  const onChangeMessage=(event)=>{
    if(event && event.target)
      setMessage(event.target.value)
  }

  const onMessageSend=async()=>{
    if(!newMessage){
      message.error('Please enter a message')
      return
    }
    setSendingMessage(true)
    const importedKeyBuffer = base64ToArrayBuffer(sharedKey.key)
    const importedKey =await importKey("raw", importedKeyBuffer, "AES-GCM")

    const iv = str2ab(sharedKey.iv)
    const enc = new TextEncoder()
    const encData = enc.encode(newMessage)
    console.log("encrypted message buffer", encData)
    const cipherText =await aesEncrypt(iv, importedKey, encData)
    const cipherTextString = arrayBufferToBase64(cipherText)
    console.log('cipherTextString: ',cipherTextString)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailId: emailId, friends: selectedFriend, message: cipherTextString})
    };
    fetch(server_chat_url+'/friend', requestOptions).then((res)=>{
      if(res && res.ok )
          return res.json()
      throw res
  }).then(data=>{
      console.log(data)
      message.success('Message Successfully Sent', 0.8, ()=>{
        setMessage(null)
        setSendingMessage(false)
      })
      
  }).catch(err=>{
      console.log(err)
      message.error(err)
      setSendingMessage(false)
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
        <MessageInput onChangeMessage={onChangeMessage} onMessageSend={onMessageSend} newMessage={newMessage} isSendingMessage={isSendingMessage}/>
      </div>
    </div>
  )
}

ChatWindow.propTypes = {

}

export default ChatWindow

