/**
 * js/api.js
 * Questo file agisce da "Service Layer" lato client.
 * Isola tutta la logica di rete (le chiamate fetch al backend) in un unico file,
 * rendendo il resto del codice UI (home.js e quiz.js) molto più pulito e manutenibile.
 */

// L'URL base in cui il server Node è in ascolto
const BASE_URL = 'http://localhost:3000/api';


async function fetchApi(endpoint, options = {}) {
    try {
        // 'await' mette in pausa l'esecuzione di questa funzione finché la risposta di rete non arriva
        const response = await fetch(`${BASE_URL}${endpoint}`, options);

        if (!response.ok) {
            throw new Error(`Errore HTTP generato dal server: ${response.status}`);
        }

        // Facciamo il parsing del corpo della risposta HTTP in un oggetto Javascript
        return await response.json();
    } catch (error) {
        // Cattura gli errori (es. server spento = fetch failed, o il nostro throw qui sopra)
        console.error('Si è verificato un errore in fetchApi:', error);

        // Rilanciamo l'errore per farlo gestire a chi ha chiamato questa funzione (es. home.js mostrerà l'UI rossa)
        throw error;
    }
}

//definiamo le routes principali dell'API
const API = {
    // Chiama GET /api/quizzes
    getQuizzes: () => fetchApi('/quizzes'),

    // Chiama GET /api/quizzes/:id
    getQuizById: (id) => fetchApi(`/quizzes/${id}`),

    // Invia dati al server tramite POST /api/scores
    saveScore: (data) => fetchApi('/scores', {
        method: 'POST', // Specifichiamo il verbo POST per inviare (creare) dati
        headers: {
            // Diciamo al server (express.json() middleware) che il corpo è formattato in JSON
            'Content-Type': 'application/json'
        },
        // Serializziamo l'oggetto JS 'data' trasformandolo in stringa JSON da allegare nel body HTTP
        body: JSON.stringify(data)
    })
};
