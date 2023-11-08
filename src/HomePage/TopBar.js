import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {Modal, message} from 'antd'
import { generateSharedKey, aesEncrypt, aesDecrypt, exportKey, importKey, wrapKey, unwrapKey, ab2str, str2ab } from '../CryptoUtility'

import SearchBar from './../Components/SearchBar'
import { server_chat_url } from '../config'

function TopBar({emailId, updateFriendList, keyPair, ...props}) {

  const [selectedFriend, setSelectedFriend] =useState(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const [isLoading, setLoading] = useState(false)
  
  const onSelectUser=(value)=>{
    if(value){
      setSelectedFriend(value)
      setModalOpen(true)
    }
  }

  const handleOk=async()=>{
    //make api call
    setLoading(true)
    
    const dec = new TextDecoder('utf-8')
    const enc = new TextEncoder('utf-8');
    const sharedKey = await generateSharedKey()
    console.log('sharedKey is: ', sharedKey)

    const wrappedKey = await wrapKey("raw", sharedKey, keyPair.publicKey, "RSA-OAEP")
    console.log("wrappedKey :",wrappedKey)

    const sharedKeyString = ab2str(wrappedKey)
    console.log("sharedKey String:", sharedKeyString)

    // const exportedKey = await exportKey(sharedKey)
    // console.log('exportedKey :', exportedKey)

    const unwrappedKey = await unwrapKey("raw", wrappedKey, keyPair.privateKey, "RSA-OAEP", "AES-GCM")
    console.log("unwrappedKey :", unwrappedKey)

    // const importedKey =await importKey("raw", exportedKey, "AES-GCM")
    // console.log('importedKey :',importedKey)
    // const exportedKeyString = dec.decode(exportedKey)
    // console.log('exportedKeyString :', exportedKeyString)
    // const unExportedKey = enc.encode(exportedKeyString)
    // console.log('unExportedKey :', unExportedKey)
    const message ="Yolo!!! waiting for you outside!!!"
    const encData = enc.encode(message);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const ivString = ab2str(iv)

    // Convert the base64-encoded string back to a Uint8Array
    const decodedIvString = str2ab(ivString)
    const cipherText =await aesEncrypt(iv, sharedKey, encData)
    console.log('encrypted data : ', cipherText)
    //const decodedSharedKey = str2ab(sharedKeyString)
    //console.log(decodedSharedKey)
    const plainText =await aesDecrypt(decodedIvString, unwrappedKey, cipherText)
    
    const decData = dec.decode(plainText)
    console.log('decrypted data : ', decData)
    // setLoading(false)
    // setModalOpen(false)
    // const requestOptions = {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ emailId: emailId, friends: selectedFriend})
    // };
    // fetch(server_chat_url+"save", requestOptions).then((res)=>{
    //     if(res && res.ok )
    //         return res.json()
    //     throw res
    // }).then(data=>{
    //     console.log(data)
    //     message.success('Friend added successfully', 1.5, ()=>{
    //         //console.log('Im here')
    //         setLoading(false)
    //         setSelectedFriend(null)
    //         updateFriendList(selectedFriend)
    //         setModalOpen(false)
    //     })
    // }).catch(err=>{
    //     console.log(err)
    //     message.error(err)
    //     setLoading(false)
    //     setSelectedFriend(null)

    // })
    // console.log(selectedFriend)
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
        <p>Are you sure you want to add {selectedFriend} as a friend?</p>
      </Modal>
    </div>
  )
}

TopBar.propTypes = {

}

export default TopBar

