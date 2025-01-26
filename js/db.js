const dbName = 'speseDB';
const dbVersion = 1;

let db;

const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, dbVersion);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            const store = db.createObjectStore('spese', { 
                keyPath: 'id', 
                autoIncrement: true 
            });
            
            store.createIndex('data', 'data');
            store.createIndex('tipo', 'tipo');
        };
    });
};

const aggiungiSpesa = (spesa) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['spese'], 'readwrite');
        const store = transaction.objectStore('spese');
        const request = store.add(spesa);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};