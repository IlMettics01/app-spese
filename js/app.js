// Registrazione Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => console.log('ServiceWorker registrato'))
        .catch(error => console.log('Errore registrazione ServiceWorker:', error));
}

// Inizializzazione dell'app
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await initDB();
        
        const form = document.getElementById('spesaForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const spesa = {
                data: document.getElementById('data').value,
                tipo: document.getElementById('tipo').value,
                categoria: document.getElementById('categoria').value,
                descrizione: document.getElementById('descrizione').value,
                importo: Number(document.getElementById('importo').value)
            };

            try {
                // Salva localmente
                await aggiungiSpesa(spesa);
                // Sincronizza con Google Sheets
                await appendToSheet(spesa);
                
                form.reset();
                alert('Spesa salvata e sincronizzata!');
            } catch (error) {
                console.error('Errore:', error);
                alert('Errore nel salvataggio o nella sincronizzazione');
            }
        });
    } catch (error) {
        console.error('Errore inizializzazione:', error);
    }
});