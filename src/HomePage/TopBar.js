import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {Modal, message} from 'antd'
import { UserAddOutlined } from '@ant-design/icons'

import SearchBar from './../Components/SearchBar'
import { server_chat_url } from '../config'

function TopBar({emailId, updateFriendList, ...props}) {

  const [selectedFriend, setSelectedFriend] =useState(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const [isLoading, setLoading] = useState(false)
  
  const onSelectUser=(value)=>{
    if(value){
      setSelectedFriend(value)
      setModalOpen(true)
    }
  }

  const handleOk=()=>{
    //make api call
    setLoading(true)
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailId: emailId, friends: selectedFriend})
    };
    fetch(server_chat_url+"save", requestOptions).then((res)=>{
        if(res && res.ok )
            return res.json()
        throw res
    }).then(data=>{
        console.log(data)
        message.success('Friend added successfully', 1.5, ()=>{
            //console.log('Im here')
            setLoading(false)
            setSelectedFriend(null)
            updateFriendList(selectedFriend)
            setModalOpen(false)
        })
    }).catch(err=>{
        console.log(err)
        message.error(err)
        setLoading(false)
        setSelectedFriend(null)

    })
    console.log(selectedFriend)
  }

  const handleCancel=()=>{
    setModalOpen(false)
    setSelectedFriend(null)
  }

  return (
    <div className='top-bar'>
      <div className='section1'>
        <h3>Threads</h3>
        <UserAddOutlined /> 
      </div>
      <div className='section2'>
        <div className='search-bar'>
            <SearchBar onSelectUser={onSelectUser} />
        </div>
      </div>
      <Modal title="Add Friend" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} confirmLoading={isLoading}>
        <p>Are you sure you want to add {selectedFriend} as a friend?</p>
      </Modal>
    </div>
  )
}

TopBar.propTypes = {

}

export default TopBar

