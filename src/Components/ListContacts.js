import React from 'react'
import PropTypes from 'prop-types'

import ContactCard from './ContactCard'

function ListContacts({friendList, onSelectFriend, selectedFriend,...props}) {
  
    const data=(friendList || []).map(contact => {
        //if(contact && contact.id){
         return <ContactCard contact={contact} key={contact} onSelectFriend={onSelectFriend} selectedFriend={selectedFriend}/>
        //}
    })
  return (
    <div className='list-contacts'>
        {data}
    </div>
  )
}

ListContacts.propTypes = {

}

export default ListContacts

