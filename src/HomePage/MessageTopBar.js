import React from 'react'
import PropTypes from 'prop-types'
import FallbackImage from './../Images/NicePng_watsapp-icon-png_9332131.png'

function MessageTopBar(props) {
  return (
    <div className='message-top-bar'>
      <div className='top-bar-container'>
        <img src={FallbackImage} width={30} height={30} className='image'/>
        <span className='user-name'>Emre</span>
      </div>
    </div>
  )
}

MessageTopBar.propTypes = {

}

export default MessageTopBar

