import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { server_chat_url } from '../config'
import { generateRSAKey, wrapKey, unwrapKey, base64ToArrayBuffer, deriveSecretKey, importDiffieKey } from '../CryptoUtility'
import { performReadTransaction } from '../indexDBUtility'
import _ from 'lodash' 

import LeftSideBar from './LeftSideBar'
import ChatWindow from './ChatWindow'

import{Row, Col, message} from "antd"
import "./HomePage.css"
import { useNavigate, useParams } from 'react-router-dom'

function HomePage({user, userKey, setUserKey, ...props}) {


  // let enc =  new TextEncoder()
  // let dec= new TextDecoder()
  // const keyPair = {'privateKey': null, 'publicKey': null}
  // let encryptedMessage=null
  // generateRSAKey().then(data=>{
  //   console.log('keypair:' ,data.publicKey)
  //   if(data){
  //     keyPair.privateKey = data.privateKey
  //     keyPair.publicKey = data.publicKey
  //     console.log('Private: ', keyPair.privateKey)
  //     console.log('keypair: ', keyPair)
  //     encryptedMessage = rsaEncryptMessage(data.publicKey,enc.encode('Hey There!!!')).then(res=>{
  //       console.log(res, 'encrypted message')
  //       console.log(dec.decode(res))
  //       return dec.decode(res)
  //       rsaDecryptMessage(keyPair.privateKey, res).then(res=>{
  //         console.log(dec.decode(res),'decrypted message')
  //         return res
  //       }).catch(err=>{
  //         console.log(err)
  //       })
  //     })
  //     .catch(err=>{
  //       console.log(err)
  //     })
  //   }
  // })

  const [selectedFriend, setSelectedFriend] = useState(null)
  const [friendData, setFriendData] = useState(null)
  const [friendList, setFriendList] = useState([])
  const [friendsKey, setFriendsKey] = useState([])
  const [friendsPublicKeys, setFriendsPublicKeys] = useState([])
  const [selectedPublicKey, setSelectedPublicKey] = useState({})
  const [sharedKey, setSharedKey] = useState({})
  const [emailID, setEmailID] = useState(null)
  const [isListLoading, setListLoading] = useState(true)

  let id = useParams()
  const navigate = useNavigate()

  //const emailId = (id.id == user.userId) ? user.emailId : null
  let emailId = null

  

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
        setFriendsPublicKeys(data.friendRsaKey)
        setListLoading(false)
      }
      message.success('Friend list generated')
    }).catch(err=>{
      console.log(err)
      message.error(err)
    })
  }

  useEffect(()=>{

  },[emailID])

  useEffect(()=>{
    let loginData = JSON.parse(localStorage.getItem('loginData'))
    
    if(!_.isEmpty(loginData)){
      const hoursDiff = Math.abs(new Date() - new Date(loginData.time))/3600000
      console.log('Hours', hoursDiff)
      if(hoursDiff > 1){
        localStorage.removeItem('loginData')
        loginData=null
        setEmailID('NA')
        message.error("You do not have permission to access this page!!. Please login again")
        navigate('/login')
      }
      else{
        console.log('LoginData :',loginData)
        setEmailID(loginData.emailId)
        performReadTransaction(loginData.userId).then(res=>{
          console.log('userData:', res)
          setUserKey(res.privateKey)
        })
        emailId = loginData.emailId
        makeAPIRequest()
      }
    }else{
      message.error("You do not have permission to access this page!!. Please login again")
      navigate('/login')
    }
    //makeAPIRequest()
  },[])

  useEffect(()=>{
    console.log(selectedFriend,'selectedFriend')
    const selectedKey = (friendsPublicKeys || []).find(key=>{
      if(key.friends == selectedFriend)
        return key
    })
    if(selectedKey && selectedKey.rsaKey){
      getOriginalCryptoKey(selectedKey.rsaKey)
    }
  },[selectedFriend])

  const getOriginalCryptoKey=async(string)=>{
    const keyBuffer = base64ToArrayBuffer(string)
    const keyObj = await importDiffieKey('raw', keyBuffer, {name: 'ECDH', namedCurve: 'P-384'})
    console.log('Loaded new public key!!!!!')
    setSelectedPublicKey(keyObj)
    if(keyObj){
      const sharedKey = await deriveSecretKey(userKey, keyObj)
      console.log('derived new shared Key!!!!!')
      setSharedKey(sharedKey)
    }

  }

  const onSelectFriend=async(value)=>{
    if(value){
      setSelectedFriend(value)

      console.log(selectedFriend,'selectedfriend')
      const data = (friendsKey || []).find(item=>{
        console.log(item,'item')
        if(item.friend == value){
          console.log(item,'selected Item!!!!')
          return item
        }
      })
      setFriendData(data)
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
          {emailID != 'NA' ? <LeftSideBar onSelectFriend={onSelectFriend} friendList={friendList} selectedFriend={selectedFriend} emailId={emailId} updateFriendList={updateFriendList} userKey={userKey} setFriendsKey={setFriendsKey} isListLoading={isListLoading} /> : <>{'Restricted Page!! Go back to Login Page'}</>}
        </Col>
        <Col xs={6} sm={8} md={12} lg={15} xl={18}>
          {emailID != 'NA' ? <ChatWindow selectedFriend={selectedFriend} emailId={emailID} sharedKey={sharedKey} friendData={friendData} /> : <>{'Restricted Page!'}</>}
        </Col>
      </Row>
    </div>
  )
}

HomePage.propTypes = {

}

export default HomePage

