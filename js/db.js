const dbName = 'speseDB';
const dbVersion = 1;

let db;

// Modifica in db.js
const initDB = () => {
    return new Promise((resolve, reject) => {
        if (!window.indexedDB) {
            reject(new Error('Il tuo browser non supporta IndexedDB'));
            return;
        }

        const request = indexedDB.open(dbName, dbVersion);

        request.onerror = (event) => {
            console.error('Errore apertura DB:', event.target.error);
            reject(event.target.error);
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            console.log('Database inizializzato con successo');
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('spese')) {
                const store = db.createObjectStore('spese', { 
                    keyPath: 'id', 
                    autoIncrement: true 
                });
                store.createIndex('data', 'data');
                store.createIndex('tipo', 'tipo');
                console.log('Store spese creato');
            }
        };
    });
};