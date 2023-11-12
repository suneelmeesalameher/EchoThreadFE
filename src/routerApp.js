import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Route,BrowserRouter as Router, Routes, } from 'react-router-dom'

import Registration from './RegistrationPage/Registration'
import Login from './LoginPage/Login'
import HomePage from './HomePage/HomePage'

function RouterApp({...props}) {

  const [userLoggedIn, setUserLoggedIn] = useState(true)
  const [user, setUser] = useState(null)
  const [userKey, setUserKey] = useState(null)

  const changeUserStatus=(value)=>{
    setUserLoggedIn(value)
  }

  useEffect(()=>{

  },[userLoggedIn])

  const routeList=[
    {
      name: 'login',
      validationRequired: false,
      jsx: (<Route path='/login' element={<Login changeUserStatus={changeUserStatus}  setUser={setUser} setUserKey={setUserKey}/>} key='login'/>)
    },
    {
      name: 'registration',
      validationRequired: false,
      jsx: (<Route path='/registration' element={<Registration />} key='registration'/>)
    },
    {
      name: 'home',
      validationRequired: true,
      jsx: (<Route path='/home/:id' element={<HomePage user={user} userKey={userKey} setUserKey={setUserKey}/>} key='home'/>)
    }
  ]

  const getRoutes=()=>{
    const routes = (routeList || []).filter(route=>{
      if(userLoggedIn){
       return route.jsx
      }
      else if(!userLoggedIn){
       if(!route.validationRequired){
         return route.jsx
       }
      }
     })

     const newRoutes = (routes || []).map(route=>{
      return route.jsx
     })
     return newRoutes
  }
  

  return (
      <Router>
        <Routes>
            {/* <Route path='/' element={<Login />} />
            <Route path='/login' element={<Login />} />
            <Route path='/registration' element={<Registration />} />
            <Route path='/home' element={<HomePage />} /> */}
            <Route path='/' element={<Login changeUserStatus={changeUserStatus} setUser={setUser} setUserKey={setUserKey}/>} />
            {getRoutes()}
        </Routes>
      </Router>
  )
}

RouterApp.propTypes = {

}

export default RouterApp

