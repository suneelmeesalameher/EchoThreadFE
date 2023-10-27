import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
// import hashEncrption from '@prajeshkotian/cryptoproject'

import { validateEmail } from '../UtilityFunctions'
import { server_url } from '../config'

import { Button, Input, message } from 'antd'
import {EyeTwoTone, EyeInvisibleOutlined} from '@ant-design/icons'
import './Registration.css'
import { Link } from 'react-router-dom'

function Registration(props) {
    const [emailId, setEmailId] =useState('')
    const [password, setPassword] =useState('')
    const [isLoading, setLoading] = useState(false)

    let navigate = useNavigate()

    const onChangeEmail=(event)=>{
        setEmailId(event.target.value)
    }

    const onChangePassword=(event)=>{
        setPassword(event.target.value)
    }

    const clearState=()=>{
        setEmailId('')
        setPassword('')
        setLoading(false)
    }

    const onSubmitRegistration=()=>{
        if(!validateEmail(emailId)){
            message.warning('Enter a valid Email')
            return
        }
        // const hashedPassword = hashEncrption(password)
        // console.log(hashedPassword)
        //process.env.REACT_APP_SERVER_URL
        setLoading(true)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailId: emailId, password: password})
        };
        fetch(server_url, requestOptions).then((res)=>{
            if(res && res.ok )
                return res.json()
            throw res
        }).then(data=>{
            console.log(data)
            message.success('Registration Successfully Completed', 1.5, ()=>{
                clearState()
                navigate('/login')
            })
        }).catch(err=>{
            console.log(err)
            message.error(err)
            setLoading(false)
        })
    }

  return (
    <div className='registration'>
        <label class='page-header'>Registration</label>
        <div className='create-user'>
            <div className='email'>
                <label>Email</label>
                <Input id='emailid' placeholder='Enter Email-id' onChange={onChangeEmail} value={emailId} />
            </div>
            <div className='password'>
                <label>Password</label>
                <Input.Password id='password' placeholder='Enter Password' onChange={onChangePassword} value={password} iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}/>
            </div>
            <div className='register-button'>
                <Button onClick={onSubmitRegistration} disabled={!emailId || !password} loading={isLoading} >Register</Button>
            </div>
            <Link to='/login'><label>Login here!!</label></Link>
        </div>
    </div>
  )
}

Registration.propTypes = {

}

export default Registration

