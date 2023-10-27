import React from 'react'
import PropTypes from 'prop-types'

import ContactCard from './ContactCard'

function ListContacts({contactList, ...props}) {
    const data=(contactList || []).map(contact => {
        //if(contact && contact.id){
         return <ContactCard contact={contact} key={contact.id}/>
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

