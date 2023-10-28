const server_url="https://echothread.onrender.com/user"
const server_chat_url="https://echothread.onrender.com/chat/"

const makeAPIRequest=(url, requestOptions)=>{
  const data = fetch(server_url, requestOptions).then((res)=>{
        if(res && res.ok )
            return res.json()
        throw res
    }).then(data=>{
       return data
    }).catch(err=>{
        console.log(err)
        return err
    })
    return data
}


export {server_url, server_chat_url, makeAPIRequest}