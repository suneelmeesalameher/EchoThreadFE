import { createHash } from "crypto-browserify";
//adding AES encryption

const getHash=(value)=>{
    const hash = createHash("sha256").update(value,"utf-8").digest("hex")
    return hash
}

//generates shared AES key
const generateSharedKey=()=>{
    const sharedKey = crypto.subtle.generateKey({
        name: "AES-GCM",
        length: 256,
    },
    true,
    ['encrypt','decrypt'])
    return sharedKey
}

//fn to encrypt data using AES-GCM
const aesEncrypt=(iv, key, data)=>{
    return crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv
        },
        key,
        data
    )
}

//fn to decrypt data using AES-GCM
const aesDecrypt=(iv, key ,data)=>{
    
    return crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: iv
        },
        key,
        data
    )
}

//fn to export key from cryptoKey obj to external format
const exportKey=(key)=>{
    return crypto.subtle.exportKey("raw", key)
}

//fn to import key from external format to cryptoKey obj
const importKey=( format, key, algorithm)=>{
    return crypto.subtle.importKey(format, key, algorithm, true, ['encrypt','decrypt'])
}

//function to generate RSA keyPair
const generateRSAKey=()=>{
   const keyPair = crypto.subtle.generateKey({
    name: 'RSA-OAEP',
    modulusLength: 2048, // Key size in bits
    publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537 in little-endian format
    hash: 'SHA-256',
  },
  true, // Can be used for both encryption and decryption
  ['wrapKey', 'unwrapKey']);
    console.log(keyPair)
    return keyPair
}


const wrapKey=(format, keyToWrap, wrappingKey, algorithm)=>{
    //console.log(publicKey,'public')
    return crypto.subtle.wrapKey(format, keyToWrap, wrappingKey, algorithm);
}

const unwrapKey=(format, keyToUnWrap, unwrappingKey, algorithm, algorithmForUnwrappedKey)=>{
    return crypto.subtle.unwrapKey(format, keyToUnWrap, unwrappingKey, algorithm, algorithmForUnwrappedKey, true, ['encrypt','decrypt'])
}

const rsaEncryptMessage=(publicKey, data)=>{
    //console.log(publicKey,'public')
    return crypto.subtle.encrypt({
        name: "RSA-OAEP"
    },
    publicKey,
    data);
}

const rsaDecryptMessage=(privateKey, data)=>{
    console.log(privateKey,'private')
    return crypto.subtle.decrypt({
        name: "RSA-OAEP"
    },
    privateKey,
    data);
}

function ab2str(buf) {
    return btoa(String.fromCharCode.apply(null, buf))
}

function str2ab(str) {
    const decodedIvString = atob(str);
    const ivArray = new Uint8Array(decodedIvString.length);
    for (let i = 0; i < decodedIvString.length; i++) {
      ivArray[i] = decodedIvString.charCodeAt(i);
    }
    return ivArray
} 


export {getHash, generateRSAKey, rsaEncryptMessage, rsaDecryptMessage, generateSharedKey, aesEncrypt, aesDecrypt, exportKey, importKey, wrapKey, unwrapKey, ab2str, str2ab};