import React from 'react'
import PropTypes from 'prop-types'

import Input from 'antd/es/input/Input'
import {SendOutlined, LoadingOutlined} from '@ant-design/icons'

function MessageInput({onChangeMessage, onMessageSend, newMessage, isSendingMessage, onEnterKeyPress, ...props}) {
  return (
    <div className='message-box'>
      <Input size='large' placeholder='Type message here ...' suffix={isSendingMessage ? <LoadingOutlined /> : <SendOutlined onClick={onMessageSend}/>} onChange={onChangeMessage} value={newMessage} onPressEnter={(e)=>onEnterKeyPress(e)}/>
    </div>
  )
}

MessageInput.propTypes = {

}

export default MessageInput

