// sheets.js
const SHEET_ID = '1fjNnBwsQ40PXANk3MYBiBXmaBZIgVehIcFJ2XT68eo8';
const API_KEY = 'AIzaSyAow--PcNKFqEZma7YIkrBNMVucoRLNAN0';
const RANGE = 'Transazioni!C11:G';

async function appendToSheet(spesa) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;
    
    const values = [
        [
            spesa.data,
            spesa.tipo,
            spesa.categoria,
            spesa.descrizione,
            spesa.importo
        ]
    ];

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                values: values
            })
        });
        
        if (!response.ok) throw new Error('Errore nella sincronizzazione');
        return await response.json();
    } catch (error) {
        console.error('Errore:', error);
        throw error;
    }
}