import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { server_chat_url } from '../config'

import LeftSideBar from './LeftSideBar'
import ChatWindow from './ChatWindow'

import{Row, Col, message} from "antd"
import "./HomePage.css"

function HomePage(props) {
  const [selectedFriend, setSelectedFriend] = useState(null)

  const [friendList, setFriendList] = useState([])

  const emailId='prajeshtest@gmail.com'

  const makeAPIRequest=()=>{
    fetch(server_chat_url +'/prajeshtest@gmail.com').then((res)=>{
      if(res && res.ok )
          return res.json()
      throw res
    }).then(data=>{
      console.log(data)
      if(data && data.data){
        setFriendList(data.data.friends)
      }
        
      message.success('Friend list generated')
      console.log('state value is:', friendList)
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
    if(value)
      setSelectedFriend(value)
    
  }

  return (
    <div className='home-page'>
      <Row>
        <Col xs={4} sm={4} md={4} lg={5} xl={6}>
          <LeftSideBar onSelectFriend={onSelectFriend} friendList={friendList} selectedFriend={selectedFriend}/>
        </Col>
        <Col xs={6} sm={8} md={12} lg={15} xl={18}>
          <ChatWindow selectedFriend={selectedFriend} emailId={emailId}/>
        </Col>
      </Row>
    </div>
  )
}

HomePage.propTypes = {

}

export default HomePage

