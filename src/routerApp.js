import React from 'react'
import PropTypes from 'prop-types'
import { Route,BrowserRouter as Router, Routes, } from 'react-router-dom'

import Registration from './RegistrationPage/Registration'
import Login from './LoginPage/Login'

function RouterApp(props) {
  return (
      <Router>
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/login' element={<Login />} />
            <Route path='/registration' element={<Registration />} />
        </Routes>
      </Router>
  )
}

RouterApp.propTypes = {

}

export default RouterApp

