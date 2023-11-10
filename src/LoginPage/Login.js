import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { validateEmail } from '../UtilityFunctions'
import { getHash } from '../CryptoUtility'
import { performReadTransaction } from '../indexDBUtility'
import { server_url } from '../config'
import { useNavigate } from 'react-router-dom'

import { Button, Input, message } from 'antd'
import {EyeTwoTone, EyeInvisibleOutlined} from '@ant-design/icons'
import './Login.css'
import { Link } from 'react-router-dom'

function Login({changeUserStatus, setUser, setUserKey, ...props}) {
    const [emailId, setEmailId] =useState('')
    const [password, setPassword] =useState('')
    const [isLoading, setLoading] = useState(false)

    let navigate=useNavigate()

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

    const onSubmitLogin=()=>{
        if(!validateEmail(emailId)){
            message.warning('Enter a valid Email')
            return
        }
        const hashedPassword = getHash(password)
        console.log(hashedPassword)
        //process.env.REACT_APP_SERVER_URL
        setLoading(true)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailId: emailId, password: hashedPassword})
        };
        fetch(server_url+'/login', requestOptions).then((res)=>{
            if(res && res.ok )
                return res.json()
            throw res
        }).then(async data=>{
            console.log('data',data)
            if(data && data.data){
                const loginData={
                    ...data.data,
                    time: new Date()
                }
                localStorage.setItem('loginData',JSON.stringify(loginData))
                setUser(data.data)
                performReadTransaction(data.data.userId).then(res=>{
                    console.log('userData:', res)
                    setUserKey(res.privateKey)
                })

            }
            changeUserStatus(true)
            message.success('Login Successful', 1.5, ()=>{
                clearState()
                navigate('/home/'+data.data.userId)
            })
        }).catch(err=>{
            console.log('error:',err)
            message.error(err)
            setLoading(false)
        })
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
                <Button onClick={onSubmitLogin} disabled={!emailId || !password} loading={isLoading} >Login</Button>
            </div>
            <Link to='/registration'><label className='link'>Register here!!</label></Link>
        </div>
    </div>
  )
}

Login.propTypes = {

}

export default Login

