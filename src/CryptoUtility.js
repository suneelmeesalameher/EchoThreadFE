import { generateKey, generateKeyPair, generateKeyPairSync } from "crypto";
import { createHash } from "crypto-browserify";
//adding AES encryption

const getHash=(value)=>{
    const hash = createHash("sha256").update(value,"utf-8").digest("hex")
    return hash
}

const generateRSAKey=()=>{
   const keyPair = crypto.subtle.generateKey({
    name: 'RSA-OAEP',
    modulusLength: 2048, // Key size in bits
    publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537 in little-endian format
    hash: 'SHA-256',
  },
  true, // Can be used for both encryption and decryption
  ['encrypt', 'decrypt']);
    console.log(keyPair)
    return keyPair
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

export {getHash, generateRSAKey, rsaEncryptMessage, rsaDecryptMessage};