import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { validateEmail } from '../UtilityFunctions'

import { Button, Input, message } from 'antd'
import {EyeTwoTone, EyeInvisibleOutlined} from '@ant-design/icons'
import './Login.css'
import { Link } from 'react-router-dom'

function Login(props) {
    const [emailId, setEmailId] =useState('')
    const [password, setPassword] =useState('')

    const onChangeEmail=(event)=>{
        setEmailId(event.target.value)
    }

    const onChangePassword=(event)=>{
        setPassword(event.target.value)
    }

    const onSubmitLogin=()=>{
        if(!validateEmail(emailId)){
            message.warning('Enter a valid Email')
            return
        }
    }

  return (
    <div className='login'>
        <label class='page-header'>Login</label>
        <div className='create-user'>
            <div className='email'>
                <label>Email</label>
                <Input id='emailid' placeholder='Enter Email-id' onChange={onChangeEmail} value={emailId} />
            </div>
            <div className='password'>
                <label>Password</label>
                <Input.Password id='password' placeholder='Enter Password' onChange={onChangePassword} value={password} iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}/>
            </div>
            <div className='login-button'>
                <Button onClick={onSubmitLogin} disabled={!emailId || !password}>Login</Button>
            </div>
            <Link to='/registration'><label className='link'>Register here!!</label></Link>
        </div>
    </div>
  )
}

Login.propTypes = {

}

export default Login

