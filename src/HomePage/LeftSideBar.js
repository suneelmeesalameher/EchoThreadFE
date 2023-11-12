import React from 'react'
import PropTypes from 'prop-types'

import ListContacts from '../Components/ListContacts'
import TopBar from './TopBar'
import SpinLoader from '../Components/SpinLoader'

function LeftSideBar({onSelectFriend, friendList, selectedFriend, emailId, updateFriendList, keyPair, setFriendsKey, userKey, isListLoading, logOutUser, ...props}) {
  return (
    <div className='left-side-bar'>
        <TopBar emailId={emailId} updateFriendList={updateFriendList} keyPair={keyPair} setFriendsKey={setFriendsKey} userKey={userKey} logOutUser={logOutUser} />
        {!isListLoading ? <ListContacts onSelectFriend={onSelectFriend} friendList={friendList} selectedFriend={selectedFriend} isListLoading={isListLoading}/> : <SpinLoader size={30} />}
    </div>
  )
}

LeftSideBar.propTypes = {

}

export default LeftSideBar

