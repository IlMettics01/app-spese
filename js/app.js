// Registrazione Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => console.log('ServiceWorker registrato'))
        .catch(error => console.log('Errore registrazione ServiceWorker:', error));
}

// Funzioni per popolare i menu a tendina
const popolaMenuTipo = () => {
    const tipoSelect = document.getElementById('tipo');
    const tipi = ['REDDITO', 'SPESE', 'RISPARMI', 'DEBITI'];
    
    tipoSelect.innerHTML = '<option value="">Seleziona tipo</option>';
    tipi.forEach(tipo => {
        tipoSelect.innerHTML += `<option value="${tipo}">${tipo}</option>`;
    });
};

const popolaMenuCategoria = (tipoSelezionato) => {
    const categoriaSelect = document.getElementById('categoria');
    const categorie = {
        'REDDITO': [
            'Stipendio',
            'Reddito Secondario',
            'Rimborsi',
            'Regali',
            'Buoni Pasto',
            'Dichiarazione dei Redditi',
            'Rata Macchina Periodica',
            'Versamenti'
        ],
        'SPESE': [
            'Utenze',
            'Spesa',
            'Ristoranti e Uscite',
            'Salute',
            'Vestiti',
            'Auto',
            'Vacanze',
            'Internet/Telefono',
            'Acquisti Online',
            'Casa',
            'Svago & Giochi',
            'Tasse',
            'Svapo'
        ],
        'RISPARMI': [
            'Fondo di emergenza',
            'Viaggi',
            'Regali'
        ],
        'DEBITI': [
            'Carta di credito',
            'Rata auto'
        ]
    };

    categoriaSelect.innerHTML = '<option value="">Seleziona categoria</option>';
    if (tipoSelezionato && categorie[tipoSelezionato]) {
        categorie[tipoSelezionato].forEach(categoria => {
            categoriaSelect.innerHTML += `<option value="${categoria}">${categoria}</option>`;
        });
    }
};

// Inizializzazione dell'app (sperando che funzioni)
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await initDB();
        popolaMenuTipo();
        
        // Event listener per il cambio del tipo
        const tipoSelect = document.getElementById('tipo');
        tipoSelect.addEventListener('change', (e) => {
            popolaMenuCategoria(e.target.value);
        });

        // Event listener per il form
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
                if (typeof appendToSheet === 'function') {
                    await appendToSheet(spesa);
                }
                
                form.reset();
                popolaMenuTipo();
                alert('Spesa salvata con successo!');
            } catch (error) {
                console.error('Errore nel salvataggio:', error);
                alert('Errore nel salvataggio della spesa');
            }
        });
    } catch (error) {
        console.error('Errore inizializzazione:', error);
    }
});