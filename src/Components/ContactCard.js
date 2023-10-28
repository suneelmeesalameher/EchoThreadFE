import React from 'react'
import PropTypes from 'prop-types'

import FallbackImage from './../Images/NicePng_watsapp-icon-png_9332131.png'

function ContactCard({contact, onSelectFriend, selectedFriend,...props}) {
  return (
    <div className={'contact-card'+ (selectedFriend == contact ? ' selected' : '') } onClick={()=>onSelectFriend(contact)}>
        <div className='profile-container'>
            <div className='image-container'>
                <img src={FallbackImage} width={30} height={30} className='image'/>
            </div>
            <div className='data-container'>
                {/* <span>{contact}</span> */}
                <span>{contact}</span>
            </div>
        </div>
    </div>
  )
}

ContactCard.propTypes = {

}

export default ContactCard

