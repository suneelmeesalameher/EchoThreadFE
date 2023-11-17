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
const exportKey=(format, key)=>{
    return crypto.subtle.exportKey(format, key)
}

//fn to import key from external format to cryptoKey obj
const importKey=( format, key, algorithm, usage)=>{
    return crypto.subtle.importKey(format, key, algorithm, true, usage ? usage : ['encrypt','decrypt'])
}

const importDiffieKey=( format, key, algorithm)=>{
    return crypto.subtle.importKey(format, key, algorithm, true, [])
}

const importRSAKey=( format, key, algorithm, usage)=>{
    return crypto.subtle.importKey(format, key, algorithm, true, usage)
}

//function to generate RSA keyPair
const generateRSAKey=(usage)=>{
   const keyPair = crypto.subtle.generateKey({
    name: 'RSA-OAEP',
    modulusLength: 2048, // Key size in bits
    publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537 in little-endian format
    hash: 'SHA-256',
  },
  true, // Can be used for both encryption and decryption
  usage);
    console.log(keyPair)
    return keyPair
}

const generateKeyPair=(algorithm, usage)=>{
    return crypto.subtle.generateKey(algorithm, true, usage)
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


const generateDiffieKeyPair=()=>{
    return crypto.subtle.generateKey({
        name: "ECDH",
        namedCurve: "P-384"
    },
    true,
    ['deriveKey'])
}

const deriveSecretKey=(privateKey, publicKey)=>{
    return crypto.subtle.deriveKey({
        name: 'ECDH',
        public: publicKey
    },
    privateKey,
    {
        name: 'AES-GCM',
        length: 256,
    },
    true,
    ['encrypt','decrypt'])
}


const signMessage=(privateKey, data)=>{
    return crypto.subtle.sign({
        name: 'ECDSA',
        hash: {name: 'SHA-384'},
    },
    privateKey,
    data)
}

const verifyMessage=(publicKey, signature, data)=>{
    return crypto.subtle.verify({
        name: 'ECDSA',
        hash: {name: 'SHA-384'},
    },
    publicKey,
    signature,
    data)
}

function ab2str(buf) {
    return btoa(String.fromCharCode.apply(null, buf))
}

function ab2str2(buf) {
    return btoa(String.fromCharCode.apply(null,new Uint8Array(buf)))
}

function str2ab(str) {
    const decodedIvString = atob(str);
    const ivArray = new Uint8Array(decodedIvString.length);
    for (let i = 0; i < decodedIvString.length; i++) {
      ivArray[i] = decodedIvString.charCodeAt(i);
    }
    return ivArray
}

function arrayBufferToBase64(arrayBuffer) {
    const uint8Array = new Uint8Array(arrayBuffer);
    const base64String = btoa(String.fromCharCode.apply(null, uint8Array));
    return base64String;
  }

  function base64ToArrayBuffer(base64String) {
    const binaryString = atob(base64String);
    const uint8Array = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }
    return uint8Array.buffer;
  }

  function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

export {getHash, generateRSAKey, rsaEncryptMessage, rsaDecryptMessage, generateSharedKey, aesEncrypt, aesDecrypt, exportKey, importKey, wrapKey, unwrapKey, ab2str, str2ab, ab2str2, arrayBufferToBase64, base64ToArrayBuffer, arraysEqual, importRSAKey, generateDiffieKeyPair, deriveSecretKey, importDiffieKey, generateKeyPair, signMessage, verifyMessage};