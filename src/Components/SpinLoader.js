import React from 'react'
import PropTypes from 'prop-types'
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

function SpinLoader({size, ...props}) {
  return (
    <div className='spin-loader'>
      <Spin
        indicator={
        <LoadingOutlined
            style={{
            fontSize: size,
            color: '#6AA602'
            }}
            spin
        />
    }
  />
    </div>
  )
}

SpinLoader.propTypes = {

}

export default SpinLoader

