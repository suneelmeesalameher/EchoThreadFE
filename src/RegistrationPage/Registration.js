import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'


import { validateEmail, validatePassword } from '../UtilityFunctions'
import { server_url } from '../config'
import { getHash, generateRSAKey, arrayBufferToBase64, exportKey, base64ToArrayBuffer, importKey, importRSAKey, generateDiffieKeyPair, deriveSecretKey, importDiffieKey, generateKeyPair } from '../CryptoUtility'
import { performWriteTransaction } from '../indexDBUtility'

import { Button, Input, message, Tooltip } from 'antd'
import {EyeTwoTone, EyeInvisibleOutlined, InfoCircleFilled} from '@ant-design/icons'
import './Registration.css'
import { Link } from 'react-router-dom'

function Registration(props) {
    const [emailId, setEmailId] =useState('')
    const [password, setPassword] =useState('')
    const [confirmPassword, setConfirmPassword] =useState('')
    const [isLoading, setLoading] = useState(false)

    let navigate = useNavigate()

    // const dbName = 'Keys-DB';
    // const request = window.indexedDB.open(dbName, 1);

    // request.onupgradeneeded = (event) => {
    //   const db = event.target.result;
    //   const objectStore = db.createObjectStore('UserKeys', { keyPath: 'userId' });
    // //   objectStore.createIndex('name', 'name', { unique: false });
    // //   objectStore.createIndex('age', 'age', { unique: false });
    // };

    // request.onsuccess = (event) => {
    //   const db = event.target.result;

    //   // Add data to the database
    //   const addData = (data) => {
    //     const transaction = db.transaction(['UserKeys'], 'readwrite');
    //     const objectStore = transaction.objectStore('UserKeys');
    //     const request = objectStore.add(data);

    //     request.onsuccess = () => {
    //       console.log('Data added successfully');
    //     };

    //     request.onerror = () => {
    //       console.error('Error adding data');
    //     };
    //   };

    //   // Example data
    //   const data1 = { name: 'John Doe', age: 25 };
    //   const data2 = { name: 'Jane Doe', age: 30 };

    //   // Add data to the database
    //   addData(data1);
    //   addData(data2);
    // };

    // request.onerror = (event) => {
    //   console.error('Error opening database');
    // };

    const onChangeEmail=(event)=>{
        setEmailId(event.target.value)
    }

    const onChangePassword=(event)=>{
        setPassword(event.target.value)
    }

    const onChangeConfirmPassword=(event)=>{
        setConfirmPassword(event.target.value)
    }

    const clearState=()=>{
        setEmailId('')
        setPassword('')
        setLoading(false)
    }

    const onSubmitRegistration=async()=>{
        if(!validateEmail(emailId)){
            message.warning('Enter a valid Email')
            return
        }
        if(!password){
            message.warning('Enter a valid Password')
            return
        }
        if(password && confirmPassword && password != confirmPassword){
            message.warning('The password does not match the confirmed password!')
            return
        }
        if(password && !validatePassword(password)){
            message.warning('The password requirements not met!')
            return
        }
        const hashedPassword = getHash(password)
        //process.env.REACT_APP_SERVER_URL
        setLoading(true)
        
        //diffi key generation
        const keyPair=await generateDiffieKeyPair()
        const exportedKey = await exportKey('raw', keyPair.publicKey)
        const exportedKeyString = arrayBufferToBase64(exportedKey)

        //DS key generation
        const dskeyPair =await generateKeyPair({name: 'ECDSA', namedCurve: 'P-384'},['sign','verify'])
        console.log('dsKeyPair :',dskeyPair)
        const exportedDSKey = await exportKey('raw', dskeyPair.publicKey)
        console.log('exportedDSKey :', exportedDSKey)
        const dsKeyString = arrayBufferToBase64(exportedDSKey)
        console.log('dsKeyString :',dsKeyString)
        // const importedDSKeyBuffer = base64ToArrayBuffer(dsKeyString)
        // console.log('importedDSKeyBuffer :', importedDSKeyBuffer)
        // const importedDSKey = await importKey('raw', exportedDSKey, {name: 'ECDSA', namedCurve:'P-384'},['verify'])
        // console.log('importedDSKey :',importedDSKey)
            
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailId: emailId, password: hashedPassword, rsaKey: exportedKeyString})
        };
        fetch(server_url, requestOptions).then((res)=>{
            if(res && res.ok )
                return res.json()
            throw res
        }).then(async(data)=>{
            const privateKeyData={
                userId: data.userId,
                privateKey: keyPair.privateKey,
                dsPrivateKey: dskeyPair.privateKey
            }
            performWriteTransaction(privateKeyData)
            console.log('registration data', data)
            message.success('Registration Successfully Completed', 1.5, ()=>{
                clearState()
                navigate('/login')
            })
        }).catch(err=>{
            console.log(err)
           // message.error(err)
            setLoading(false)
        })
        
    }

  return (
    <div className='registration'>
        <div className='registration-left'>
        <div className='page-top'>
            <p>Welcome to Echo Thread Community</p>
            <p>You are one click away from a secure echoing environment</p>
        </div>
        <div className='page-bottom'>
        <label className='page-header'>Sign Up</label>
        <div className='create-user'>
            <div className='email'>
                <label>Email</label>
                <Input id='emailid' placeholder='Enter Email-id' onChange={onChangeEmail} value={emailId} />
            </div>
            <div className='password'>
                <label>
                    Password
                    <Tooltip placement='top' title={'Password needs to be minimum 8 characters length and must contain Uppercase, lowercase, number and special characters'}><InfoCircleFilled /></Tooltip>
                </label>
                
                <Input.Password id='password' placeholder='Enter Password' onChange={onChangePassword} value={password} iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}/>
            </div>
            <div className='password'>
                <label>Confirm Password</label>
                <Input.Password id='confirm-password' placeholder='Enter Password' onChange={onChangeConfirmPassword} value={confirmPassword} iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}/>
            </div>
            <div className='register-button'>
                <Button onClick={onSubmitRegistration} disabled={!emailId || !password} loading={isLoading} >Register</Button>
            </div>
        </div>
        </div>
        </div>
        <div className='registration-right'>
            <div className='registration-pic' />
            <div className='registration-login'>
                <p>Already part of the community ?</p>
                <p>Login Here</p>
                <Link to='/login'><Button className='link-login'>Login</Button></Link>
            </div>
        </div>
        
        
    </div>
  )
}

Registration.propTypes = {

}

export default Registration

