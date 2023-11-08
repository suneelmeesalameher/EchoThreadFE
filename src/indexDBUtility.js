const indexedDB = window.indexedDB

const request = indexedDB.open('key-db1', 1)

request.onerror=function(event){
    console.log("an error occurred with indexDB", event)
}

request.onupgradeneeded=function(){
    const db = request.result
    const store = db.createObjectStore('userKeys',{keyPath: 'userId'})

}
