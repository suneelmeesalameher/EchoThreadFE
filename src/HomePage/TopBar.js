import React from 'react'
import PropTypes from 'prop-types'
import { MessageOutlined } from '@ant-design/icons'

function TopBar(props) {
  return (
    <div className='top-bar'>
      <div className='section1'>
        <h3>Threads</h3>
        <MessageOutlined />
      </div>
      <div className='section2'>
        <div className='search-bar'>
            Search Bar
        </div>
      </div>
    </div>
  )
}

TopBar.propTypes = {

}

export default TopBar

