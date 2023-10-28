import React from 'react'
import PropTypes from 'prop-types'

import Input from 'antd/es/input/Input'
import {SendOutlined} from '@ant-design/icons'

function MessageInput({onChangeMessage,...props}) {
  return (
    <div className='message-box'>
      <Input size='large' placeholder='Type message here ...' suffix={<SendOutlined />} onChange={onChangeMessage} />
    </div>
  )
}

MessageInput.propTypes = {

}

export default MessageInput

