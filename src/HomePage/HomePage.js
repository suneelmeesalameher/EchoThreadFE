import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { server_chat_url } from '../config'
import { base64ToArrayBuffer, deriveSecretKey, importDiffieKey, importKey } from '../CryptoUtility'
import { performReadTransaction } from '../indexDBUtility'
import _ from 'lodash' 

import LeftSideBar from './LeftSideBar'
import ChatWindow from './ChatWindow'

import{Row, Col, message} from "antd"
import "./HomePage.css"
import { useNavigate, useParams } from 'react-router-dom'
import { verify } from 'crypto'

function HomePage({user, setUser, userKey, setUserKey, logOutUser, userDsKey, setUserDsKey, ...props}) {

  const [selectedFriend, setSelectedFriend] = useState(null)
  const [friendData, setFriendData] = useState(null)
  const [friendList, setFriendList] = useState([])
  const [friendsKey, setFriendsKey] = useState([])
  const [friendsPublicKeys, setFriendsPublicKeys] = useState([])
  const [friendsDsPublicKeys, setFriendsDsPublicKeys] = useState([])
  const [selectedPublicKey, setSelectedPublicKey] = useState({})
  const [sharedKey, setSharedKey] = useState({})
  const [selectedDsPublicKey, setSelectedDsPublicKey] = useState({})
  const [emailID, setEmailID] = useState(null)
  const [isListLoading, setListLoading] = useState(true)

  let id = useParams()
  const navigate = useNavigate()

  //const emailId = (id.id == user.userId) ? user.emailId : null
  let emailId = null

  

  const makeAPIRequest=(emailId)=>{
    setListLoading(true)
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
        setFriendsDsPublicKeys(data.dsPublicKey)
        setListLoading(false)
      }
      message.success('Friend list generated')
    }).catch(err=>{
      console.log(err)
      //message.error(err)
      setListLoading(false)
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
        setUser(loginData)
        //emailId=loginData.emailId
        performReadTransaction(loginData.userId).then(res=>{
          console.log('userData:', res)
          setUserKey(res.privateKey)
          setUserDsKey(res.dsPrivateKey)
        }).catch(error=>{
          console.log(error)
          message.info("Detected Login on new device with this account. Unfortunately we dont have a private key on this device",5)
        })
        emailId = loginData.emailId
        makeAPIRequest(emailId)
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
    console.log('selectedKey:',selectedKey)
    const selectedDsKey = (friendsDsPublicKeys || []).find(key=>{
      if(key.friends == selectedFriend)
        return key
    })
    console.log('selectedDsKey:', selectedDsKey)
    if(selectedKey && selectedKey.rsaKey && selectedDsKey && selectedDsKey.dsPublicKey){
      getOriginalCryptoKey(selectedKey.rsaKey, selectedDsKey.dsPublicKey)
    }
  },[selectedFriend])

  const getOriginalCryptoKey=async(string, dsString)=>{
    const keyBuffer = base64ToArrayBuffer(string)
    const keyObj = await importDiffieKey('raw', keyBuffer, {name: 'ECDH', namedCurve: 'P-384'})
    console.log('Loaded new public key!!!!!')

    const dsKeyBuffer = base64ToArrayBuffer(dsString)
    const dsKey = await importKey('raw', dsKeyBuffer, {name: 'ECDSA', namedCurve: 'P-384'},['verify'])
    console.log('dsKey :',dsKey)
    setSelectedPublicKey(keyObj)
    setSelectedDsPublicKey(dsKey)
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
    //const newFriendList=[...friendList, friend]
    makeAPIRequest(emailID)
    //setFriendList(newFriendList)
  }

  return (
    <div className='home-page'>
      <Row>
        <Col xs={4} sm={4} md={4} lg={5} xl={6}>
          {emailID != 'NA' ? <LeftSideBar onSelectFriend={onSelectFriend} friendList={friendList} selectedFriend={selectedFriend} emailId={emailID} updateFriendList={updateFriendList} userKey={userKey} setFriendsKey={setFriendsKey} isListLoading={isListLoading} logOutUser={logOutUser}/> : <>{'Restricted Page!! Go back to Login Page'}</>}
        </Col>
        <Col xs={6} sm={8} md={12} lg={15} xl={18}>
          {emailID != 'NA' ? <ChatWindow selectedFriend={selectedFriend} emailId={emailID} sharedKey={sharedKey} friendData={friendData} selectedDsPublicKey={selectedDsPublicKey} userDsKey={userDsKey}/> : <>{'Restricted Page!'}</>}
        </Col>
      </Row>
    </div>
  )
}

HomePage.propTypes = {

}

export default HomePage

