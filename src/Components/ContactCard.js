import React from 'react'
import PropTypes from 'prop-types'

import FallbackImage from './../Images/NicePng_watsapp-icon-png_9332131.png'

function ContactCard({contact,...props}) {
  return (
    <div className='contact-card'>
        <div className='profile-container'>
            <div className='image-container'>
                <img src={FallbackImage} width={30} height={30} className='image'/>
            </div>
            <div className='data-container'>
                <span>{contact.name}</span>
                <span>{contact.email}</span>
            </div>
        </div>
    </div>
  )
}

ContactCard.propTypes = {

}

export default ContactCard

