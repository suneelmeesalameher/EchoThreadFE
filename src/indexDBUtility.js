const dbName = 'KeysDB';

    const openDatabase = async () => {
      const request = await window.indexedDB.open(dbName, 2);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore('UserKeys', { keyPath: 'userId' });
      };

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = (event) => {
          reject('Error opening database');
        };
      });
    };

    const performWriteTransaction = async (data) => {
      const db = await openDatabase();

      if (!db.objectStoreNames.contains('UserKeys')) {
        // Create the 'myTable' object store if it doesn't exist
        db.createObjectStore('UserKeys', { keyPath: 'userId' });
      }
      // Perform a transaction
      const transaction = db.transaction(['UserKeys'], 'readwrite');
      const objectStore = transaction.objectStore('UserKeys');

      // Add data
      //const dataToAdd = { userId: 'John Doe', age: 25 };
      const requestAdd = objectStore.add(data);

      requestAdd.onsuccess = () => {
        console.log('Data added successfully');
        db.close()
      };

      requestAdd.onerror = () => {
        console.error('Error adding data');
      };

    };

    const performReadTransaction=async(userId)=>{

        const db = await openDatabase();

      if (!db.objectStoreNames.contains('UserKeys')) {
        // Create the 'myTable' object store if it doesn't exist
        console.log("Error: trying to read from objectStore that doesnt exist!!!")
        return
      }
      return new Promise ((resolve, reject)=>{
        const transaction = db.transaction(['UserKeys'], 'readwrite');
        const objectStore = transaction.objectStore('UserKeys');
           // Retrieve data
        const requestGet = objectStore.get(userId);
  
        requestGet.onsuccess = (event) => {
          const result = event.target.result;
          db.close()
          resolve(result)
        };
  
        requestGet.onerror = () => {
          console.error('Error retrieving data');
          reject('Error retrieving data!!!')
        };
      })
   
    }

    export {performWriteTransaction, performReadTransaction}
