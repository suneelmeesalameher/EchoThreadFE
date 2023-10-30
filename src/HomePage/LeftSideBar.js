import React from 'react'
import PropTypes from 'prop-types'

import ListContacts from '../Components/ListContacts'
import TopBar from './TopBar'

function LeftSideBar({onSelectFriend, friendList, selectedFriend, emailId, updateFriendList, ...props}) {
  return (
    <div className='left-side-bar'>
        <TopBar emailId={emailId} updateFriendList={updateFriendList} />
        <ListContacts onSelectFriend={onSelectFriend} friendList={friendList} selectedFriend={selectedFriend}/>
    </div>
  )
}

LeftSideBar.propTypes = {

}

export default LeftSideBar

