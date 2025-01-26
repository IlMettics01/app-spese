// db.js
const dbName = 'speseDB';
const dbVersion = 1;
let db;

const initDB = () => {
    return new Promise((resolve, reject) => {
        console.log('Inizializzazione database...');
        const request = indexedDB.open(dbName, dbVersion);

        request.onerror = (event) => {
            console.error('Errore database:', event.target.error);
            reject(event.target.error);
        };

        request.onsuccess = (event) => {
            console.log('Database aperto con successo');
            db = event.target.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            console.log('Aggiornamento struttura database...');
            const db = event.target.result;
            const store = db.createObjectStore('spese', { 
                keyPath: 'id', 
                autoIncrement: true 
            });
            store.createIndex('data', 'data');
            store.createIndex('tipo', 'tipo');
            console.log('Database strutturato correttamente');
        };
    });
};

const aggiungiSpesa = (spesa) => {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database non inizializzato'));
            return;
        }

        try {
            const transaction = db.transaction(['spese'], 'readwrite');
            const store = transaction.objectStore('spese');
            const request = store.add(spesa);

            request.onsuccess = () => {
                console.log('Spesa salvata con successo');
                resolve(request.result);
            };

            request.onerror = () => {
                console.error('Errore salvataggio:', request.error);
                reject(request.error);
            };
        } catch (error) {
            console.error('Errore transazione:', error);
            reject(error);
        }
    });
};