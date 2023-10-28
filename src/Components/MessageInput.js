import React from 'react'
import PropTypes from 'prop-types'

import Input from 'antd/es/input/Input'
import {SendOutlined} from '@ant-design/icons'

function MessageInput({onChangeMessage, onMessageSend, newMessage,...props}) {
  return (
    <div className='message-box'>
      <Input size='large' placeholder='Type message here ...' suffix={<SendOutlined onClick={onMessageSend}/>} onChange={onChangeMessage} value={newMessage}/>
    </div>
  )
}

MessageInput.propTypes = {

}

export default MessageInput

