import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {Modal, message} from 'antd'
import { generateSharedKey, aesEncrypt, aesDecrypt, exportKey, importKey, wrapKey, unwrapKey, ab2str, str2ab, arrayBufferToBase64, base64ToArrayBuffer, importRSAKey, importDiffieKey, deriveSecretKey } from '../CryptoUtility'

import SearchBar from './../Components/SearchBar'
import { server_chat_url } from '../config'

function TopBar({emailId, updateFriendList, keyPair, setFriendsKey, userKey, ...props}) {

  const [selectedFriend, setSelectedFriend] =useState(null)
  const [selectedSharedKey, setSelectedSharedKey] = useState(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const [isLoading, setLoading] = useState(false)
  
  const onSelectUser=(value)=>{
    if(value){
      console.log(value)
      setSelectedFriend(value)
      setModalOpen(true)
    }
  }

  const handleOk=async()=>{

    if(!selectedFriend){
      message.error("Please select a valid friend to add!!")
      return
    }
    //make api call
    setLoading(true)

    
    
    // const dec = new TextDecoder()
    const enc = new TextEncoder();
    // const sharedKey = await generateSharedKey()
    // console.log('sharedKey is: ', sharedKey)

    // console.log('rsaKeyString :', selectedFriend.rsaKey)

    // const publicKeyBuffer = base64ToArrayBuffer(selectedFriend.rsaKey)
    // console.log('publicKeyBuffer :',publicKeyBuffer)

    // const publicKey = await importRSAKey('spki', publicKeyBuffer, {name:'RSA-OAEP', hash: 'SHA-256'},['wrapKey'])
    // console.log('publicKey :',publicKey)

    // const wrappedKey = await wrapKey("raw", sharedKey, publicKey, "RSA-OAEP")
    // console.log("wrappedKey :",wrappedKey)

    // const wrappedkeyString = arrayBufferToBase64(wrappedKey)
    // console.log('wrappedKeyString', wrappedkeyString)

    // const exportedKey = await exportKey('raw', sharedKey)
    // console.log('exportedKey :', exportedKey)

    // const exportedKeyString = arrayBufferToBase64(exportedKey)
    // console.log('exportedKeyString :', exportedKeyString)

    // const importedKeyBuf = base64ToArrayBuffer(exportedKeyString)
    // console.log('importedKeybuf :',importedKeyBuf)

    // const unwrappedKeyBuffer = base64ToArrayBuffer(wrappedkeyString)
    // console.log('unwrappedKeyBuffer:', unwrappedKeyBuffer)

    // const unwrappedKey = await unwrapKey("raw", wrappedKey, keyPair.privateKey, "RSA-OAEP", "AES-GCM")
    // console.log("unwrappedKey :", unwrappedKey)

    // const importedKey =await importKey("raw", importedKeyBuf, "AES-GCM")
    // console.log('importedKey :',importedKey)
    
    // const unExportedKey = enc.encode(exportedKeyString)
    // console.log('unExportedKey :', unExportedKey)
    //const message1 ="Yolo!!! waiting for you outside!!!"
    //const encData = enc.encode(message1);
    //const encData = base64ToArrayBuffer(message1)
    //console.log("encData :", encData)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    //console.log('iv is:', iv)
    const ivString = ab2str(iv)
    console.log('iv string is:', ivString)

    // Convert the base64-encoded string back to a Uint8Array
    //const decodedIvString = str2ab(ivString)
    //const cipherText =await aesEncrypt(iv, sharedKey, encData)
    //console.log('encrypted data : ', cipherText)

   // const cipherTextString = dec.decode(cipherText)
   //const cipherTextString = arrayBufferToBase64(cipherText)
   //console.log('cipherTextString:',cipherTextString)


    //const cipherTextBuffer = base64ToArrayBuffer(cipherTextString)

    //console.log(cipherTextBuffer,'cipherTextBuffer')
    //const decodedSharedKey = str2ab(sharedKeyString)
    //console.log(decodedSharedKey)
    //const plainText =await aesDecrypt(decodedIvString, importedKey, cipherTextBuffer)
    
    //const decData = dec.decode(plainText)
    //console.log('decrypted data : ', decData)


    setLoading(false)
    setModalOpen(false)
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailId: emailId, friends: (selectedFriend && selectedFriend.label) || null, iv: ivString, key: null})
    };
    fetch(server_chat_url+"save", requestOptions).then((res)=>{
        if(res && res.ok )
            return res.json()
        throw res
    }).then(data=>{
        console.log(data)
        // if(data && data.key){
        //   setFriendsKey(data.key)
        // }
        message.success('Friend added successfully', 1.5, ()=>{
            //console.log('Im here')
            setLoading(false)
            setSelectedFriend(null)
            updateFriendList(selectedFriend && selectedFriend.label)
            setModalOpen(false)
        })
    }).catch(err=>{
        console.log(err)
        message.error(err)
        setLoading(false)
        setSelectedFriend(null)

    })
    console.log(selectedFriend)
  }

  const handleCancel=()=>{
    setModalOpen(false)
    setSelectedFriend(null)
  }

  return (
    <div className='top-bar'>
      <div className='section1'>
        <h3>Echo Threads</h3>
      </div>
      <div className='section2'>
        <div className='search-bar'>
            <SearchBar onSelectUser={onSelectUser} />
        </div>
      </div>
      <Modal title="Add Friend" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} confirmLoading={isLoading}>
        <p>Are you sure you want to add {selectedFriend ? selectedFriend.label : 'null'} as a friend?</p>
      </Modal>
    </div>
  )
}

TopBar.propTypes = {

}

export default TopBar

