import React from 'react'
import PropTypes from 'prop-types'

import LeftSideBar from './LeftSideBar'
import ChatWindow from './ChatWindow'

import{Row, Col} from "antd"
import "./HomePage.css"

function HomePage(props) {
  return (
    <div className='home-page'>
      <Row>
        <Col xs={2} sm={3} md={4} lg={5} xl={6}>
          <LeftSideBar />
        </Col>
        <Col xs={6} sm={8} md={12} lg={14} xl={16}>
          <ChatWindow />
        </Col>
      </Row>
    </div>
  )
}

HomePage.propTypes = {

}

export default HomePage

