import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'


import { validateEmail } from '../UtilityFunctions'
import { server_url } from '../config'
import { getHash, generateRSAKey, arrayBufferToBase64, exportKey, base64ToArrayBuffer, importKey, importRSAKey, generateDiffieKeyPair, deriveSecretKey, importDiffieKey } from '../CryptoUtility'
import { performWriteTransaction } from '../indexDBUtility'

import { Button, Input, message } from 'antd'
import {EyeTwoTone, EyeInvisibleOutlined} from '@ant-design/icons'
import './Registration.css'
import { Link } from 'react-router-dom'

function Registration(props) {
    const [emailId, setEmailId] =useState('')
    const [password, setPassword] =useState('')
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
        const hashedPassword = getHash(password)
        //process.env.REACT_APP_SERVER_URL
        setLoading(true)
        // const keyPair=await generateRSAKey()
        
        // console.log('PublicKey:',keyPair.publicKey)
        // const exportedKey = await exportKey('spki', keyPair.publicKey)
        // console.log('exportedKey :', exportedKey)
        // const exportedKeyString = arrayBufferToBase64(exportedKey)
        // console.log('exportedKeyString :',exportedKeyString)
        // console.log('PrivateKey:',keyPair.privateKey)
        // const exportedPrivateKey = await exportKey('pkcs8', keyPair.privateKey)
        // console.log('exportedPrivateKey', exportedPrivateKey)
        // const exportedPrivateKeyString = arrayBufferToBase64(exportedPrivateKey)
        // console.log('exportedPrivateKeyString :',exportedPrivateKeyString)


        // const importedKeyBuf = base64ToArrayBuffer(exportedKeyString)
        // console.log('importedKeyBuf:', importedKeyBuf)
        // const importedKey =await importRSAKey('spki', importedKeyBuf, {name:'RSA-OAEP', hash: 'SHA-256'},['wrapKey'])
        // console.log('importedKey :',importedKey)


        //diffi testing
        const keyPair=await generateDiffieKeyPair()
        console.log('A - Keys',keyPair)
        // const bkeyPair=await generateDiffieKeyPair()
        // console.log('B - Keys',bkeyPair.privateKey)
        // const secreta=await deriveSecretKey(akeyPair.privateKey, bkeyPair.publicKey)
        // console.log('secreta - ', secreta)
        // const secretb=await deriveSecretKey(bkeyPair.privateKey, akeyPair.publicKey)
        // console.log('secretb - ',secretb)
        const exportedKey = await exportKey('raw', keyPair.publicKey)
        console.log('exportedKey :', exportedKey)
        const exportedKeyString = arrayBufferToBase64(exportedKey)
        console.log('exportedKeyString :',exportedKeyString)

        // const importedKeyBuffer = base64ToArrayBuffer(exportedKeyString)
        // console.log('importedKeyBuffer :',importedKeyBuffer)
        // const importedKey = await importDiffieKey('raw', importedKeyBuffer, {name: 'ECDH', namedCurve: 'P-384'})
        // console.log('importedKey', importedKey)
        // const exportedKeyB = await exportKey('raw', secretb)
        // console.log('exportedKey :', exportedKeyB)

        // const exportedKeyStringA = arrayBufferToBase64(exportedKeyA)
        // console.log('exportedKeyStringA :', exportedKeyStringA)
        // const exportedKeyStringB = arrayBufferToBase64(exportedKeyB)
        // console.log('exportedKeyStringB :', exportedKeyStringB)
            
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
                privateKey: keyPair.privateKey
            }
            console.log('privateKeyData :', privateKeyData)
            performWriteTransaction(privateKeyData)
            console.log('registration data', data)
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

