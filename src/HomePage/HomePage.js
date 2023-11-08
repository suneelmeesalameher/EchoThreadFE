import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { server_chat_url } from '../config'
import { generateRSAKey, wrapKey, unwrapKey } from '../CryptoUtility' 

import LeftSideBar from './LeftSideBar'
import ChatWindow from './ChatWindow'

import{Row, Col, message} from "antd"
import "./HomePage.css"
import { useParams } from 'react-router-dom'

function HomePage({user, ...props}) {


  // let enc =  new TextEncoder()
  // let dec= new TextDecoder()
  const keyPair = {'privateKey': null, 'publicKey': null}
  let encryptedMessage=null
  generateRSAKey().then(data=>{
    //console.log('keypair:' ,data.publicKey)
    if(data){
      keyPair.privateKey = data.privateKey
      keyPair.publicKey = data.publicKey
      //console.log('Private: ', keyPair.privateKey)
      console.log('keypair: ', keyPair)
      // encryptedMessage = rsaEncryptMessage(data.publicKey,enc.encode('Hey There!!!')).then(res=>{
      //   console.log(res, 'encrypted message')
      //   //console.log(dec.decode(res))
      //   //return dec.decode(res)
      //   rsaDecryptMessage(keyPair.privateKey, res).then(res=>{
      //     console.log(dec.decode(res),'decrypted message')
      //     //return res
      //   }).catch(err=>{
      //     console.log(err)
      //   })
      // })
      // .catch(err=>{
      //   console.log(err)
      // })
    }
  })

  const [selectedFriend, setSelectedFriend] = useState(null)

  const [friendList, setFriendList] = useState([])
  const [friendsKey, setFriendsKey] = useState([])
  const [sharedKey, setSharedKey] = useState({})

  let id = useParams()


  useEffect(()=>{
    
  },[user])

  const emailId = (id.id == user.userId) ? user.emailId : null
  //const emailId = 'key1@gmail.com'

  const makeAPIRequest=()=>{
    fetch(server_chat_url +emailId).then((res)=>{
      if(res && res.ok )
          return res.json()
      throw res
    }).then(data=>{
      console.log(data)
      if(data && data.data){
        setFriendList(data.data.friends)
        setFriendsKey(data.key)
      }
      message.success('Friend list generated')
    }).catch(err=>{
      console.log(err)
      message.error(err)
    })
  }

  useEffect(()=>{
    makeAPIRequest()
  },[])

  useEffect(()=>{
    console.log(selectedFriend,'selectedFriend')
  },[selectedFriend])


  const onSelectFriend=(value)=>{
    if(value){
      setSelectedFriend(value)

      console.log(selectedFriend,'selectedfriend')
      const sharedKey = (friendsKey || []).find(item=>{
        console.log(item,'item')
        if(item.friend == value){
          console.log(item,'selected Item!!!!')
          return item
        }
          
      })
      setSharedKey(sharedKey)
    }
      
  }

  const updateFriendList=(friend)=>{
    const newFriendList=[...friendList, friend]
    makeAPIRequest()
    setFriendList(newFriendList)
  }

  return (
    <div className='home-page'>
      <Row>
        <Col xs={4} sm={4} md={4} lg={5} xl={6}>
          <LeftSideBar onSelectFriend={onSelectFriend} friendList={friendList} selectedFriend={selectedFriend} emailId={emailId} updateFriendList={updateFriendList} keyPair={keyPair} setFriendsKey={setFriendsKey}/>
        </Col>
        <Col xs={6} sm={8} md={12} lg={15} xl={18}>
          <ChatWindow selectedFriend={selectedFriend} emailId={emailId} sharedKey={sharedKey}/>
        </Col>
      </Row>
    </div>
  )
}

HomePage.propTypes = {

}

export default HomePage

